import { validationResult } from 'express-validator';
import Scan from '../models/Scan.js';
import { scoreUrl } from '../services/mlClient.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

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

  // Map FastAPI response keys to Scan model properties
  const scan = await Scan.create({
    user: req.user ? req.user._id : null,
    url,
    trustScore: mlResponse.trust_score,
    riskScore: mlResponse.risk_score,
    riskLevel: mlResponse.risk_level,
    reasons: mlResponse.reasons,
    suggestions: mlResponse.suggestions,
    rawFeatures: mlResponse.features
  });

  res.status(200).json({
    status: 'success',
    data: {
      id: scan._id,
      url: scan.url,
      trustScore: scan.trustScore,
      riskScore: scan.riskScore,
      riskLevel: scan.riskLevel,
      reasons: scan.reasons,
      suggestions: scan.suggestions,
      scannedAt: scan.createdAt
    }
  });
});

export const getMyScans = asyncHandler(async (req, res, next) => {
  // Retrieve scans belonging to the logged-in user, sorted by newest first
  const scans = await Scan.find({ user: req.user._id }).sort({ createdAt: -1 });

  const formattedScans = scans.map(scan => ({
    id: scan._id,
    url: scan.url,
    trustScore: scan.trustScore,
    riskScore: scan.riskScore,
    riskLevel: scan.riskLevel,
    reasons: scan.reasons,
    suggestions: scan.suggestions,
    scannedAt: scan.createdAt
  }));

  res.status(200).json({
    status: 'success',
    results: formattedScans.length,
    data: formattedScans
  });
});
