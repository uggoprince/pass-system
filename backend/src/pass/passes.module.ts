import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pass } from './pass.entity';
import { PassesController } from './passes.controller';
import { PassesService } from './passes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pass])],
  controllers: [PassesController],
  providers: [PassesService],
})
export class PassesModule {}
