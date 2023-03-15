import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MainController } from './main.controller';
import { MainService } from './main.service';

@Module({
  imports: [HttpModule],
  controllers: [MainController],
  providers: [MainService, ConfigService]
})
export class MainModule {}
