import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Scan from '../models/Scan.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SCANS_FILE = path.join(DATA_DIR, 'scans.json');

// Ensure local data storage directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJsonFile(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.warn(`[Storage Warning] Failed reading ${filePath}:`, err.message);
    return defaultValue;
  }
}

function writeJsonFile(filePath, data) {
  try {
    const tempFile = `${filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempFile, filePath);
  } catch (err) {
    console.warn(`[Storage Warning] Failed writing ${filePath}:`, err.message);
  }
}

export const isMongoConnected = () => mongoose.connection.readyState === 1;

/**
 * Finds a user by email address.
 * Falls back to local JSON file when MongoDB is offline.
 */
export const findUserByEmail = async (email, includePassword = false) => {
  const cleanEmail = (email || '').toLowerCase().trim();
  if (isMongoConnected()) {
    try {
      const query = User.findOne({ email: cleanEmail });
      if (includePassword) query.select('+password');
      const user = await query;
      if (user) return user;
    } catch (err) {
      console.warn('[MongoDB Error, falling back to local file]:', err.message);
    }
  }

  const users = readJsonFile(USERS_FILE);
  const user = users.find(u => (u.email || '').toLowerCase() === cleanEmail);
  if (!user) return null;

  return {
    _id: user._id || user.id,
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    createdAt: user.createdAt,
    matchPassword: async (enteredPassword) => {
      return await bcrypt.compare(enteredPassword, user.password);
    }
  };
};

/**
 * Finds a user by ID.
 * Falls back to local JSON file when MongoDB is offline.
 */
export const findUserById = async (id) => {
  if (!id) return null;
  const idStr = id.toString();

  if (isMongoConnected() && mongoose.Types.ObjectId.isValid(idStr)) {
    try {
      const user = await User.findById(idStr);
      if (user) return user;
    } catch (err) {
      console.warn('[MongoDB Error, falling back to local file]:', err.message);
    }
  }

  const users = readJsonFile(USERS_FILE);
  const user = users.find(u => ((u._id && u._id.toString() === idStr) || (u.id && u.id.toString() === idStr)));
  if (!user) return null;

  return {
    _id: user._id || user.id,
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    matchPassword: async (enteredPassword) => {
      return await bcrypt.compare(enteredPassword, user.password);
    }
  };
};

/**
 * Creates a new user record.
 * Falls back to local JSON file when MongoDB is offline.
 */
export const createUser = async ({ name, email, password }) => {
  const cleanEmail = (email || '').toLowerCase().trim();

  if (isMongoConnected()) {
    try {
      const user = await User.create({ name: name.trim(), email: cleanEmail, password });
      return {
        _id: user._id.toString(),
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      };
    } catch (err) {
      console.warn('[MongoDB User Creation Error, falling back to local file]:', err.message);
    }
  }

  const users = readJsonFile(USERS_FILE);
  if (users.some(u => (u.email || '').toLowerCase() === cleanEmail)) {
    throw new Error('User already exists with this email');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const id = new mongoose.Types.ObjectId().toString();
  const now = new Date().toISOString();

  const newUser = {
    _id: id,
    id: id,
    name: name.trim(),
    email: cleanEmail,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now
  };

  users.push(newUser);
  writeJsonFile(USERS_FILE, users);

  return {
    _id: id,
    id: id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt
  };
};

/**
 * Saves a scan record.
 * Falls back to local JSON file when MongoDB is offline.
 */
export const saveScan = async ({
  userId = null,
  url,
  trustScore,
  riskScore,
  riskLevel,
  reasons = [],
  suggestions = [],
  rawFeatures = {},
  techStack = {}
}) => {
  const createdAt = new Date().toISOString();
  const userIdStr = userId ? userId.toString() : null;

  if (isMongoConnected()) {
    try {
      const scan = await Scan.create({
        user: userIdStr && mongoose.Types.ObjectId.isValid(userIdStr) ? userIdStr : null,
        url,
        trustScore,
        riskScore,
        riskLevel,
        reasons,
        suggestions,
        rawFeatures,
        techStack
      });
      return {
        _id: scan._id.toString(),
        id: scan._id.toString(),
        createdAt: scan.createdAt
      };
    } catch (err) {
      console.warn('[MongoDB Scan Save Error, falling back to local file]:', err.message);
    }
  }

  const scans = readJsonFile(SCANS_FILE);
  const id = new mongoose.Types.ObjectId().toString();
  const newScan = {
    _id: id,
    id: id,
    user: userIdStr,
    userId: userIdStr,
    url,
    trustScore,
    riskScore,
    riskLevel,
    reasons,
    suggestions,
    rawFeatures,
    techStack,
    createdAt,
    updatedAt: createdAt
  };

  scans.unshift(newScan);
  writeJsonFile(SCANS_FILE, scans);

  return {
    _id: id,
    id: id,
    createdAt
  };
};

/**
 * Retrieves all scans for a specific user, newest first.
 */
export const getUserScans = async (userId) => {
  if (!userId) return [];
  const userIdStr = userId.toString();

  if (isMongoConnected() && mongoose.Types.ObjectId.isValid(userIdStr)) {
    try {
      return await Scan.find({ user: userIdStr }).sort({ createdAt: -1 });
    } catch (err) {
      console.warn('[MongoDB Fetch Scans Error, falling back to local file]:', err.message);
    }
  }

  const scans = readJsonFile(SCANS_FILE);
  return scans.filter(s => (s.user === userIdStr || s.userId === userIdStr));
};

/**
 * Retrieves a single scan by ID.
 */
export const getScanById = async (id) => {
  if (!id) return null;
  const idStr = id.toString();

  if (isMongoConnected() && mongoose.Types.ObjectId.isValid(idStr)) {
    try {
      const s = await Scan.findById(idStr);
      if (s) return s;
    } catch (err) {
      console.warn('[MongoDB Get Scan Error, falling back to local file]:', err.message);
    }
  }

  const scans = readJsonFile(SCANS_FILE);
  return scans.find(s => ((s._id && s._id.toString() === idStr) || (s.id && s.id.toString() === idStr))) || null;
};
