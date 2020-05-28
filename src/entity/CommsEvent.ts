import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
} from "typeorm";

@Entity()
export default class CommsEvent {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created: Date;

    @Column()
    from: string;

    @Column()
    to: string;

    @Column()
    source: string;

    @Column({nullable: true})
    human: boolean;

    @Column()
    result: string;

    @Column()
    server: string;

    @Column()
    message: string;
}