import "reflect-metadata";

import Pino from "pino";
import {createConnection, AdvancedConsoleLogger} from "typeorm";
import CommsEvent from "./entity/CommsEvent";

const logger = Pino({name: "Zenner Comms Dispatch"});


logger.info("Starting");

const redis = require('redis');
const redisOptions = {
  host: '127.0.0.1',
  port: 6379,
  db: 0,
  options: {},
  retry_strategy(options:any) {
    return Math.min(options.attempt * 100, 3000);
  },
};

const redisClient = redis.createClient(redisOptions);

const Queue = require('bee-queue')


//creating instance of Queue class
const queue = new Queue('subscriptions', {
  redis: redisClient,
  isWorker: true,
})


// adding functions to be called in case of following states of queue object: 'ready', 'error',...
queue.on('ready', () => {
  console.log('queue now ready to start doing things');
});

queue.on('error', (err:any) => {
  console.log(`A queue error happened: ${err.message}`);
});

queue.on('succeeded', (job:any, result:any) => {
  console.log(`Job ${job.id} succeeded with result: ${result}`);
});

queue.on('retrying', (job:any, err:any) => {
  console.log(`Job ${job.id} failed with error ${err.message} but is being retried!`);
});

queue.on('failed', (job:any, err:any) => {
  console.log(`Job ${job.id} failed with error ${err.message}`);
});

queue.on('stalled', (jobId:any) => {
  console.log(`Job ${jobId} stalled and will be reprocessed`);
});


// creating and registering the new job in the queue
const job = queue.createJob({x: 2, y: 3});
job
  .timeout(3000)
  .retries(2)
  .save()
  .then((job:any) => {
    console.log('job ---->', job.id, ' has been processed')
  });


// invoking the jobs that were registered in the queue
queue.process(function (job:any, done:any) {
    console.log(`Processing job ${job.id}`);
    return done(null, job.data.x + job.data.y);
});


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