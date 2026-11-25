const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have',
  'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may',
  'might', 'can', 'this', 'that', 'these', 'those', 'it', 'its', 'they', 'their',
  'them', 'he', 'she', 'his', 'her', 'we', 'our', 'you', 'your', 'which', 'who',
  'whom', 'what', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
  'few', 'more', 'most', 'other', 'some', 'such', 'than', 'too', 'very', 'just',
  'also', 'into', 'over', 'after', 'before', 'between', 'under', 'above', 'about'
]);

const NEGATION_PATTERN = /\b(not|never|no|none|neither|nor|cannot|can't|won't|wouldn't|shouldn't|couldn't|didn't|doesn't|isn't|aren't|wasn't|weren't|without|lack|lacks|lacked|false|incorrect|impossible|unable)\b/i;

function isPrivateHostname(hostname) {
  const lower = (hostname || '').toLowerCase();
  if (!lower || lower === 'localhost' || lower.endsWith('.local')) return true;
  if (/^127\./.test(lower) || /^10\./.test(lower) || /^192\.168\./.test(lower)) return true;
  if (/^169\.254\./.test(lower) || lower === '::1' || lower === '0.0.0.0') return true;
  const match172 = lower.match(/^172\.(\d+)\./);
  if (match172) {
    const second = Number(match172[1]);
    if (second >= 16 && second <= 31) return true;
  }
  return false;
}

function stripHtmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchUrlText(rawUrl) {
  let parsed;
  try {
    const normalized = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    parsed = new URL(normalized);
  } catch {
    return { ok: false, text: '', error: 'Invalid source URL format.' };
  }

  if (!['http:', 'https:'].includes(parsed.protocol) || isPrivateHostname(parsed.hostname)) {
    return { ok: false, text: '', error: 'Source URL protocol or host is not allowed.' };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5500);
    const res = await fetch(parsed.href, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'EthicalAI-HallucinationChecker/1.0',
        'Accept': 'text/html, text/plain, application/json'
      }
    });
    clearTimeout(timer);

    if (!res.ok) {
      return { ok: false, text: '', error: `Source URL returned HTTP ${res.status}.` };
    }

    const body = await res.text();
    const cleanText = stripHtmlToText(body).slice(0, 25000);
    return { ok: true, text: cleanText, finalUrl: res.url || parsed.href };
  } catch (err) {
    return { ok: false, text: '', error: err.message || 'Unable to fetch source URL.' };
  }
}

function splitSentences(text) {
  const protectedUrls = [];
  const masked = (text || '').replace(/https?:\/\/[^\s]+/gi, (match) => {
    const token = `__URL_${protectedUrls.length}__`;
    protectedUrls.push(match);
    return token;
  });

  const rawParts = masked
    .replace(/(\d)\.(\d)/g, '$1__DOT__$2')
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 8);

  return rawParts.map((part) => {
    let restored = part.replace(/__DOT__/g, '.');
    protectedUrls.forEach((url, idx) => {
      restored = restored.replace(`__URL_${idx}__`, url);
    });
    return restored;
  });
}

