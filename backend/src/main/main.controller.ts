import { Body, Controller, Get, Post } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MainService } from './main.service';

@Controller('main')
export class MainController {
    constructor(private mainService: MainService) {}

    @Cron('0 0/5 * * * *')
    async updateData() {
        await this.mainService.getApi(new Date(Date.now()));
    }

    @Get('/')
    async home() {
        return await this.mainService.getWeatherData(new Date(Date.now()));
    }

    @Post('/')
    async evaluationReserve(@Body('mail') mail: string, @Body('time') time: Date) {
        return this.mainService.setAlarm(mail, new Date(time));
    }
}
