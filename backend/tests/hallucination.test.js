import request from 'supertest';
import app from '../app.js';

describe('Hallucination Detection API', () => {
  it('returns 400 when text is missing or too short', async () => {
    const res = await request(app)
      .post('/api/hallucination')
      .send({ text: 'short' });

    expect(res.status).toBe(400);
  });

  it('flags internal contradictions in standalone AI text', async () => {
    const res = await request(app)
      .post('/api/hallucination')
      .send({
        text: 'Our neural engine reduced latency by 45% in 2023 across production clusters. However, benchmarks confirm the neural engine increased latency by 22% in 2021 across production clusters.'
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.summary.contradictedCount).toBeGreaterThan(0);
    expect(res.body.data.score).toBeLessThan(70);
  });

  it('verifies grounded claims against provided reference context', async () => {
    const res = await request(app)
      .post('/api/hallucination')
      .send({
        text: 'Python was created by Guido van Rossum and first released in 1991.',
        context: 'Python is a high-level programming language created by Guido van Rossum and first released in 1991.'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.mode).toBe('context-grounded');
    expect(res.body.data.summary.supportedCount).toBe(1);
    expect(res.body.data.score).toBeGreaterThanOrEqual(70);
  });

  it('flags context mismatch when years conflict with reference text', async () => {
    const res = await request(app)
      .post('/api/hallucination')
      .send({
        text: 'Python was created by Guido van Rossum and first released in 1999.',
        context: 'Python is a high-level programming language created by Guido van Rossum and first released in 1991.'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.summary.contradictedCount).toBe(1);
    expect(res.body.data.score).toBeLessThan(50);
  });
});
