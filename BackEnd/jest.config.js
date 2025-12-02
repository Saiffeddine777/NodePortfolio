/** @type{import('ts-jest').JestConfigWithTsJest} */

module.exports={
    preset :'ts-jest',
    testEnvironment : 'node',
    testMatch : "**/Tests/**/*.test.ts",
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    clearMocks : true
}