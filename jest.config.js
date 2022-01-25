/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      statements: 75,
    },
  },
  collectCoverageFrom: [
    '<rootDir>/src/**',
    '!<rootDir>/src/main.ts',
    '!**/*.module.{js,ts}',
    '!**/*.schema.{js,ts}',
    '!**/*.repository.{js,ts}',
  ],
  coveragePathIgnorePatterns: ['<rootDir>/src/types'],
};
