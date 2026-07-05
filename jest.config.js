module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'modules/projects/{controllers,services,repositories}/**/*.ts',
    'modules/project-images/{controllers,services,repositories}/**/*.ts',
    'modules/typologies/{controllers,services,repositories}/**/*.ts',
    'modules/typology-images/{controllers,services,repositories}/**/*.ts',
    'modules/project-amenities/{controllers,services,repositories}/**/*.ts',
    'modules/storage/services/**/*.ts',
    '!**/*.spec.ts',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  coverageThreshold: {
    global: {
      branches: 58,
      functions: 85,
      lines: 90,
      statements: 88,
    },
  },
  coverageReporters: ['text', 'text-summary', 'lcov', 'json-summary'],
};
