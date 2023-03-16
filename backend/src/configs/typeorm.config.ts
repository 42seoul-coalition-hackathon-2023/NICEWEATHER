import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Weather } from "src/main/main.entity";

export const typeORMConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123',
    database: '42ema',
    entities: [Weather],
    synchronize: true
}