import {CommsEventService} from "../service/CommsEvent.service"
import { createTypeormConnection } from "../utils/createTypeormConnection";
import CommsEvent from "../entity/CommsEvent";

beforeAll(async () => {

    console.log("ddd")
    await createTypeormConnection();
});


test('test of test', async() => {
    const commsEventService = new CommsEventService();
    expect(await(async()=> 5)()).toBe(5);
});


test('getAll', async() => {
    const commsEventService = new CommsEventService();
    expect(
        await commsEventService.getAll()
    ).toBeDefined;
});

test('addEvent', async() => {
    const commsEventService = new CommsEventService();
    const event = new CommsEvent();
    event.created = new Date();
    event.from = 'me';
    event.to = 'you';
    event.message = 'I have tested you';
    event.result = 'SUCCESS';
    event.server = 'some server';
    event.source = 'some source';
    expect(
        (await commsEventService.addEvent(event)).from
    ).toBe('me');
});
