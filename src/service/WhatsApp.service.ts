
//Libraries
import Twilio from 'twilio'; // WhatsApp library

interface SendArgInterface {
    from: string;
    to: string;
    body:string;
}
export class WhatsAppService {
    private twilio: any;
    constructor() {
        this.twilio = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    }

    
    async send(obj: SendArgInterface) {
        const result = await this.twilio.messages.create({
          from: obj.from,
          to: obj.to,
          body: obj.body
        });
        return result
      }
}