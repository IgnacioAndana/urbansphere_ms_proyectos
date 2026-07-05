#!/usr/bin/env node
/**
 * Genera informe Markdown de pruebas a partir de Jest (coverage + JSON).
 * Uso: npm run test:report
 */

import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const raiz = join(__dirname, '..');

const resumenPath = join(raiz, 'coverage', 'coverage-summary.json');
const jestJsonPath = join(raiz, 'test-results', 'jest-results.json');
const salidaMd = join(raiz, 'docs', 'evidencia', 'informe-pruebas.md');
const salidaJson = join(raiz, 'docs', 'evidencia', 'informe-pruebas.json');

function leerJson(path) {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function formatoPorcentaje(valor) {
  return `${(valor * 100).toFixed(1)}%`;
}

const resumen = leerJson(resumenPath);
const jestResult = leerJson(jestJsonPath);

if (!resumen || !jestResult) {
  console.error('Faltan archivos de coverage o jest-results. Ejecuta: npm run test:report');
  process.exit(1);
}

const global = resumen.total;
const modulos = Object.entries(resumen)
  .filter(([clave]) => clave !== 'total')
  .map(([ruta, metricas]) => ({
    ruta: ruta.replace(/\\/g, '/').replace(`${raiz.replace(/\\/g, '/')}/src/`, ''),
    ...metricas,
  }))
  .sort((a, b) => b.lines.pct - a.lines.pct);

const fecha = new Date().toISOString().replace('T', ' ').slice(0, 19);
const suitesOk = jestResult.numPassedTestSuites ?? jestResult.numPassedTests;
const testsOk = jestResult.numPassedTests;
const testsTotal = jestResult.numTotalTests;
const exito = jestResult.success !== false;

const md = `# Informe de pruebas — MS Proyectos (UrbanSphere)

> Generado automáticamente el **${fecha} UTC**.  
> Comando: \`npm run test:report\`

## Resumen ejecutivo

| Indicador | Valor |
|-----------|-------|
| Estado | ${exito ? '**APROBADO**' : '**FALLIDO**'} |
| Suites | ${suitesOk} / ${jestResult.numTotalTestSuites ?? '-'} |
| Tests | ${testsOk} / ${testsTotal} |
| Cobertura líneas (global) | ${global.lines.pct}% |
| Cobertura funciones (global) | ${global.functions.pct}% |
| Cobertura ramas (global) | ${global.branches.pct}% |

## Cobertura global

| Métrica | Porcentaje |
|---------|------------|
| Statements | ${global.statements.pct}% |
| Branches | ${global.branches.pct}% |
| Functions | ${global.functions.pct}% |
| Lines | ${global.lines.pct}% |

## Cobertura por archivo (servicios, repositorios, controladores)

| Archivo | Líneas | Funciones | Ramas |
|---------|--------|-----------|-------|
${modulos
  .map(
    (m) =>
      `| \`${m.ruta}\` | ${m.lines.pct}% | ${m.functions.pct}% | ${m.branches.pct}% |`,
  )
  .join('\n')}

## Evidencia adicional

- Reporte HTML interactivo: abrir \`coverage/lcov-report/index.html\` en el navegador.
- Resultados JSON Jest: \`test-results/jest-results.json\`
- Resumen JSON cobertura: \`coverage/coverage-summary.json\`

## Alcance de las pruebas

- **Unitarias (Jest):** servicios de proyectos, catálogo batch, tipologías, imágenes, equipamiento, S3; repositorios y controladores del módulo projects.
- **E2E (opcional):** \`npm run test:e2e\` — requiere BD y \`E2E_JWT_TOKEN\`.

---

*Documento generado por \`scripts/generar-informe-pruebas.mjs\`. Puede adjuntarse al informe del proyecto.*
`;

const jsonInforme = {
  generadoEn: fecha,
  exito,
  tests: { pasados: testsOk, total: testsTotal },
  cobertura: {
    statements: global.statements.pct,
    branches: global.branches.pct,
    functions: global.functions.pct,
    lines: global.lines.pct,
  },
  modulos: modulos.map((m) => ({
    archivo: m.ruta,
    lines: m.lines.pct,
    functions: m.functions.pct,
    branches: m.branches.pct,
  })),
};

mkdirSync(dirname(salidaMd), { recursive: true });
writeFileSync(salidaMd, md, 'utf8');
writeFileSync(salidaJson, JSON.stringify(jsonInforme, null, 2), 'utf8');

console.log(`Informe generado:`);
console.log(`  - ${salidaMd}`);
console.log(`  - ${salidaJson}`);
console.log(`  - coverage/lcov-report/index.html`);
