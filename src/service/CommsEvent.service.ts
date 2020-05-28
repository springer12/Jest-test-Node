import CommsEvent from '../entity/CommsEvent'
import { Repository, getRepository } from 'typeorm';

export class CommsEventService {
    private readonly eventRepository:Repository<CommsEvent>;
    constructor(){
        this.eventRepository = getRepository(CommsEvent);
    }

    async addEvent(record: CommsEvent): Promise<CommsEvent>{
        return await this.eventRepository.save(record)
    }

    async getAll(): Promise<CommsEvent[]>{
       return await this.eventRepository.find()
    }

}