export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        "<rootDir>/src/**/*.(test).{js,jsx,ts,tsx}",
        "<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts,tsx}"
    ],
};
