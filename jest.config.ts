import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleDirectories: ['node_modules', '<rootDir>'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testMatch: ['<rootDir>/src/__tests__/**/*.test.ts?(x)'],
    silent: true,
    collectCoverage: true,
    transformIgnorePatterns: ['/node_modules/(?!react-dnd)/'],
};

export default config;
