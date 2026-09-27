import { validationResult } from 'express-validator';
import { scoreUrl } from '../services/mlClient.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as storageService from '../services/storageService.js';

export const analyzeSystem = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsgs = errors.array().map((err) => err.msg).join(', ');
    return next(new AppError(errorMsgs, 400));
  }

  let { url } = req.body;
  url = url.trim();

  // Basic url format pre-check
  if (!url.includes('.')) {
    return next(new AppError('Invalid URL format. Please provide a valid domain name (e.g. example.com).', 400));
  }

  // Call FastAPI ML service client
  const mlResponse = await scoreUrl(url);

  let scanId = null;
  let createdAt = new Date().toISOString();
  const detectedTech = mlResponse.tech_stack || {};

  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    const scan = await storageService.saveScan({
      userId,
      url,
      trustScore: mlResponse.trust_score,
      riskScore: mlResponse.risk_score,
      riskLevel: mlResponse.risk_level,
      reasons: mlResponse.reasons,
      suggestions: mlResponse.suggestions,
      rawFeatures: mlResponse.features,
      techStack: detectedTech
    });
    scanId = scan._id || scan.id;
    createdAt = scan.createdAt || createdAt;
  } catch (dbErr) {
    console.warn('[Storage Warning] Could not persist scan record:', dbErr.message);
  }

  res.status(200).json({
    status: 'success',
    data: {
      id: scanId,
      url,
      trustScore: mlResponse.trust_score,
      riskScore: mlResponse.risk_score,
      riskLevel: mlResponse.risk_level,
      reasons: mlResponse.reasons,
      suggestions: mlResponse.suggestions,
      techStack: detectedTech,
      tech_stack: detectedTech,
      scannedAt: createdAt
    }
  });
});

export const getMyScans = asyncHandler(async (req, res, next) => {
  const userId = req.user ? (req.user._id || req.user.id) : null;
  const scans = await storageService.getUserScans(userId);

  const formattedScans = scans.map(scan => ({
    id: scan._id || scan.id,
    url: scan.url,
    trustScore: scan.trustScore,
    riskScore: scan.riskScore,
    riskLevel: scan.riskLevel,
    reasons: scan.reasons,
    suggestions: scan.suggestions,
    techStack: scan.techStack || {},
    scannedAt: scan.createdAt
  }));

  res.status(200).json({
    status: 'success',
    results: formattedScans.length,
    data: formattedScans
  });
});

export const getScanTechStack = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (id) {
    const scan = await storageService.getScanById(id);
    if (scan && scan.techStack && Object.keys(scan.techStack).length > 0) {
      return res.status(200).json({
        status: 'success',
        data: {
          techStack: scan.techStack,
          tech_stack: scan.techStack
        }
      });
    }
  }

  // If not found in DB or DB offline, query parameter fallback
  const urlParam = req.query.url;
  if (urlParam) {
    const mlResponse = await scoreUrl(urlParam);
    return res.status(200).json({
      status: 'success',
      data: {
        techStack: mlResponse.tech_stack || {},
        tech_stack: mlResponse.tech_stack || {}
      }
    });
  }

  return res.status(200).json({
    status: 'success',
    data: {
      techStack: {},
      tech_stack: {}
    }
  });
});