function tokenize(str) {
  return (str || '')
    .toLowerCase()
    .replace(/https?:\/\/[^\s]+/gi, ' ')
    .replace(/[^a-z0-9%\s.-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^[.-]+|[.-]+$/g, ''))
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

function extractNumbers(str) {
  const matches = (str || '').match(/\b\d+(?:[.,]\d+)?%?\b/g) || [];
  return [...new Set(matches.map((m) => m.replace(/,/g, '')))];
}

function extractYears(str) {
  const matches = (str || '').match(/\b(1[5-9]\d{2}|20[0-3]\d)\b/g) || [];
  return [...new Set(matches)];
}

function extractCitations(text) {
  const found = [];
  const seen = new Set();

  const urlMatches = (text || '').match(/https?:\/\/[^\s)>\]"']+/gi) || [];
  for (const raw of urlMatches) {
    const cleaned = raw.replace(/[.,;!?]+$/, '');
    if (!seen.has(cleaned)) {
      seen.add(cleaned);
      found.push({ target: cleaned, type: 'url' });
    }
  }

  const arxivMatches = (text || '').match(/\barxiv:\s*(\d{4}\.\d{4,5}(?:v\d+)?)/gi) || [];
  for (const raw of arxivMatches) {
    const id = raw.replace(/\barxiv:\s*/i, '');
    if (!seen.has(id)) {
      seen.add(id);
      found.push({ target: id, type: 'arxiv' });
    }
  }

  const doiMatches = (text || '').match(/\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+/gi) || [];
  for (const raw of doiMatches) {
    const doi = raw.replace(/[.,;!?]+$/, '');
    if (!seen.has(doi)) {
      seen.add(doi);
      found.push({ target: doi, type: 'doi' });
    }
  }

  return found.slice(0, 5);
}

async function verifyCitation(citation) {
  let checkUrl = citation.target;
  if (citation.type === 'arxiv') {
    checkUrl = `https://arxiv.org/abs/${citation.target}`;
  } else if (citation.type === 'doi') {
    checkUrl = `https://doi.org/api/handles/${encodeURIComponent(citation.target)}`;
  }

  try {
    const parsed = new URL(checkUrl);
    if (!['http:', 'https:'].includes(parsed.protocol) || isPrivateHostname(parsed.hostname)) {
      return { ...citation, status: 'broken', detail: 'Invalid or private citation host.' };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    const res = await fetch(parsed.href, {
      method: citation.type === 'url' ? 'GET' : 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'EthicalAI-CitationVerifier/1.0' }
    });
    clearTimeout(timer);

    if (citation.type === 'doi') {
      const json = await res.json().catch(() => null);
      if (res.ok && json && json.responseCode === 1) {
        return { ...citation, status: 'verified', detail: 'DOI resolves in official handle registry.' };
      }
      return { ...citation, status: 'broken', detail: 'DOI does not resolve in handle registry.' };
    }

    if (res.status >= 200 && res.status < 400) {
      return { ...citation, status: 'verified', detail: `Resolved with HTTP ${res.status}.` };
    }
    return { ...citation, status: 'broken', detail: `Returned HTTP ${res.status}.` };
  } catch {
    return { ...citation, status: 'broken', detail: 'Unreachable domain or request timed out.' };
  }
}

function extractCandidateEntities(sentence) {
  const matches = sentence.match(/\b[A-Z][a-zA-Z0-9-]+(?:\s+[A-Z][a-zA-Z0-9-]+){0,3}\b/g) || [];
  const filtered = matches.filter((m) => {
    const lower = m.toLowerCase();
    return !STOPWORDS.has(lower) && m.length >= 3;
  });
  return [...new Set(filtered)].slice(0, 2);
}

async function queryWikipediaSummary(entity) {
  try {
    const title = encodeURIComponent(entity.replace(/\s+/g, '_'));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'EthicalAI-FactGrounder/1.0' }
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json || json.type === 'disambiguation' || !json.extract) return null;
    return {
      title: json.title,
      extract: json.extract,
      url: json.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${title}`
    };
  } catch {
    return null;
  }
}

function detectInternalContradictions(sentences) {
  const contradictions = [];

  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      const tokensA = new Set(tokenize(sentences[i]));
      const tokensB = new Set(tokenize(sentences[j]));
      const shared = [...tokensA].filter((t) => tokensB.has(t) && !/^\d/.test(t));

      if (shared.length < 2) continue;

      const negA = NEGATION_PATTERN.test(sentences[i]);
      const negB = NEGATION_PATTERN.test(sentences[j]);

      const yearsA = extractYears(sentences[i]);
      const yearsB = extractYears(sentences[j]);
      const numsA = extractNumbers(sentences[i]);
      const numsB = extractNumbers(sentences[j]);

      const hasConflictingYears =
        yearsA.length > 0 &&
        yearsB.length > 0 &&
        !yearsA.some((y) => yearsB.includes(y));

      const hasConflictingNums =
        numsA.length > 0 &&
        numsB.length > 0 &&
        !numsA.some((n) => numsB.includes(n)) &&
        shared.length >= 3;

      const hasPolarityConflict = negA !== negB && shared.length >= 3;

      if (hasConflictingYears || hasConflictingNums || hasPolarityConflict) {
        const reason = hasPolarityConflict
          ? `Opposing polarity detected around "${shared.slice(0, 3).join(', ')}"`
          : hasConflictingYears
          ? `Conflicting year figures (${yearsA.join('/')} vs ${yearsB.join('/')}) on the same topic`
          : `Conflicting numerical figures (${numsA[0]} vs ${numsB[0]}) on "${shared.slice(0, 2).join(', ')}"`;

        contradictions.push({
          indices: [i, j],
          reason,
          sentences: [sentences[i], sentences[j]]
        });
      }
    }
  }

  return contradictions;
}

function evaluateAgainstContext(sentence, contextSentences, fullContextLower) {
  const sTokens = tokenize(sentence);
  if (sTokens.length === 0) {
    return { status: 'unverified', reason: 'Insufficient factual content to verify.', evidence: null };
  }

  let bestScore = 0;
  let bestMatch = '';

  for (const ctxSent of contextSentences) {
    const cSet = new Set(tokenize(ctxSent));
    if (cSet.size === 0) continue;
    const overlapCount = sTokens.filter((t) => cSet.has(t)).length;
    const score = overlapCount / Math.max(1, Math.min(sTokens.length, 10));
    if (score > bestScore) {
      bestScore = score;
      bestMatch = ctxSent;
    }
  }

  const sNums = extractNumbers(sentence);
  const sYears = extractYears(sentence);

  if (bestScore >= 0.45) {
    const missingYear = sYears.find((y) => !fullContextLower.includes(y));
    const missingNum = sNums.find((n) => !fullContextLower.includes(n.toLowerCase()));

    if (missingYear || missingNum) {
      const ctxNums = extractNumbers(bestMatch);
      return {
        status: 'contradicted',
        reason: `Numbers or dates (${missingYear || missingNum}) conflict with or are absent from the matched reference.`,
        evidence: bestMatch || null,
        contextNumbers: ctxNums
      };
    }

    return {
      status: 'supported',
      reason: 'Claim aligns with the provided reference source.',
      evidence: bestMatch || null
    };
  }

  if (bestScore >= 0.22) {
    return {
      status: 'unverified',
      reason: 'Partially related to reference source, but key details lack direct support.',
      evidence: bestMatch || null
    };
  }

  return {
    status: 'unverified',
    reason: 'Claim does not appear in the provided reference source.',
    evidence: null
  };
}

export async function analyzeHallucinations({ text, context = '', sourceUrl = '' }) {
  const cleanText = (text || '').trim();
  const sentences = splitSentences(cleanText);

  let combinedContext = (context || '').trim();
  let sourceFetchStatus = null;

  if (sourceUrl && sourceUrl.trim()) {
    const fetched = await fetchUrlText(sourceUrl.trim());
    if (fetched.ok && fetched.text) {
      combinedContext = `${combinedContext}\n${fetched.text}`.trim();
      sourceFetchStatus = { ok: true, url: fetched.finalUrl };
    } else {
      sourceFetchStatus = { ok: false, error: fetched.error };
    }
  }

  const citations = extractCitations(cleanText);
  const verifiedCitations = await Promise.all(citations.map(verifyCitation));

  const internalContradictions = detectInternalContradictions(sentences);
  const contradictedSentenceMap = new Map();
  for (const c of internalContradictions) {
    for (const idx of c.indices) {
      if (!contradictedSentenceMap.has(idx)) {
        contradictedSentenceMap.set(idx, c.reason);
      }
    }
  }

  const hasReferenceContext = combinedContext.length > 0;
  const contextSentences = hasReferenceContext ? splitSentences(combinedContext) : [];
  const fullContextLower = combinedContext.toLowerCase();

  let wikiLookupsRemaining = hasReferenceContext ? 0 : 3;
  const wikiCache = new Map();

  const sentenceAnalysis = [];

  for (let i = 0; i < sentences.length; i++) {
    const sent = sentences[i];

    const brokenInSent = verifiedCitations.find(
      (c) => c.status === 'broken' && sent.includes(c.target)
    );
    if (brokenInSent) {
      sentenceAnalysis.push({
        index: i + 1,
        sentence: sent,
        status: 'contradicted',
        reason: `Contains unreachable or fabricated reference (${brokenInSent.target}): ${brokenInSent.detail}`,
        evidence: null
      });
      continue;
    }

    if (contradictedSentenceMap.has(i)) {
      sentenceAnalysis.push({
        index: i + 1,
        sentence: sent,
        status: 'contradicted',
        reason: contradictedSentenceMap.get(i),
        evidence: null
      });
      continue;
    }

    if (hasReferenceContext) {
      const ctxEval = evaluateAgainstContext(sent, contextSentences, fullContextLower);
      sentenceAnalysis.push({
        index: i + 1,
        sentence: sent,
        status: ctxEval.status,
        reason: ctxEval.reason,
        evidence: ctxEval.evidence
      });
      continue;
    }

    let wikiMatched = false;
    const entities = extractCandidateEntities(sent);
    if (entities.length > 0 && wikiLookupsRemaining > 0) {
      for (const entity of entities) {
        if (!wikiCache.has(entity) && wikiLookupsRemaining > 0) {
          wikiLookupsRemaining--;
          wikiCache.set(entity, await queryWikipediaSummary(entity));
        }
        const wiki = wikiCache.get(entity);
        if (wiki) {
          const wikiLower = wiki.extract.toLowerCase();
          const sentYears = extractYears(sent);
          const sentTokens = tokenize(sent);
          const wikiTokens = new Set(tokenize(wiki.extract));
          const overlap = sentTokens.filter((t) => wikiTokens.has(t)).length;

          const missingYear = sentYears.find((y) => !wikiLower.includes(y));
          if (sentYears.length > 0 && missingYear && overlap >= 2) {
            sentenceAnalysis.push({
              index: i + 1,
              sentence: sent,
              status: 'contradicted',
              reason: `Year ${missingYear} conflicts with Wikipedia summary for "${wiki.title}".`,
              evidence: `${wiki.extract.slice(0, 180)}… (${wiki.url})`
            });
            wikiMatched = true;
            break;
          }

          if (overlap >= 2 && (!sentYears.length || !missingYear)) {
            sentenceAnalysis.push({
              index: i + 1,
              sentence: sent,
              status: 'supported',
              reason: `Entity and claim context align with Wikipedia ("${wiki.title}").`,
              evidence: `${wiki.extract.slice(0, 180)}… (${wiki.url})`
            });
            wikiMatched = true;
            break;
          }
        }
      }
    }

    if (wikiMatched) continue;

    const verifiedInSent = verifiedCitations.find(
      (c) => c.status === 'verified' && sent.includes(c.target)
    );
    if (verifiedInSent) {
      sentenceAnalysis.push({
        index: i + 1,
        sentence: sent,
        status: 'supported',
        reason: `Cited ${verifiedInSent.type.toUpperCase()} (${verifiedInSent.target}) verified live.`,
        evidence: verifiedInSent.detail
      });
      continue;
    }

    const hasPrecisionStat = /\b\d+(?:\.\d+)?%|\b(studies prove|scientists confirmed|100% guaranteed|proven fact)\b/i.test(sent);
    sentenceAnalysis.push({
      index: i + 1,
      sentence: sent,
      status: 'unverified',
      reason: hasPrecisionStat
        ? 'Contains specific statistical or absolute claim without an accompanying verified citation or reference.'
        : 'No reference text or public knowledge match found for this claim.',
      evidence: null
    });
  }

  const totalSentences = sentenceAnalysis.length;
  const supportedCount = sentenceAnalysis.filter((s) => s.status === 'supported').length;
  const unverifiedCount = sentenceAnalysis.filter((s) => s.status === 'unverified').length;
  const contradictedCount = sentenceAnalysis.filter((s) => s.status === 'contradicted').length;
  const brokenCitations = verifiedCitations.filter((c) => c.status === 'broken').length;

  let score = 85;
  if (totalSentences > 0) {
    const supportedRatio = supportedCount / totalSentences;
    const unverifiedRatio = unverifiedCount / totalSentences;
    const contradictedRatio = contradictedCount / totalSentences;

    if (hasReferenceContext) {
      score = Math.round(
        100 - contradictedRatio * 85 - unverifiedRatio * 42 + supportedRatio * 10
      );
    } else {
      score = Math.round(
        92 - contradictedRatio * 75 - unverifiedRatio * 22 - brokenCitations * 18
      );
    }
  }
  score = Math.max(5, Math.min(99, score));

  const findings = [];
  if (contradictedCount > 0) {
    findings.push({
      label: `${contradictedCount} Contradicted or Fabricated Claim${contradictedCount > 1 ? 's' : ''}`,
      severity: contradictedCount >= 2 ? 'critical' : 'high',
      description: 'Detected internal contradictions, conflicting dates/numbers, or broken references.',
      action: 'Remove or verify flagged statements against authoritative primary sources.'
    });
  }
  if (brokenCitations > 0) {
    findings.push({
      label: `${brokenCitations} Unreachable Citation${brokenCitations > 1 ? 's' : ''}`,
      severity: 'critical',
      description: 'One or more URLs, DOIs, or arXiv references failed live resolution checks.',
      action: 'Replace hallucinated or dead citations with verified working references.'
    });
  }
  if (unverifiedCount > 0) {
    findings.push({
      label: `${unverifiedCount} Unverified Claim${unverifiedCount > 1 ? 's' : ''}`,
      severity: unverifiedCount > supportedCount ? 'medium' : 'low',
      description: hasReferenceContext
        ? 'Claims found in AI output that lack direct support in the provided reference.'
        : 'Claims lacked a reference source or public Wikipedia entity match.',
      action: 'Paste a reference document or source URL to ground unverified claims.'
    });
  }
  if (findings.length === 0) {
    findings.push({
      label: 'Consistent & Grounded Output',
      severity: 'low',
      description: 'No contradictions, broken citations, or ungrounded claims detected.',
      action: 'Maintain source attribution for ongoing auditability.'
    });
  }

  const verdict =
    score >= 70
      ? 'Grounded & Consistent'
      : score >= 50
      ? 'Needs Verification'
      : 'High Hallucination Risk';

  return {
    score,
    hallucinationRisk: 100 - score,
    verdict,
    mode: hasReferenceContext ? 'context-grounded' : 'standalone-text',
    sourceFetchStatus,
    checkedAt: new Date().toISOString(),
    summary: {
      totalSentences,
      supportedCount,
      unverifiedCount,
      contradictedCount,
      citationsChecked: verifiedCitations.length,
      brokenCitations
    },
    citations: verifiedCitations,
    sentenceAnalysis,
    findings
  };
}
