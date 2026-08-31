import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// eslint-config-next is still eslintrc-shaped at Next 15. It exports a flat array
// from Next 16 on, at which point this compat layer becomes:
//   import nextVitals from 'eslint-config-next/core-web-vitals'
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'public/_pagefind/**'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      'no-console': 'warn',
    },
  },
  {
    // Nextra's _meta files and the tooling configs are required to default-export
    // an anonymous object. The rule has nothing useful to say about them.
    files: ['**/_meta.ts', '**/_meta.tsx', '*.config.mjs', '*.config.js'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
];
