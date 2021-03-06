// Send a dummy message
import BQ from "bee-queue"
const bq = new BQ('subscriptions', {
        redis: {
            url: process.env.REDIS_URL,        
        }
    }
);

(async () => {
    console.log("Ready");
    let message = "Hello from redis server ------------";
    if (typeof process.argv[2] !== 'undefined') {
        message = process.argv[2];
    }
    bq.on('ready', async () => {
        console.log('queue now ready to start doing things');
        let job = bq.createJob({
            from: 'Flight Ops @ Zenner <ops@gozenner.com>',
            to: 'tamarimenteshashvili7@gmail.com',
            subject: 'some subject',
            message: message,
            html: '',
            source: 'gmail',
            server: 'localhost',
        });

        await job.save();
        process.exit(0);
    });

})();