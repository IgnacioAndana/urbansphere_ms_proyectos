#!/usr/bin/env node
/**
 * Ejecuta Jest con cobertura y genera el informe Markdown/JSON.
 * Un solo script evita salida duplicada de npm lifecycle (pretest) en Windows.
 */

import { mkdirSync } from 'fs';
import { spawnSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const raiz = join(__dirname, '..');

mkdirSync(join(raiz, 'test-results'), { recursive: true });

const jestArgs = [
  '--coverage',
  '--json',
  '--outputFile=test-results/jest-results.json',
  '--coverageReporters=text',
  '--coverageReporters=text-summary',
  '--coverageReporters=lcov',
  '--coverageReporters=json-summary',
];

const jest = spawnSync('npx', ['jest', ...jestArgs], {
  cwd: raiz,
  stdio: 'inherit',
  shell: true,
});

if (jest.status !== 0) {
  process.exit(jest.status ?? 1);
}

const informe = spawnSync('node', ['scripts/generar-informe-pruebas.mjs'], {
  cwd: raiz,
  stdio: 'inherit',
  shell: true,
});

process.exit(informe.status ?? 0);
