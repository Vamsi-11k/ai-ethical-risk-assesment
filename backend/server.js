import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Initialize Database connection before listening to requests
connectDB();

app.listen(PORT, () => {
  console.log(`[EthicalAI Server] Running on http://localhost:${PORT}`);
  console.log(`[EthicalAI Server] Health check available at http://localhost:${PORT}/api/health`);
});
