import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Scan from '../models/Scan.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SCANS_FILE = path.join(DATA_DIR, 'scans.json');

async function sync() {
  const conn = await connectDB();
  if (!conn) {
    console.error('Failed to establish MongoDB connection.');
    process.exit(1);
  }

  try {
    const userCount = await User.countDocuments();
    console.log(`Current MongoDB users: ${userCount}`);

    if (fs.existsSync(USERS_FILE)) {
      const rawUsers = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');
      let addedUsers = 0;
      for (const u of rawUsers) {
        const email = (u.email || '').toLowerCase().trim();
        const existing = await User.findOne({ email });
        if (!existing) {
          await User.collection.insertOne({
            _id: mongoose.Types.ObjectId.isValid(u._id || u.id)
              ? new mongoose.Types.ObjectId(u._id || u.id)
              : new mongoose.Types.ObjectId(),
            name: u.name,
            email,
            password: u.password,
            createdAt: new Date(u.createdAt || Date.now()),
            updatedAt: new Date(u.updatedAt || Date.now()),
          });
          addedUsers++;
        }
      }
      console.log(`Synced ${addedUsers} new users from local file.`);
    }

    const scanCount = await Scan.countDocuments();
    console.log(`Current MongoDB scans: ${scanCount}`);

    if (fs.existsSync(SCANS_FILE)) {
      const rawScans = JSON.parse(fs.readFileSync(SCANS_FILE, 'utf8') || '[]');
      let addedScans = 0;
      for (const s of rawScans) {
        const scanId = mongoose.Types.ObjectId.isValid(s._id || s.id)
          ? new mongoose.Types.ObjectId(s._id || s.id)
          : null;

        const existing = scanId ? await Scan.findById(scanId) : null;
        if (!existing) {
          let userOid = null;
          const uId = s.user || s.userId;
          if (uId && mongoose.Types.ObjectId.isValid(uId)) {
            userOid = new mongoose.Types.ObjectId(uId);
          }

          await Scan.collection.insertOne({
            _id: scanId || new mongoose.Types.ObjectId(),
            user: userOid,
            url: s.url,
            trustScore: s.trustScore,
            riskScore: s.riskScore,
            riskLevel: s.riskLevel,
            reasons: s.reasons || [],
            suggestions: s.suggestions || [],
            rawFeatures: s.rawFeatures || {},
            techStack: s.techStack || {},
            createdAt: new Date(s.createdAt || Date.now()),
            updatedAt: new Date(s.updatedAt || Date.now()),
          });
          addedScans++;
        }
      }
      console.log(`Synced ${addedScans} new scans from local file.`);
    }

    const totalUsers = await User.countDocuments();
    const totalScans = await Scan.countDocuments();
    console.log(`[Summary] Total users in MongoDB: ${totalUsers}, Total scans in MongoDB: ${totalScans}`);
  } catch (err) {
    console.error('Error during data sync:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
    process.exit(0);
  }
}

sync();
