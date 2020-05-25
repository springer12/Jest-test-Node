# Zenner Dispatch Router

This application receives messages that need to be sent via a pre-configured 
channel such as WhatsApp, Facebook Messenger, or Email. Sends that message 
and then logs the message to a database in order to create an audit trail.

Messages arrive via a Redis queue (via the bee-queue library) allowing 
for this application to be run across multiple servers without conflict and 
allowing for this logic to be separated from the original Firebase code.

### Instructions

Note you will need a redis and postgres database available, the default 
assumption is both are available via localhost on their default port.

#### Running in development
    yarn install
    yarn dev

#### Running in production
    npm install
    npm run compile
    npm start