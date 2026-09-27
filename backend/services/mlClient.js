import AppError from '../utils/AppError.js';

/**
 * Sends a URL to the Python FastAPI microservice for feature extraction and ML scoring.
 * @param {string} url - The URL to scan
 * @returns {Promise<object>} - The parsed JSON response from the ML service
 */
export const scoreUrl = async (url) => {
  const primaryUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
  const fallbackUrl = primaryUrl.includes('localhost')
    ? primaryUrl.replace('localhost', '127.0.0.1')
    : (primaryUrl.includes('127.0.0.1') ? primaryUrl.replace('127.0.0.1', 'localhost') : null);

  const callScore = async (baseUrl) => {
    return await fetch(`${baseUrl}/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
  };

  let response;
  try {
    response = await callScore(primaryUrl);
  } catch (err) {
    if (fallbackUrl) {
      try {
        response = await callScore(fallbackUrl);
      } catch (fallbackErr) {
        throw new AppError(`ML service is unreachable at ${primaryUrl}`, 502);
      }
    } else {
      throw new AppError(`ML service is unreachable at ${primaryUrl}`, 502);
    }
  }

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
};
