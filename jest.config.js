module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.js', '**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', 'setup.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    // Map webpack aliases for Jest
    '^objects/(.*)$': '<rootDir>/src/objects/$1',
    '^struct/(.*)$': '<rootDir>/src/struct/$1',
    '^util/(.*)$': '<rootDir>/src/util/$1',
    '^scenes/(.*)$': '<rootDir>/src/scenes/$1'
  },
  // Mock Phaser since it's a browser library
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  collectCoverageFrom: [
    'src/objects/boat/**/*.js',
    '!src/**/__tests__/**'
  ]
}
