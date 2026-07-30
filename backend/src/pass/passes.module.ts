import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pass } from './pass.entity';
import { PassesController } from './passes.controller';
import { PassesService } from './passes.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pass]), NotificationsModule],
  controllers: [PassesController],
  providers: [PassesService],
})
export class PassesModule {}
