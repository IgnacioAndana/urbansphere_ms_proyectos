export function deduplicarIdsPreservandoOrden(ids: number[]): number[] {
  const vistos = new Set<number>();
  const resultado: number[] = [];
  for (const id of ids) {
    if (!vistos.has(id)) {
      vistos.add(id);
      resultado.push(id);
    }
  }
  return resultado;
}
