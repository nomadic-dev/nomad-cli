
const path = require('path');
const { PROJ_ROOT, CLI_ROOT } = process.env

const enzymeToJson = path.join(CLI_ROOT, 'node_modules/enzyme-to-json/serializer');

const setupTest = path.join(CLI_ROOT, 'lib/jest/setupTests.js');
const jestTestLib = path.join(CLI_ROOT, 'node_modules/@testing-library/jest-dom/extend-expect');

const dotenvPath = path.join(CLI_ROOT, 'node_modules/dotenv');

const cssTransform = path.join(CLI_ROOT, 'lib/jest/cssTransform.js');
const fileTransform = path.join(CLI_ROOT, 'lib/jest/fileTransform.js');
const babelJest = path.join(CLI_ROOT, 'node_modules/babel-jest');

const envConfig = require(dotenvPath).config({ path: '.env.jest' });

module.exports = {
  verbose: true,
	rootDir: PROJ_ROOT,
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/public/', '/dist/', '/build/'],
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    "^app/(.*)$": "<rootDir>/src/$1",
    '\\.(css|less|scss|sass)$': cssTransform
  },
  snapshotSerializers: [ enzymeToJson ],
	setupFilesAfterEnv: [ setupTest, jestTestLib ],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
	globals: {
		...envConfig,
	},
  transform: {
		'^.+\\.(js|jsx|ts|tsx|mjs)$': [ babelJest, { configFile: path.resolve(CLI_ROOT, 'lib/babel') }],
		'^.+\\.(css|less)$': cssTransform,
		'^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': fileTransform
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\](?!(@carvana[/\\\\])).+\\.(js|jsx|mjs)$',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  collectCoverage: false,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx,ts,tsx,mjs}',
    '!src/**/index.(j|t)sx?'
  ],
  coverageReporters: ['json', 'lcov', 'text']
};
