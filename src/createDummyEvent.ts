// Send a dummy message
import BQ from "bee-queue"
const bq = new BQ('subscriptions', 
{
    // redis: {
    //     url: 'redis://whocares:3EPncOHbkhhDW5QAjGKObPyZBnBrXwdc@redis-10028.c124.us-central1-1.gce.cloud.redislabs.com:10028',        
    // }
}
);

(async () => {
    console.log("Ready");
    let message = "Hello local";
    if (typeof process.argv[2] !== 'undefined') {
        message = process.argv[2];
    }
    bq.on('ready', async () => {
        console.log('queue now ready to start doing things');
        let job = bq.createJob({
            from: 'whatsapp:+13235082016',
            to: 'whatsapp:+995591978104',
            source: 'whatsapp',
            human: false,
            message: message,
            server: 'localhost'
        });

        await job.save();
        process.exit(0);
    });

})();