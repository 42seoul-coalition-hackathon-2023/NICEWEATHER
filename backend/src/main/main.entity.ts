import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Weather {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    time: string;

    @Column()
    count: number;
}