/**
 * Archivo: propiedad-creada.event.ts
 * Ubicación: messaging/events
 * Tipo: Evento de dominio
 * Contenido: payload publicado al crear una propiedad
 */

export interface PropiedadCreadaEvento {
  event: 'property.created';
  propertyId: number;
}
