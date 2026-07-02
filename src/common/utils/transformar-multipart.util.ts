/**
 * Transformadores para campos de multipart/form-data (llegan como string).
 */

export function aBooleano({ value }: { value: unknown }): unknown {
  if (value === true || value === 'true' || value === 1 || value === '1') return true;
  if (value === false || value === 'false' || value === 0 || value === '0') return false;
  return value;
}

export function aEntero({ value }: { value: unknown }): unknown {
  if (value === undefined || value === null || value === '') return value;
  const numero = parseInt(String(value), 10);
  return Number.isNaN(numero) ? value : numero;
}
