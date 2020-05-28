
//Libraries
import Twilio from 'twilio'; // WhatsApp library

export class WhatsAppService {
    private twilio: any;
    constructor() {
        this.twilio = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    }
    
    async send(obj:any) {
        const result = await this.twilio.messages.create({
          from: obj.from,
          to: obj.to,
          body: obj.body
        });
        return result
      }
}