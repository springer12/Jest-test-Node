import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export default class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}