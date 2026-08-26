import AppError from '../utils/AppError.js';

/**
 * Sends a URL to the Python FastAPI microservice for feature extraction and ML scoring.
 * @param {string} url - The URL to scan
 * @returns {Promise<object>} - The parsed JSON response from the ML service
 */
export const scoreUrl = async (url) => {
  const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
  
  try {
    const response = await fetch(`${mlServiceUrl}/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let parsedError;
      try {
        parsedError = JSON.parse(errorText);
      } catch (e) {
        parsedError = { detail: errorText };
      }
      
      // Keep status code alignment
      const statusCode = response.status === 400 ? 400 : 502;
      throw new AppError(
        `ML service returned an error: ${parsedError.detail || 'Unknown error'}`,
        statusCode
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    // Network or connection failures
    throw new AppError(`ML service is unreachable at ${mlServiceUrl}`, 502);
  }
};
