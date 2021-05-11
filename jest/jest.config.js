module.exports = {
    globals: {
    },
    rootDir: process.cwd(),
    moduleFileExtensions: ['ts', 'tsx', 'js', 'node', 'json'],
    transform: {
        '^.+\\.tsx?$': 'babel-jest',
    },
    testMatch: [
        "<rootDir>/src/**/__tests__/**/*.ts?(x)",
        "<rootDir>/src/**/?(*.)(spec|test).ts?(x)"
    ],
    testEnvironment: 'jsdom',
    collectCoverageFrom: [
        // 'src/**/*.[jt]s?(x)',
        'src/redux/epics/**/*.[jt]s?(x)',
        '!**/node_modules/**'
    ],
    coverageReporters: ['json', 'html'],
    testEnvironment: './jest/env.js',
    setupFilesAfterEnv: ['./jest/jest.setup.js'],
    transformIgnorePatterns: ['/node_modules/(?!@polkadot|@babel/runtime/helpers/esm/)']
};
