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

function pct(covered, total) {
  if (!total) return 100;
  return Math.round((covered / total) * 10000) / 100;
}

function agregarMetricas(acum, metricas) {
  for (const clave of ['statements', 'branches', 'functions', 'lines']) {
    acum[clave].total += metricas[clave].total;
    acum[clave].covered += metricas[clave].covered;
  }
}

function resumirMetricas(acum) {
  const resultado = {};
  for (const clave of ['statements', 'branches', 'functions', 'lines']) {
    resultado[clave] = pct(acum[clave].covered, acum[clave].total);
  }
  return resultado;
}

function metricasVacias() {
  return {
    statements: { total: 0, covered: 0 },
    branches: { total: 0, covered: 0 },
    functions: { total: 0, covered: 0 },
    lines: { total: 0, covered: 0 },
  };
}

const resumen = leerJson(resumenPath);
const jestResult = leerJson(jestJsonPath);

if (!resumen || !jestResult) {
  console.error('Faltan archivos de coverage o jest-results. Ejecuta: npm run test:report');
  process.exit(1);
}

const global = resumen.total;
const prefijoSrc = `${raiz.replace(/\\/g, '/')}/src/`;

const archivos = Object.entries(resumen)
  .filter(([clave]) => clave !== 'total')
  .map(([ruta, metricas]) => ({
    ruta: ruta.replace(/\\/g, '/').replace(prefijoSrc, ''),
    ...metricas,
  }))
  .sort((a, b) => a.ruta.localeCompare(b.ruta));

const gruposMap = new Map();
for (const archivo of archivos) {
  const partes = archivo.ruta.split('/');
  const grupo = partes.length >= 3 ? `${partes[0]}/${partes[1]}/${partes[2]}` : archivo.ruta;
  if (!gruposMap.has(grupo)) {
    gruposMap.set(grupo, { grupo, acum: metricasVacias(), archivos: [] });
  }
  const entry = gruposMap.get(grupo);
  agregarMetricas(entry.acum, archivo);
  entry.archivos.push(archivo);
}

const grupos = [...gruposMap.values()]
  .map((entry) => ({
    grupo: entry.grupo,
    metricas: resumirMetricas(entry.acum),
    archivos: entry.archivos,
  }))
  .sort((a, b) => b.metricas.lines - a.metricas.lines);

const fecha = new Date().toISOString().replace('T', ' ').slice(0, 19);
const testsOk = jestResult.numPassedTests;
const testsTotal = jestResult.numTotalTests;
const exito = jestResult.success !== false;

const filasGrupo = grupos
  .map(
    (g) =>
      `| \`${g.grupo}\` | ${g.metricas.statements}% | ${g.metricas.branches}% | ${g.metricas.functions}% | ${g.metricas.lines}% |`,
  )
  .join('\n');

const filasArchivo = archivos
  .map(
    (m) =>
      `| \`${m.ruta}\` | ${m.statements.pct}% | ${m.branches.pct}% | ${m.functions.pct}% | ${m.lines.pct}% |`,
  )
  .join('\n');

const md = `# Informe de pruebas — MS Proyectos (UrbanSphere)

> Generado automáticamente el **${fecha} UTC**.  
> Comando: \`npm run test:report\`

## Resumen ejecutivo

| Indicador | Valor |
|-----------|-------|
| Estado | ${exito ? '**APROBADO**' : '**FALLIDO**'} |
| Suites | ${jestResult.numPassedTestSuites} / ${jestResult.numTotalTestSuites} |
| Tests | ${testsOk} / ${testsTotal} |
| Cobertura líneas (global) | **${global.lines.pct}%** (${global.lines.covered}/${global.lines.total}) |
| Cobertura funciones (global) | ${global.functions.pct}% |
| Cobertura ramas (global) | ${global.branches.pct}% |

## Cobertura global

| Métrica | Porcentaje | Cubierto / Total |
|---------|------------|------------------|
| Statements | ${global.statements.pct}% | ${global.statements.covered}/${global.statements.total} |
| Branches | ${global.branches.pct}% | ${global.branches.covered}/${global.branches.total} |
| Functions | ${global.functions.pct}% | ${global.functions.covered}/${global.functions.total} |
| Lines | ${global.lines.pct}% | ${global.lines.covered}/${global.lines.total} |

## Cobertura por módulo (como reporte HTML de Jest)

| Módulo / capa | Statements | Branches | Functions | Lines |
|---------------|------------|----------|-----------|-------|
${filasGrupo}

## Cobertura por archivo

| Archivo | Statements | Branches | Functions | Lines |
|---------|------------|----------|-----------|-------|
${filasArchivo}

## Evidencia adicional

1. **Reporte HTML interactivo:** \`coverage/lcov-report/index.html\` (misma vista que Jest; ideal para capturas).
2. **JSON Jest:** \`test-results/jest-results.json\`
3. **JSON cobertura:** \`coverage/coverage-summary.json\`

## Alcance de las pruebas

- **Unitarias (Jest):** servicios, controladores y repositorios de los módulos activos + S3.
- **E2E (opcional):** \`npm run test:e2e\` — requiere BD y \`E2E_JWT_TOKEN\`.

---

*Generado por \`scripts/generar-informe-pruebas.mjs\`*
`;

const jsonInforme = {
  generadoEn: fecha,
  exito,
  tests: { pasados: testsOk, total: testsTotal, suites: jestResult.numPassedTestSuites },
  cobertura: {
    statements: global.statements,
    branches: global.branches,
    functions: global.functions,
    lines: global.lines,
  },
  grupos: grupos.map((g) => ({
    modulo: g.grupo,
    cobertura: g.metricas,
  })),
  archivos: archivos.map((m) => ({
    ruta: m.ruta,
    statements: m.statements.pct,
    branches: m.branches.pct,
    functions: m.functions.pct,
    lines: m.lines.pct,
  })),
};

mkdirSync(dirname(salidaMd), { recursive: true });
writeFileSync(salidaMd, md, 'utf8');
writeFileSync(salidaJson, JSON.stringify(jsonInforme, null, 2), 'utf8');

console.log('');
console.log('Informe generado:');
console.log(`  - ${salidaMd}`);
console.log(`  - ${salidaJson}`);
console.log(`  - coverage/lcov-report/index.html`);
