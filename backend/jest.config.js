module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/__tests__/',
      '/dist/'
    ],
    setupFilesAfterEnv: ['./jest.setup.js']
  };