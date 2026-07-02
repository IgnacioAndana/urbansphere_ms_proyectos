import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from '../projects/projects.module';
import { TipologiasControlador } from './controllers/tipologias.controller';
import { TipologiasServicio } from './services/tipologias.service';
import { TipologiasRepositorio } from './repositories/tipologias.repository';
import { TipologiaEntidad } from './entities/tipologia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipologiaEntidad]), ProjectsModule],
  controllers: [TipologiasControlador],
  providers: [TipologiasServicio, TipologiasRepositorio],
  exports: [TipologiasServicio, TipologiasRepositorio],
})
export class TypologiesModule {}
