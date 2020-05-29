import CommsEvent from '../entity/CommsEvent'
import { Repository, Connection } from 'typeorm';

interface GmailSendArgInterface {
    created: Date,
    from: string,
    to: string,
    human?: boolean,
    message: string,
    source: string,
    result: string,
    server: string,
    html?: string,
    subject?: string,
}

export class CommsEventService {
    private readonly eventRepository:Repository<CommsEvent>;
    constructor(db: Connection){
        this.eventRepository = db.getRepository(CommsEvent);
    }

    async addEvent(record: GmailSendArgInterface): Promise<CommsEvent>{
        const {created, from, to, human, message, source, result, server} = record;
        return await this.eventRepository.save({created, from, to, human, message, source, result, server})
    }

}