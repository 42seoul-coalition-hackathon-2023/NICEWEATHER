import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MainService } from './main.service';

@Controller('main')
export class MainController {
    constructor(private mainService: MainService) {}

    @Get('/')
    async home() {
        return await this.mainService.getWeatherData(new Date(Date.now()));
    }

    @Cron('* */5 * * * *')
    async updateData() {
        await this.mainService.getApi(new Date(Date.now()));
    }
}
