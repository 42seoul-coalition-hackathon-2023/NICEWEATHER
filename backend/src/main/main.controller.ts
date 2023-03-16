import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MainService } from './main.service';

@Controller('main')
export class MainController {
    constructor(private mainService: MainService) {}

    @Get('/')
    async home() {
<<<<<<< Updated upstream
        const ret = await this.mainService.getWeatherData();
        console.log(ret);
        return ret;
=======
        return await this.mainService.getWeatherData();
>>>>>>> Stashed changes
    }

    @Cron('* */5 * * * *')
    async updateData() {
        await this.mainService.getApi();
    }
}
