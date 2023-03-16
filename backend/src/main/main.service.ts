import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Weather } from './main.entity';
import { Repository } from 'typeorm';
import { number } from 'joi';

@Injectable()
export class MainService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @InjectRepository(Weather)
        private weatherRepository: Repository<Weather> 
    ) {}

    async getAccessToken() {
        const url = this.configService.get('TOKEN_URL');
        const body = {
            grant_type:this.configService.get('GRANT_TYPE'),
            code:this.configService.get('CODE'),
            client_id:this.configService.get('CLIENT_ID'),
            client_secret:this.configService.get('CLIENT_SECRET'),
            redir_url:this.configService.get('REDIRECT_URL'),
            scope:this.configService.get('SCOPE'),
          };
        const response = await this.httpService.post(url, body).toPromise();
        return response.data.access_token;
    }

    dateTimeMove(date: Date, time_move: number): Date {
        let new_date = new Date(date.getTime() + (1000 * 60 * 60 * time_move))
        return new_date;
    }

    getFormattedDate(date: Date): string {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let min = date.getMinutes();
        let str = [year, month, day].join('-') + 'T'
            + [hour, min, 0].join(':') + '.000Z';
        return str;
    }

    async getApi(date: Date) {
        const token = await this.getAccessToken();
        const headers = { 'Authorization': `Bearer ${token}` };
        
        console.log((date) + ' : get api');
        date = this.dateTimeMove(date, -3);
        for (let i = 0; i < 6; i++) {
            date.setMinutes(0, 0, 0);
            let from = this.getFormattedDate(this.dateTimeMove(date, -9));
            date.setMinutes(45, 0, 0);
            let to = this.getFormattedDate(this.dateTimeMove(date, -9));
            const url = this.configService.get('API_URL') + '?filter[campus_id]=29' + `&range[begin_at]=${from},${to}`;
            const response = await this.httpService.get(url, {headers}).toPromise();
            let count = Object.keys(response.data).length;
            let level: number;
            if (count < 30)
                level = 1;
            else if (count < 60)
                level = 2;
            else if (count < 100)
                level = 3;
            else
                level = 4;
            let found = await this.weatherRepository.findOneBy({time: date});
            if (!found)
                await this.weatherRepository.delete({time: date});
            const new_data = this.weatherRepository.create({
                time: date,
                count: count,
                level: level
            });
            await this.weatherRepository.save(new_data);
            date = this.dateTimeMove(date, 1);
        }
    }

    async getWeatherData(date: Date) {
        let ret = {};
        
        date.setMinutes(45, 0, 0);
        console.log((date) + ' : get weather data');
        let found = await this.weatherRepository.findOneBy({time: date});
        if (!found) {
            await this.getApi(date);
            found = await this.weatherRepository.findOneBy({time: date});
        }
        date = this.dateTimeMove(date, -3);
        for (let i = 0; i < 6; i++) {
            let found = await this.weatherRepository.findOneBy({time: date});
            ret[i] = {
                date: found.time,
                level: found.level,
                count: found.count,
            }
            date = this.dateTimeMove(date, 1);
        }
        return ret;
    }
}
