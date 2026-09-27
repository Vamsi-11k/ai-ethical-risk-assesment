import 'dotenv/config';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Connect to separate test database
    if (mongoose.connection.readyState === 0) {
      const baseUri = process.env.MONGODB_URI || process.env.MONGO_URI;
      let testUri = 'mongodb://127.0.0.1:27017/ethicalai_test';
      if (baseUri) {
        try {
          const parsed = new URL(baseUri);
          parsed.pathname = '/ethicalai_test';
          testUri = parsed.toString();
        } catch {
          testUri = baseUri;
        }
      }
      await mongoose.connect(testUri, { serverSelectionTimeoutMS: 10000 });
    }
    await User.deleteMany({});
  }, 15000);

  afterEach(async () => {
    // Clear user collection
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Disconnect database
    await mongoose.connection.close();
  });

  describe('POST /api/auth/signup', () => {
    it('should sign up a new user successfully and return user details and token', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'securepassword123',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('name', 'John Doe');
      expect(res.body.user).toHaveProperty('email', 'johndoe@example.com');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should reject signup with duplicate email and return 400', async () => {
      // Pre-create user
      await User.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'securepassword123',
      });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Jane Doe',
          email: 'johndoe@example.com',
          password: 'anotherpassword',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('status', 'error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Pre-create user for testing login
      await User.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'securepassword123',
      });
    });

    it('should log in an existing user successfully and return user details and token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'johndoe@example.com',
          password: 'securepassword123',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'johndoe@example.com');
    });

    it('should reject login with wrong password and return 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'johndoe@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('status', 'error');
    });
  });
});
