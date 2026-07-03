import { deduplicarIdsPreservandoOrden } from './deduplicar-ids.util';

describe('deduplicarIdsPreservandoOrden', () => {
  it('deduplica manteniendo el primer orden', () => {
    expect(deduplicarIdsPreservandoOrden([12, 12, 34, 12])).toEqual([12, 34]);
  });

  it('devuelve vacío para array vacío', () => {
    expect(deduplicarIdsPreservandoOrden([])).toEqual([]);
  });
});
