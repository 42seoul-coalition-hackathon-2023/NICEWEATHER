import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MainService } from './main.service';

@Controller('main')
export class MainController {
    constructor(private mainService: MainService) {}

    @Get('/')
    async home() {
        return await this.mainService.getWeatherData();
    }
    
    @Cron('* */5 * * * *')
    updateData() {
        this.mainService.getApi();
    }
}
