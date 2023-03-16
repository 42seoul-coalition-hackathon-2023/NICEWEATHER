import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainController } from './main.controller';
import { Weather } from './main.entity';
import { MainService } from './main.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Weather]),
  ],
  controllers: [MainController],
  providers: [MainService, ConfigService]
})
export class MainModule {}
