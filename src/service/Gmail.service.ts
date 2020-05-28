
//Libraries
const nodemailer = require("nodemailer");

interface GmailSendArgInterface {
    to: string;
    subject: string;
    html?: string;
    text?: string;
}

export class GmailService {
    private transporter: any;
    constructor() {
        this.transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                  type: 'OAuth2',
                  user: 'ops@gozenner.com',
                  serviceClient: process.env.GMAIL_SERVICE_CLIENT,
                  privateKey:
                    '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDtiNun81ZYQ5AP\nAGhOGaeHPiq7ifvpXuz9LcxJ+7Dyq9/y/6ItOj5CAGuogHcjBBX85Xe7tzL7cU82\nN6SdA/2tJmZWFI+lY727xVi2sOTV3JI9EWIDWyfbClm5FqZIdYE2HcI1r4bvRcOZ\npejLqOxLhsqUYCg5Gh00PZn9YPrMzXqH3XREOK9IO5fG70bEs91g+aIJhqd/j728\nFsmczfuiJ9XENfaqpM/2yUNdfVy7LhbEUedFfk94CkMQFDkDFkKintJOtBGJDtl/\npRgI47CN4yzqhyuayawMWweBUXI9qO/2kdHCdfOCIenpOgzyyJ+jx7mqzoniNjV2\nKno7NvQNAgMBAAECggEAI7U7MBhIlqQxd8/b3kHFCXOzANZRZFe80KKd31FS3Ggy\nFlmPi7UBvvJJPN9zCXSHyajFQxbbNyllewUKXgBHlkv7fl1A6t//mcak+3HENNIf\nucZvMYn2h9saedSJ0sK3VedLVr64Tifyq5phUJxoSUJOGdgKs+rVERFhoNF/YmIH\nMEymUiVILyU8xC578evCwdZetg7w3gNk3wlEYkERoR5Omg79hN2M8fs2V64Qp7PJ\nWkeL0yPGo7K/RmthOb/2ereb0S2lT0XeJnt7v9rkShqMW7WZjzEwfDkJyczhkfHk\nP/YU6SU0vliSrAxY5x6dRcGXyQNwoTGtl5b2hKR1kQKBgQD5SVZkfAe3ZP5k8EI2\nP3Oyd5NkVF2y5iXLWHG3JuqGwpFYeqiEH4ZQGpTUhcW4bwetH1cGtqSynynD927Z\nfl3uuqP2UPwC6UDBwNU1dHykhd9g5vpuH/KoM3FZL2Z+5xbviy8aIGRgtOgrbbIl\nrX3pBzcyI22bQLCUy4sZ5KSl/wKBgQDz7n/SYsIBcFmuEpBf0J0SIgQ2hlhGelRb\nTcMgFr9J/nWMWU9NpirSMQOtcTk+fvbircqYWuQrDGTwxkIEcGvSvsQfN/2G9f3D\ncTtMnSssvvn2d0lAUUwO0/z2EU2AGeJkkV3PP0Wzjcn75NiI6Jdo2yo2zhOpzqzY\nCFxIBuCd8wKBgQChN9y3f789zAL6JKetjbu1X7/i0u0GFfG7YKeqW3CxVoPJRQpW\n6Exk4cv+5cTJUoUUYYBWxygcnPLV2d/GqQL2sZ34Xsec2l0W8S7yMzOo8ytT8A1l\nyyOTxDE6DH2s9KbQpKMBspE4OccszvS3iUw0uIXp1x+7mEqa8Eg1prkU4QKBgQCD\nAyK13YLzgOM5whC21XW3Knv2yPsah1NNYpudXXpKBJgf1EvqmYfAMsEV44zqSwjQ\nwKTiZVbM5DBGvUTx22ud2gW9+rV5Sh+MXAGMaZGpy7y3KmQ2XjOqdyMTCkIEvmJA\nv26SBBqskEfeuY+vILVJhQTMQKyA9FcTBJKDwOXdDwKBgQCgln+vAcdxre+6+Gwd\n5ImfLOG30UYru6/0UPNsLwFBABpmO7BKoeAWv2RJp9Xp5eMJe2Ikoc/Ex/uWKl3J\nWmyCZNPsvDyKvv4mSLsctNX6j4W/5BuHJbA2AY/GhJWgmgHKwBVwG8rKY4LCj4pY\n7KQGlum38EZNAkFTOaUzsMR72w==\n-----END PRIVATE KEY-----\n',
                },
              });
    }
    
    async send (args: GmailSendArgInterface) {

        let bcc = "";
      
        if (String(args.to).includes("daniel@gozenner.com")) {
          bcc = "Elad Schaffer <elad@gozenner.com>";
        } else if (String(args.to).includes("elad@gozenner.com")) {
          bcc = "Daniel Green <daniel@gozenner.com>";
        } else {
          bcc = "elad@gozenner.com, daniel@gozenner.com";
        }
console.log('hereee')
        return await this.transporter.sendMail({
          from: "Flight Ops @ Zenner <ops@gozenner.com>",
          to: args.to,
          bcc: bcc,
          subject: args.subject,
          text: args.text || '',
          html: args.html || '',
        });
    }
}