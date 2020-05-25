import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn    
} from 'typeorm';

@Entity()
export default class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
