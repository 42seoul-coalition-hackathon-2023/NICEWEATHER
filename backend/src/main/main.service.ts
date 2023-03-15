import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MainService {
    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}
    private data = {};

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

    calculateDate(year, month, day, time) {
        var ts;
        var day_of_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (time < 0) {
            time += 24;
            day -= 1;
            if (day <= 0) {
                if (month - 1 == 2) {
                    if (year % 4 == 0) {
                        if (year % 100 == 0) {
                            if (year % 400 == 0)
                                day = 29;
                            else
                                day = 28;
                        }
                        else
                            day = 29;
                    }
                    else
                        day = 28;
                }
                else
                    day = day_of_month[month - 2];
                month -= 1;
                if (month <= 0) {
                    month = 12;
                    year -= 1;
                }
            }
        }
        ts = time.toString();
        if (ts.length == 1)
            ts = '0' + ts;
        return year.toString() + '-' + month.toString() + '-' + day.toString() + 'T' + ts;
    }

    async getApi() {
        var now_date = new Date(Date.now()).toLocaleDateString();
        var now_time = new Date(Date.now()).toLocaleTimeString();
        var s = now_date.split('/');
        var t = now_time.split(':');
        var date = s[2] + '-' + s[0] + '-' + s[1];
        var time = parseInt(t[0]);
        if (t[2][3] === 'P')
        time += 12;
        var splited = date.split('-');
        var year = parseInt(splited[0]);
        var month = parseInt(splited[1]);
        var day = parseInt(splited[2]);
        const token = await this.getAccessToken();

        time -= 7;
        for (var i = 0; i < 6; i++) {
            var curr = this.calculateDate(year, month, day, time);
            if (this.data[curr])
                continue;
            const url = this.configService.get('API_URL')
                + '?filter[campus_id]=29' 
                + `&range[begin_at]=${curr}:00:00.000Z,${curr}:45:00.000Z`;
            const headers = { 'Authorization': `Bearer ${token}` };
            const response = await this.httpService.get(url, {headers}).toPromise();
            this.data[this.calculateDate(year, month, day, time + 9)] = Object.keys(response.data).length;
            time -= 1;
        }
    }

    async getWeatherData() {
        var now_date = new Date(Date.now()).toLocaleDateString();
        var now_time = new Date(Date.now()).toLocaleTimeString();
        var s = now_date.split('/');
        var t = now_time.split(':');
        var date = s[2] + '-' + s[0] + '-' + s[1];
        var time = parseInt(t[0]);
        if (t[2][3] === 'P')
            time += 12;
        var splited = date.split('-');
        var year = parseInt(splited[0]);
        var month = parseInt(splited[1]);
        var day = parseInt(splited[2]);
        var ret = {};
        var curr = this.calculateDate(year, month, day, time);
        if (!this.data[curr])
            await this.getApi();
        
        for (var i = 0; i < 6; i++) {
            curr = this.calculateDate(year, month, day, time + 2);
            ret[curr] = this.data[curr];
            time -= 1;
        }
        return ret;
    }
}
