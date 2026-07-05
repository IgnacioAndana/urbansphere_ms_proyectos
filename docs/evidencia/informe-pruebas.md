# Informe de pruebas — MS Proyectos (UrbanSphere)

> Generado automáticamente el **2026-07-05 19:50:35 UTC**.  
> Comando: `npm run test:report`

## Resumen ejecutivo

| Indicador | Valor |
|-----------|-------|
| Estado | **APROBADO** |
| Suites | 19 / 19 |
| Tests | 84 / 84 |
| Cobertura líneas (global) | **93.86%** (459/489) |
| Cobertura funciones (global) | 96.63% |
| Cobertura ramas (global) | 63.41% |

## Cobertura global

| Métrica | Porcentaje | Cubierto / Total |
|---------|------------|------------------|
| Statements | 90.33% | 505/559 |
| Branches | 63.41% | 104/164 |
| Functions | 96.63% | 115/119 |
| Lines | 93.86% | 459/489 |

## Cobertura por módulo (como reporte HTML de Jest)

| Módulo / capa | Statements | Branches | Functions | Lines |
|---------------|------------|----------|-----------|-------|
| `modules/project-amenities/controllers` | 100% | 100% | 100% | 100% |
| `modules/project-amenities/repositories` | 100% | 100% | 100% | 100% |
| `modules/project-images/repositories` | 100% | 100% | 100% | 100% |
| `modules/projects/controllers` | 100% | 100% | 100% | 100% |
| `modules/storage/services` | 100% | 62.5% | 100% | 100% |
| `modules/typologies/controllers` | 100% | 100% | 100% | 100% |
| `modules/typologies/repositories` | 100% | 100% | 100% | 100% |
| `modules/typology-images/repositories` | 100% | 100% | 100% | 100% |
| `modules/projects/repositories` | 96.23% | 83.33% | 100% | 97.78% |
| `modules/project-images/controllers` | 95.83% | 100% | 80% | 95.45% |
| `modules/typology-images/controllers` | 95.83% | 100% | 80% | 95.45% |
| `modules/projects/services` | 84.78% | 70.31% | 100% | 92.41% |
| `modules/project-amenities/services` | 81.25% | 33.33% | 100% | 92.11% |
| `modules/typologies/services` | 82% | 50% | 90.91% | 88.1% |
| `modules/project-images/services` | 83.02% | 61.9% | 88.89% | 87.23% |
| `modules/typology-images/services` | 81.63% | 47.06% | 100% | 84.09% |

## Cobertura por archivo

| Archivo | Statements | Branches | Functions | Lines |
|---------|------------|----------|-----------|-------|
| `modules/project-amenities/controllers/proyecto-equipamiento.controller.ts` | 100% | 100% | 100% | 100% |
| `modules/project-amenities/repositories/proyecto-equipamiento.repository.ts` | 100% | 100% | 100% | 100% |
| `modules/project-amenities/services/proyecto-equipamiento.service.ts` | 81.25% | 33.33% | 100% | 92.1% |
| `modules/project-images/controllers/proyecto-imagenes.controller.ts` | 95.83% | 100% | 80% | 95.45% |
| `modules/project-images/repositories/proyecto-imagenes.repository.ts` | 100% | 100% | 100% | 100% |
| `modules/project-images/services/proyecto-imagenes.service.ts` | 83.01% | 61.9% | 88.88% | 87.23% |
| `modules/projects/controllers/proyectos.controller.ts` | 100% | 100% | 100% | 100% |
| `modules/projects/repositories/catalogo-proyectos.repository.ts` | 94.44% | 77.77% | 100% | 96.66% |
| `modules/projects/repositories/proyectos.repository.ts` | 100% | 100% | 100% | 100% |
| `modules/projects/services/proyectos.service.ts` | 84.78% | 70.31% | 100% | 92.4% |
| `modules/storage/services/s3.service.ts` | 100% | 62.5% | 100% | 100% |
| `modules/typologies/controllers/tipologias.controller.ts` | 100% | 100% | 100% | 100% |
| `modules/typologies/repositories/tipologias.repository.ts` | 100% | 100% | 100% | 100% |
| `modules/typologies/services/tipologias.service.ts` | 82% | 50% | 90.9% | 88.09% |
| `modules/typology-images/controllers/tipologia-imagenes.controller.ts` | 95.83% | 100% | 80% | 95.45% |
| `modules/typology-images/repositories/tipologia-imagenes.repository.ts` | 100% | 100% | 100% | 100% |
| `modules/typology-images/services/tipologia-imagenes.service.ts` | 81.63% | 47.05% | 100% | 84.09% |

## Evidencia adicional

1. **Reporte HTML interactivo:** `coverage/lcov-report/index.html` (misma vista que Jest; ideal para capturas).
2. **JSON Jest:** `test-results/jest-results.json`
3. **JSON cobertura:** `coverage/coverage-summary.json`

## Alcance de las pruebas

- **Unitarias (Jest):** servicios, controladores y repositorios de los módulos activos + S3.
- **E2E (opcional):** `npm run test:e2e` — requiere BD y `E2E_JWT_TOKEN`.

---

*Generado por `scripts/generar-informe-pruebas.mjs`*
