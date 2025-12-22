const axios = require('axios');

/**
 * HTTP Client for Inter-Service Communication
 * Configured with retry logic, timeout, and error handling
 */
const httpClient = axios.create({
  timeout: parseInt(process.env.API_TIMEOUT) || 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request interceptor for logging
 */
httpClient.interceptors.request.use(
  (config) => {
    console.log(`🔄 Inter-service request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error.message);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for logging and error handling
 */
httpClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Inter-service response: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error details
    if (error.response) {
      console.error(`❌ Inter-service error: ${error.config.url} - Status: ${error.response.status}`);
    } else if (error.request) {
      console.error(`❌ Inter-service error: ${error.config.url} - No response received`);
    } else {
      console.error(`❌ Inter-service error: ${error.message}`);
    }

    // Retry logic for network errors (optional - can be enabled if needed)
    if (!originalRequest._retry && (!error.response || error.response.status >= 500)) {
      originalRequest._retry = true;
      // Wait for 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return httpClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

module.exports = httpClient;
