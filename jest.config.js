module.exports = {
    transform: { '^.+\\.ts?$': 'ts-jest' },
    testEnvironment: 'node',
    // testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
    testRegex: '/src/.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverageFrom: ['src/functions/**/*.ts', 'src/stores/**/*.ts', '!src/**/*.d.ts'],
    coverageProvider: 'v8',
    coverageReporters: ['text', 'html'],
}
