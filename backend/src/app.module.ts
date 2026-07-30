import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pass } from './pass/pass.entity';
import { PassesModule } from './pass/passes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Pass],
      synchronize: true, // creates table on start, ignores if it exists
    }),
    PassesModule,
  ],
})
export class AppModule {}
