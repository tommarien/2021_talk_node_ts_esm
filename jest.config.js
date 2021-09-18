/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  // We need to remove .js extension again see https://github.com/kulshekhar/ts-jest/issues/1709
  moduleNameMapper: {
    '^(\\./.*)\\.js$': '$1',
  },
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
