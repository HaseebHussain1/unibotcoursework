const functions = require('firebase-functions');
const cors = require('cors')({ origin: true});

const serviceAccount = require('./serviceAccountKey.json');




const dialogflow = require('@google-cloud/dialogflow');


exports.app = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {


    const sessionClient = new dialogflow.SessionsClient({
    keyFilename: './serviceAccountKey.json'
});

    const session = sessionClient.projectAgentSessionPath('test-eixuyp', '1');
    console.log(request.body.queryInput.text.message);
    const requests = {
        session: session,
        queryInput: {
          text: {
            // The query to send to the dialogflow agent
            text: request.body.queryInput.text.message,
            // The language used by the client (en-US)
            languageCode: 'en-US',
          },
        },
      };

    const responses = await sessionClient.detectIntent(requests);

    const result = responses[0].queryResult;

    response.send(result);
  });
});
