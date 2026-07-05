# Informe de pruebas — MS Proyectos (UrbanSphere)

> Generado automáticamente el **2026-07-05 19:37:46 UTC**.  
> Comando: `npm run test:report`

## Resumen ejecutivo

| Indicador | Valor |
|-----------|-------|
| Estado | **APROBADO** |
| Suites | 15 / 15 |
| Tests | 64 / 64 |
| Cobertura líneas (global) | 85.48% |
| Cobertura funciones (global) | 71.42% |
| Cobertura ramas (global) | 60.36% |

## Cobertura global

| Métrica | Porcentaje |
|---------|------------|
| Statements | 83% |
| Branches | 60.36% |
| Functions | 71.42% |
| Lines | 85.48% |

## Cobertura por archivo (servicios, repositorios, controladores)

| Archivo | Líneas | Funciones | Ramas |
|---------|--------|-----------|-------|
| `modules/project-amenities/controllers/proyecto-equipamiento.controller.ts` | 100% | 100% | 100% |
| `modules/typologies/controllers/tipologias.controller.ts` | 100% | 100% | 100% |
| `modules/projects/repositories/catalogo-proyectos.repository.ts` | 96.66% | 100% | 77.77% |
| `modules/project-images/controllers/proyecto-imagenes.controller.ts` | 95.45% | 80% | 100% |
| `modules/typology-images/controllers/tipologia-imagenes.controller.ts` | 95.45% | 80% | 100% |
| `modules/projects/controllers/proyectos.controller.ts` | 93.54% | 71.42% | 50% |
| `modules/storage/services/s3.service.ts` | 92.59% | 100% | 56.25% |
| `modules/projects/services/proyectos.service.ts` | 92.4% | 100% | 70.31% |
| `modules/project-amenities/services/proyecto-equipamiento.service.ts` | 92.1% | 100% | 33.33% |
| `modules/typologies/services/tipologias.service.ts` | 88.09% | 90.9% | 50% |
| `modules/project-images/services/proyecto-imagenes.service.ts` | 87.23% | 88.88% | 61.9% |
| `modules/typology-images/services/tipologia-imagenes.service.ts` | 84.09% | 100% | 47.05% |
| `modules/projects/repositories/proyectos.repository.ts` | 73.33% | 57.14% | 66.66% |
| `modules/project-amenities/repositories/proyecto-equipamiento.repository.ts` | 45.45% | 0% | 100% |
| `modules/project-images/repositories/proyecto-imagenes.repository.ts` | 35.71% | 0% | 100% |
| `modules/typologies/repositories/tipologias.repository.ts` | 35.71% | 0% | 100% |
| `modules/typology-images/repositories/tipologia-imagenes.repository.ts` | 35.71% | 0% | 100% |

## Evidencia adicional

- Reporte HTML interactivo: abrir `coverage/lcov-report/index.html` en el navegador.
- Resultados JSON Jest: `test-results/jest-results.json`
- Resumen JSON cobertura: `coverage/coverage-summary.json`

## Alcance de las pruebas

- **Unitarias (Jest):** servicios de proyectos, catálogo batch, tipologías, imágenes, equipamiento, S3; repositorios y controladores del módulo projects.
- **E2E (opcional):** `npm run test:e2e` — requiere BD y `E2E_JWT_TOKEN`.

---

*Documento generado por `scripts/generar-informe-pruebas.mjs`. Puede adjuntarse al informe del proyecto.*
