import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Mail, Weather } from './main.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MainService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @InjectRepository(Weather)
        private weatherRepository: Repository<Weather>,
        @InjectRepository(Mail)
        private mailRepository: Repository<Mail>
    ) {}

    private async getAccessToken() {
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

    private dateTimeMove(date: Date, time_move: number): Date {
        let new_date = new Date(date.getTime() + (1000 * 60 * 60 * time_move))
        return new_date;
    }

    private getFormattedDate(date: Date): string {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let min = date.getMinutes();
        let str = [year, month, day].join('-') + 'T'
            + [hour, min, 0].join(':') + '.000Z';
        return str;
    }

    private getLevel(count: number): number {
        let level: number;
        if (count < 30)
            level = 1;
        else if (count < 60)
            level = 2;
        else if (count < 100)
            level = 3;
        else
            level = 4;
        return level;
    }

    private getLastSlot(data) {
        let last_slot = 0;
        let key_count = data.length;
        
        for (let i = 0; i < key_count; i++) {
            if (last_slot < data[i]['id']) {
                last_slot = data[i]['id'];
            }
        }
        return last_slot;
    }

    private checkMailFormat(mail: string) {
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return expression.test(mail);
    }

    async setAlarm(mail: string, time: Date) {
        let ret = {};
        let now = new Date(Date.now())

        now.setMinutes(0, 0, 0);
        time.setMinutes(0, 0, 0);
        if (!this.checkMailFormat(mail)) {
            ret['error'] = 'Setting alarm fail';
            ret['message'] = 'e-mail format is incorrect';
            console.log(now + ' : set alarm error(e-mail format)' + mail);
            return ret;
        }
        if (time <= now) {
            ret['error'] = 'Setting alarm fail';
            ret['message'] = `Can't be set alarm on past time`;
            console.log(now + ' : set alarm error(past time)' + time);
            return ret;
        }
        let founds = await this.mailRepository.findBy({mail: mail});
        if (founds && founds.filter((alarm) => alarm.time === time).length != 0) {
            ret['error'] = 'Setting alarm fail';
            ret['message'] = 'Already be set on the time as same e-mail';
            console.log(now + ' : set alarm error(duplication)');
            return ret;
        }
        console.log(now + ' : set alarm');
        await this.mailRepository.save({mail: mail, time: time});
        console.log('\tset alarm at ' + mail + ' on ' + time);
    }

    private async sendMail(date: Date) {
        date.setMinutes(0, 0, 0);
        let founds = await this.mailRepository.findBy({time: date});
        if (founds.length != 0) {
            console.log(new Date(Date.now()) + ' : send mail');
            console.log(this.configService.get('EMAIL_ID'));
            const mailer = require('nodemailer');
            const transporter = mailer.createTransport({
                service: 'gmail',
                host: 'smtp@gmail.com',
                port: 465,
                auth: {
                    user: this.configService.get('EMAIL_ID'),
                    pass: this.configService.get('EMAIL_PASS'),
                },
                secure: true,
            });
            const sendMail = (email) => {
                let mailOptions = {
                    to: email,
                    subject: '42Weather Slot alarm',
                    text: 'New slot has opened at ' 
                        + (date.getMonth() + 1) + '/'
                        + date.getDate() + ' '
                        + date.getHours(),
                };
                transporter.sendMail(mailOptions, function(err, info) {
                    if (err)
                        console.log(err);
                    else
                        console.log(email + ': ' + info.response);
                });
            }
            const mail = [];
            founds.forEach((found) => {
                mail.push(found.mail);
                this.mailRepository.delete({id: found.id});
            });
            mail.forEach((person) => {
                sendMail(person);
                console.log('\tsend email to ' + person);
            });
        }
    }

    async getApi(date: Date) {
        const token = await this.getAccessToken();
        const headers = { 'Authorization': `Bearer ${token}` };
        
        console.log(date + ' : get api');
        date = this.dateTimeMove(date, -2);
        for (let i = 0; i < 6; i++) {
            date.setMinutes(0, 0, 0);
            let from = this.getFormattedDate(this.dateTimeMove(date, -9));
            date.setMinutes(45, 0, 0);
            let to = this.getFormattedDate(this.dateTimeMove(date, -9));
            const url = this.configService.get('API_URL') + '?filter[campus_id]=29' + `&range[begin_at]=${from},${to}`;
            const response = await this.httpService.get(url, {headers}).toPromise();
            let count = response.data.length;
            let last_slot = this.getLastSlot(response.data);
            let found = await this.weatherRepository.findOneBy({time: date});
            if (found) {
                if (last_slot > found.last_slot)
                    this.sendMail(date);
                await this.weatherRepository.delete({time: date});
            }
            const new_data = this.weatherRepository.create({
                time: date,
                count: count,
                level: this.getLevel(count),
                last_slot: last_slot,
            });
            await this.weatherRepository.save(new_data);
            date = this.dateTimeMove(date, 1);
        }
    }

    async getWeatherData(date: Date) {
        let ret = {};
        
        try {
            console.log(date + ' : get weather data');
            date.setMinutes(45, 0, 0);
            let found = await this.weatherRepository.findOneBy({time: this.dateTimeMove(date, -3)});
            if (!found)
                await this.getApi(this.dateTimeMove(date, -2));
            found = await this.weatherRepository.findOneBy({time: this.dateTimeMove(date, 2)});
            if (!found)
                await this.getApi(this.dateTimeMove(date, 3));
            found = await this.weatherRepository.findOneBy({time: date});
            date = this.dateTimeMove(date, -2);
            for (let i = 0; i < 6; i++) {
                let found = await this.weatherRepository.findOneBy({time: date});
                ret[i] = {
                    date: found.time,
                    level: found.level,
                    count: found.count,
                }
                date = this.dateTimeMove(date, 1);
            }
        } catch (error) {
            ret['error'] = 'Getting weather fail';
            ret['message'] = 'fail to find weather data';
        } finally {
            return ret;
        }
    }
}
