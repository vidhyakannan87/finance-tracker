export const moduleNameMapper = {
    '^data_access/(.*)$': '<rootDir>/src/data_access/$1',
    '^common/(.*)$': '<rootDir>/src/common/$1',
};
export const moduleFileExtensions = ['ts', 'js', 'json'];
export const transform = {
    '^.+\\.ts$': 'ts-jest',
};
export const testEnvironment = 'node';
export const roots = ['<rootDir>/src'];
  