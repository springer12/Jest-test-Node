// Libraries
import * as dotenv from "dotenv"; // Environment vars
import Pino from "pino"; // Logging library
import BQ from "bee-queue" // Queue management via Redis
import Twilio from 'twilio'; // WhatsApp library

// Services
import {CommsEventService} from "./service/CommsEvent.service"
import { createTypeormConnection } from "./utils/createTypeormConnection";

(async () => {
    dotenv.config(); // Load vars
    const logger = Pino({name: "Zenner Comms Dispatch"});
    logger.info("Starting");

    // const db = await createConnection();
    await createTypeormConnection();
    logger.info('PG connected');

    const commsEventService = new CommsEventService();

    // existing events in db
    const events = await commsEventService.getAll();
    console.log(events.length, ' events are already registered in db')


    const twilio = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    
    //creating instance of Queue class
    const queue_tamo = new BQ('subscriptions', {
      isWorker: true,
      redis: 
      {
        // url: 'redis://whocares:3EPncOHbkhhDW5QAjGKObPyZBnBrXwdc@redis-10028.c124.us-central1-1.gce.cloud.redislabs.com:10028',
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      }
    })
    
    queue_tamo.on('ready', () => {
      logger.info('queue now ready to start doing things');
    });
    
    queue_tamo.on('error', (err:any) => {
      logger.error(`A queue error happened: ${err.message}`);
    });
    
    queue_tamo.on('retrying', (job:any, err:any) => {
      console.warn(`Job ${job.id} failed with error ${err.message} but is being retried!`);
    });
    
    queue_tamo.on('failed', (job:any, err:any) => {
      logger.error(`Job ${job.id} failed with error ${err.message}`);
    });
    
    queue_tamo.on('stalled', (jobId:any) => {
      logger.error(`Job ${jobId} stalled and will be reprocessed`);
    });
    
    queue_tamo.on('succeeded', (job:any, result:any) => {
      logger.info(`Job ${job.id} succeeded with result: ${result}`);
    });
    
    queue_tamo.process(async function (job:any) {
      logger.info(job.data, `Processing job ${job.id}`);
      
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
      
      const event = await commsEventService.addEvent({...job.data, result});

      logger.debug(`Added event record ${event.id} to database`);
      return "Success";
    });

})();