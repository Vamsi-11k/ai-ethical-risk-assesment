/**
 * Health check controller
 * GET /api/health
 */
export const getHealth = (req, res) => {
  try {
    return res.status(200).json({
      status: "OK",
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
