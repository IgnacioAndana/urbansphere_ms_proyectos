/**
 * Transformadores para campos de multipart/form-data (llegan como string).
 */

export function aBooleano({ value }: { value: unknown }): boolean | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (value === true || value === false) return value;
  if (value === 1 || value === '1') return true;
  if (value === 0 || value === '0') return false;
  if (typeof value === 'string') {
    const normalizado = value.trim().toLowerCase();
    if (normalizado === 'true') return true;
    if (normalizado === 'false') return false;
  }
  return value as boolean;
}

export function aEntero({ value }: { value: unknown }): unknown {
  if (value === undefined || value === null || value === '') return value;
  const numero = parseInt(String(value), 10);
  return Number.isNaN(numero) ? value : numero;
}
