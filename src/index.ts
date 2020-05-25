import "reflect-metadata";

import {createConnection} from "typeorm";
import Event from "./entity/Event";

(async () => {
    const conn = await createConnection();

    console.log('PG connected');

    const event = new Event();
    event.name = "Test";
    await conn.manager.save(event);

    await conn.close();
    console.log('PG connection closed.');
})();
