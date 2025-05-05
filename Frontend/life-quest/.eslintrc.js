module.exports = {
    extends: [
      'next/core-web-vitals',
      // Add other extends as needed
    ],
    rules: {
      // Add project-wide rules here
    },
    overrides: [
      {
        // Disable certain rules for test files
        files: ['**/*.test.js', '**/*.test.jsx', '**/*.test.ts', '**/*.test.tsx', '**/*.spec.js', '**/*.spec.jsx', '**/*.spec.ts', '**/*.spec.tsx'],
        rules: {
          '@typescript-eslint/no-unused-vars': 'off',
          '@next/next/no-img-element': 'off',
          // Add other rules to disable for test files
        },
      },
    ],
  };