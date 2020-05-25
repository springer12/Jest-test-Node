import "reflect-metadata";

import {createConnection} from "typeorm";
import CommsEvent from "./entity/CommsEvent";

(async () => {
    const conn = await createConnection();

    console.log('PG connected');

    const event = new CommsEvent();

    event.from = "972523203925";
    event.to = "32312312345";
    event.source = "whatsapp";
    event.message = "Hello!"

    await conn.manager.save(event);

    await conn.close();
    console.log('PG connection closed.');
})();
