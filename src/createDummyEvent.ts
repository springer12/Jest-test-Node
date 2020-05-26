// Send a dummy message
import BQ from "bee-queue"
const bq = new BQ('subscriptions');

(async () => {
    console.log("Ready");
    let message = "Hello";

    if (typeof process.argv[2] !== 'undefined') {
        message = process.argv[2];
    }
    bq.on('ready', async () => {
        console.log('queue now ready to start doing things');
        let job = bq.createJob({
            from: 'whatsapp:+13235082016',
            to: 'whatsapp:+972523686125',
            source: 'whatsapp',
            human: false,
            message: message,
            server: 'localhost'
        });

        await job.save();
        process.exit(0);
    });

})();