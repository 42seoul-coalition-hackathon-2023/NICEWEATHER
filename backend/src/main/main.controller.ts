import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MainService } from './main.service';

@Controller('main')
export class MainController {
    constructor(private mainService: MainService) {}

    @Cron('0 0/1 * * * *')
    async updateData() {
        await this.mainService.getApi(new Date(Date.now()));
    }

    @Get('/')
    async home() {
        return await this.mainService.getWeatherData(new Date(Date.now()));
    }

    @Post('/')
    async evaluationReserve(@Body('mail') mail: string, @Body('time') time: Date) {
        let date = new Date(time);

        date.setMinutes(0, 0, 0);
        let err = await this.mainService.checkAlarmValidation(mail, date);
        if (err)
            throw new BadRequestException(err);
        await this.mainService.setAlarm(mail, date);
    }
}
