import { NotEquals } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Weather {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @NotEquals(null)
    time: string;

    @Column()
    @NotEquals(null)
    count: number;

    @Column()
    @NotEquals(null)
    level: number;
}