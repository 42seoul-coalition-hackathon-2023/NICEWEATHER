import { Module } from '@nestjs/common';
import { MainModule } from './main/main.module';
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';

@Module({
  imports: [
    MainModule,
    TypeOrmModule.forRoot(typeORMConfig),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        TOKEN_URL: Joi.string().required(),
        API_URL: Joi.string().required(),
        GRANT_TYPE: Joi.string().required(),
        CODE: Joi.string().required(),
        CLIENT_ID: Joi.string().required(),
        CLIENT_SECRET: Joi.string().required(),
        REDIRECT_URL: Joi.string().required(),
        SCOPE: Joi.string().required(),
        EMAIL_ID: Joi.string().required(),
        EMAIL_PASS: Joi.string().required(),
      }),
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
