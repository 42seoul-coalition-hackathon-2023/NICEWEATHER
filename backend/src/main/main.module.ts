import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainController } from './main.controller';
import { Mail, Weather } from './main.entity';
import { MainService } from './main.service';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Weather, Mail]),
  ],
  controllers: [MainController],
  providers: [MainService, ConfigService]
})
export class MainModule {}
