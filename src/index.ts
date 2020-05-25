import "reflect-metadata";

import Pino from "pino";
import {createConnection} from "typeorm";
import CommsEvent from "./entity/CommsEvent";

const logger = Pino({name: "Zenner Comms Dispatch"});

logger.info("Starting");

(async () => {

    const conn = await createConnection();

    logger.info('PG connected');

    const event = new CommsEvent();

    event.from = "972523203925";
    event.to = "32312312345";
    event.source = "whatsapp";
    event.message = "Hello!"

    await conn.manager.save(event);

    await conn.close();
    logger.info('PG connection closed.');
})();
