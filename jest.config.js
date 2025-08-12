module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'backend/**/*.ts',
    '!backend/**/*.d.ts',
    '!backend/**/*.test.ts',
    '!backend/**/*.spec.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/backend/$1',
    '^@/agents/(.*)$': '<rootDir>/backend/agents/$1',
    '^@/core/(.*)$': '<rootDir>/backend/core/$1',
    '^@/utils/(.*)$': '<rootDir>/backend/utils/$1',
    '^@/types/(.*)$': '<rootDir>/backend/types/$1',
    '^@/config/(.*)$': '<rootDir>/backend/config/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000,
};