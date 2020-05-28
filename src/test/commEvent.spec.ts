import {CommsEventService} from "../service/CommsEvent.service"
import { createTypeormConnection } from "../utils/createTypeormConnection";
import CommsEvent from "../entity/CommsEvent";

beforeAll(async () => {
    await createTypeormConnection();
});


// complete object
const testEventNormal = new CommsEvent();
testEventNormal.created = new Date();
testEventNormal.from = 'whatsapp:+13235082016';
testEventNormal.to = 'whatsapp:+995557773417';
testEventNormal.source = 'whatsapp';
testEventNormal.human = false;
testEventNormal.message = 'some message';
testEventNormal.server = 'localhost';
testEventNormal.result = 'SUCCESS'

// object without nullable field
const testEventWithoutHumanProp = {...testEventNormal};
delete testEventWithoutHumanProp.human;
console.log(testEventWithoutHumanProp);

// object without non-nullable field
const testEventWithoutSourceProp = {...testEventNormal};
delete testEventWithoutSourceProp.source;


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
    expect((await commsEventService.addEvent(testEventNormal)).from).toBe(testEventNormal.from);
    expect(await commsEventService.addEvent(testEventWithoutHumanProp)).toBe(testEventWithoutHumanProp);
    expect(async() => await commsEventService.addEvent(testEventWithoutSourceProp)).rejects.toThrowError()
});
