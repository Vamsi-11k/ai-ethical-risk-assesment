import mongoose from 'mongoose';

/**
 * Health check controller
 * GET /api/health
 */
export const getHealth = (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    return res.status(200).json({
      status: "OK",
      database: isDbConnected ? "connected" : "disconnected",
      host: isDbConnected ? mongoose.connection.host : null,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()) + "s"
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
};
