/**
 * Archivo: proyecto-creado.event.ts
 * Ubicación: messaging/events
 * Tipo: Evento de dominio
 */

export interface ProyectoCreadoEvento {
  event: 'project.created';
  projectId: number;
}
