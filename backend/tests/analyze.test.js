import request from 'supertest';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import app from '../app.js';
import User from '../models/User.js';
import Scan from '../models/Scan.js';
import generateToken from '../utils/generateToken.js';

describe('Analyze & Scans Endpoints', () => {
  let token;
  let user;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://127.0.0.1:27017/ethicalai_test');
    }

    // Pre-create user for auth token
    user = await User.create({
      name: 'Scan Test User',
      email: 'scanuser@example.com',
      password: 'scanpassword123',
    });

    token = generateToken(user._id);
  });

  afterEach(async () => {
    await Scan.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/analyze', () => {
    it('should successfully scan a website and return the score, saving user context', async () => {
      // Mock global fetch for the ML service API call
      const mockMlResponse = {
        trust_score: 95,
        risk_score: 5,
        risk_level: 'Low',
        features: { having_IP_Address: 1 },
        reasons: [{ label: 'SSL: pass', passed: true }],
        suggestions: ['Good config'],
      };

      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMlResponse),
        })
      );

      const res = await request(app)
        .post('/api/analyze')
        .set('Authorization', `Bearer ${token}`)
        .send({
          url: 'testsite.com',
        });

      // Restore original fetch
      global.fetch = originalFetch;

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('trustScore', 95);
      expect(res.body.data).toHaveProperty('riskScore', 5);
      expect(res.body.data).toHaveProperty('riskLevel', 'Low');
      expect(res.body.data.reasons[0]).toHaveProperty('label', 'SSL: pass');

      // Verify it was stored in the database with the logged-in user
      const scan = await Scan.findOne({ url: 'testsite.com' });
      expect(scan).not.toBeNull();
      expect(scan.user.toString()).toBe(user._id.toString());
    });
  });

  describe('GET /api/scans', () => {
    it('should block query access and return 401 without token', async () => {
      const res = await request(app).get('/api/scans');
      expect(res.status).toBe(401);
    });

    it('should allow query access and return 200 with valid token', async () => {
      // Pre-seed a scan
      await Scan.create({
        user: user._id,
        url: 'github.com',
        trustScore: 90,
        riskScore: 10,
        riskLevel: 'Low',
        reasons: [],
        suggestions: [],
      });

      const res = await request(app)
        .get('/api/scans')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('results', 1);
      expect(res.body.data[0]).toHaveProperty('url', 'github.com');
    });
  });
});
