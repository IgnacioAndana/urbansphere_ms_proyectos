import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../storage/storage.module';
import { TypologiesModule } from '../typologies/typologies.module';
import { TipologiaImagenesControlador } from './controllers/tipologia-imagenes.controller';
import { TipologiaImagenesServicio } from './services/tipologia-imagenes.service';
import { TipologiaImagenesRepositorio } from './repositories/tipologia-imagenes.repository';
import { TipologiaImagenEntidad } from './entities/tipologia-imagen.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipologiaImagenEntidad]),
    TypologiesModule,
    StorageModule,
  ],
  controllers: [TipologiaImagenesControlador],
  providers: [TipologiaImagenesServicio, TipologiaImagenesRepositorio],
})
export class TypologyImagesModule {}
