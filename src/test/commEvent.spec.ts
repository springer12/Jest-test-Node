import { Connection } from 'typeorm';
import { createTypeormConnection } from '../utils/createTypeormConnection';
import {CommsEventService} from "../service/CommsEvent.service"
import CommsEvent from "../entity/CommsEvent";

const testEvent = new CommsEvent();
testEvent.created = new Date();
testEvent.from = 'whatsapp:+13235082016';
testEvent.to = 'whatsapp:+995557773417';
testEvent.source = 'whatsapp';
testEvent.human = false;
testEvent.message = 'some message';
testEvent.server = 'localhost';
testEvent.result = 'SUCCESS'


describe('CommsEventService', () => {

    let db:Connection;
    let commsEventService:CommsEventService;

    beforeAll(async () => {
        db = await createTypeormConnection();
    });

    it('typeorm => getRepository', async () => {

        db.getRepository = jest.fn(db.getRepository);
        commsEventService = new CommsEventService(db);
        expect(db.getRepository).toBeCalled()

    })
    it('CommsEventService => addEvent', async () => {

        commsEventService.addEvent = jest.fn(commsEventService.addEvent);

        const result = await commsEventService.addEvent(testEvent)
        
        expect(result).toEqual({...testEvent, id:result.id})
        
        expect(commsEventService.addEvent).toBeCalled()
        expect(commsEventService.addEvent).toHaveBeenNthCalledWith(1, testEvent)
        
    })
})