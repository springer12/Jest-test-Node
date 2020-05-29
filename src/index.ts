// Libraries
import * as dotenv from "dotenv"; // Environment vars
import Pino from "pino"; // Logging library
import BQ from "bee-queue" // Queue management via Redis

// Utils
import { createTypeormConnection } from "./utils/createTypeormConnection";

// Services
import {CommsEventService} from "./service/CommsEvent.service";
import {WhatsAppService} from "./service/WhatsApp.service";
import {GmailService} from "./service/Gmail.service";


(async () => {
    dotenv.config(); // Load vars
    const logger = Pino({name: "Zenner Comms Dispatch"});
    logger.info("Starting");

    // db connection
    let db;
    try{
      db = await createTypeormConnection();
      logger.info('PG connected');
    }catch(err){
      logger.error('Could not create typeORM connection as ', err)
    }

    // service instances
    const commsEventService = new CommsEventService(db);
    const whatsAppService = new WhatsAppService();
    const gmailService = new GmailService();

    //creating instance of Queue class
    let bq;
    try{
      bq = new BQ('subscriptions', {
        isWorker: true,
        redis: 
        {
          // host: process.env.REDIS_HOST,
          // port: Number(process.env.REDIS_PORT),
          url: process.env.REDIS_URL
        }
      })
    }catch(err){
      logger.error('Could not process bee-que as ', err)
    }
    
    bq.on('ready', () => {
      logger.info('queue now ready to start doing things');
    });
    
    bq.on('error', (err:any) => {
      logger.error(`A queue error happened: ${err.message}`);
    });
    
    bq.on('retrying', (job:any, err:any) => {
      console.warn(`Job ${job.id} failed with error ${err.message} but is being retried!`);
    });
    
    bq.on('failed', (job:any, err:any) => {
      logger.error(`Job ${job.id} failed with error ${err.message}`);
    });
    
    bq.on('stalled', (jobId:any) => {
      logger.error(`Job ${jobId} stalled and will be reprocessed`);
    });
    
    bq.on('succeeded', (job:any, result:any) => {
      logger.info(`Job ${job.id} succeeded with result: ${result}`);
    });
    
    bq.process(async function (job:any) {
      logger.info(job.data, `Processing job ${job.id}`);
      
      let result = "SUCCESS";

      if(job.data.source === 'whatsapp'){
        try {
          let obj = {
            from: job.data.from,
            to: job.data.to,
            body: job.data.message
          }
          let twilioResult = await whatsAppService.send(obj);
          logger.info(twilioResult, `Sent message via Twiliio`)
        } catch (err) {
          result = "FAILED";
          logger.error(err, `Twilio failed to send a message`);
        }
      }
      else if(job.data.source === 'gmail'){
        try {
          let gmailObj = {
            to: job.data.to,
            subject: job.data.subject,
            html: '',
            text: job.data.message,
          }
          const gmailResult = await gmailService.send(gmailObj)
          logger.info(gmailResult, `Sent message via Gmail`)
        } catch (err) {
          result = "FAILED";
          logger.error(err, `nodemailer failed to send a message`);
        }
      }
      else{
        logger.error(`unknown source`);
        result="FAIL"
      }

      const event = await commsEventService.addEvent({...job.data, result});
      logger.debug(`Added event record ${event.id} to database`);

      return "Success";
    });

})();