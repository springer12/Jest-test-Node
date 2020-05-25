// Send a dummy message
import BQ from "bee-queue"
const bq = new BQ('subscriptions');

(async () => {
    console.log("Ready");
    bq.on('ready', async () => {
        console.log('queue now ready to start doing things');
        let job = bq.createJob({
            from: '+972523686125',
            to: '+16465063056',
            source: 'whatsapp',
            message: 'Hello! I am a test message!'
        });

        await job.save();
        process.exit(0);
    });

})();