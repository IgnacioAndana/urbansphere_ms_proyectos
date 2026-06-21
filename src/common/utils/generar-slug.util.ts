/**
 * Archivo: generar-slug.util.ts
 * Ubicación: common/utils
 * Tipo: Utilidad
 * Contenido: genera slug URL-friendly a partir de un texto
 */

export function generarSlug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
