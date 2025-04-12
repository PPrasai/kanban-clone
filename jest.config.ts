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
    transformIgnorePatterns: [
        'node_modules/(?!(react-dnd|dnd-core|@react-dnd|react-dnd-html5-backend)/)',
    ],
};

export default config;
