/**
 * Archivo: virtual-tours.module.ts
 * Ubicación: modules/virtual-tours
 * Tipo: Módulo NestJS
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesModule } from '../properties/properties.module';
import { ToursVirtualesControlador } from './controllers/tours-virtuales.controller';
import { ToursVirtualesServicio } from './services/tours-virtuales.service';
import { ToursVirtualesRepositorio } from './repositories/tours-virtuales.repository';
import { TourVirtualEntidad } from './entities/tour-virtual.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TourVirtualEntidad]), PropertiesModule],
  controllers: [ToursVirtualesControlador],
  providers: [ToursVirtualesServicio, ToursVirtualesRepositorio],
  exports: [ToursVirtualesServicio, ToursVirtualesRepositorio],
})
export class VirtualToursModule {}
