import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MainService } from './main.service';

@Controller('main')
export class MainController {
    constructor(private mainService: MainService) {}

    @Get('/')
    async home() {
        const ret = await this.mainService.getWeatherData();
        console.log(ret);
        return ret;
    }

    @Cron('* */5 * * * *')
    async updateData() {
        await this.mainService.getApi();
    }
}
