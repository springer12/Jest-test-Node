// Libraries
import * as dotenv from "dotenv"; // Environment vars
import Pino from "pino"; // Logging library
import BQ from "bee-queue" // Queue management via Redis
import { createConnection } from "typeorm"; // Database ORM
import Twilio from 'twilio'; // WhatsApp library

// Database entities
import CommsEvent from "./entity/CommsEvent";

(async () => {
    dotenv.config(); // Load vars

    const logger = Pino({name: "Zenner Comms Dispatch"});
    logger.info("Starting");

    const db = await createConnection();
    logger.info('PG connected');

    const twilio = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

    //creating instance of Queue class
    const queue = new BQ('subscriptions', {
        isWorker: true,
        redis: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
        }
    })

    queue.on('ready', () => {
        logger.info('queue now ready to start doing things');
    });

    queue.on('error', (err:any) => {
        logger.error(`A queue error happened: ${err.message}`);
    });

    queue.on('retrying', (job:any, err:any) => {
        console.warn(`Job ${job.id} failed with error ${err.message} but is being retried!`);
    });

    queue.on('failed', (job:any, err:any) => {
        logger.error(`Job ${job.id} failed with error ${err.message}`);
    });

    queue.on('stalled', (jobId:any) => {
        logger.error(`Job ${jobId} stalled and will be reprocessed`);
    });

    queue.on('succeeded', (job:any, result:any) => {
        logger.info(`Job ${job.id} succeeded with result: ${result}`);
    });

    queue.process(async function (job:any) {
        logger.info(job.data, `Processing job ${job.id}`);

        const event = new CommsEvent();
        let result = "SUCCESS";

        try {
            let twilioResult = await twilio.messages.create({
                from: job.data.from,
                to: job.data.to,
                body: job.data.message,
            });
            logger.info(twilioResult, `Sent message via Twiliio`)
        } catch (err) {
            result = "FAILED";
            logger.error(err, `Twilio failed to send a message`);
        }

        event.from = job.data.from;
        event.to = job.data.to;
        event.source = job.data.source;
        event.server = job.data.server;
        event.human = job.data.human;
        event.result = result;
        event.message = job.data.message;

        await db.manager.save(event);
        logger.debug(`Added event record ${event.id} to database`);
        return "Success";
    });

})();