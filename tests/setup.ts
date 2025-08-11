// Global test setup
import { jest } from '@jest/globals';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error'; // Reduce log noise in tests

// Global test timeout
jest.setTimeout(10000);

// Setup global mocks
beforeEach(() => {
  jest.clearAllMocks();
});
