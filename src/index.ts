import Pino from "pino";
import BQ from "bee-queue"
import { createConnection } from "typeorm";
import CommsEvent from "./entity/CommsEvent";

(async () => {
    const logger = Pino({name: "Zenner Comms Dispatch"});
    logger.info("Starting");

    const conn = await createConnection();
    logger.info('PG connected');

    //creating instance of Queue class
    const queue = new BQ('subscriptions', {
        isWorker: true,
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
        console.log(result);
        logger.info(`Job ${job.id} succeeded with result: ${result}`);
    });

    queue.process(async function (job:any) {
        logger.info(job.data, `Processing job ${job.id}`);

        const event = new CommsEvent();

        event.from = job.data.from;
        event.to = job.data.to;
        event.source = job.data.source;
        event.message = job.data.message;

        await conn.manager.save(event);

        return "Success";
    });

})();