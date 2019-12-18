
// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');
const moment = require('moment-timezone');

var value = 0;
var i = 0;
const questions = [' The first statement is: My energy level is low', 'I am struggling to focus on tasks', 'I deny or ignore my problems', 'Too many deadlines', 'My self-esteem is low', 'Quesiton 6', 'Question7'];

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello! What is your name?';
        const repromptText = 'Sorry, can you repeat your name?'; 
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

const HasNameLaunchRequestHandler = {    
    canHandle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;        
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        
        const name = sessionAttributes.hasOwnProperty('name') ? sessionAttributes.name : 0;       
        
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest' && name;
    },    
    async handle(handlerInput) {
        const serviceClientFactory = handlerInput.serviceClientFactory;
        const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;
        const attributesManager = handlerInput.attributesManager;        
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        
        const name = sessionAttributes.hasOwnProperty('name') ? sessionAttributes.name : 0;        

        // TODO:: Use the settings API to get current date and then compute how many days until user's birthday       
        // TODO:: Say Happy birthday on the user's birthday
        
        const speakOutput = `Welcome back ${name}. Shall we begin?`;
        i = 0;
        return handlerInput.responseBuilder            
        .speak(speakOutput)
        .reprompt()
        .getResponse();
    }
};

const CaptureNameIntentHandler = {
    
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CaptureNameIntent';
            
    },
    async handle(handlerInput) {
        const name = handlerInput.requestEnvelope.request.intent.slots.name.value;
        
        const attributesManager = handlerInput.attributesManager;
        
        const birthdayAttributes = { 
            "name" : name, 
            
        };
        
        attributesManager.setPersistentAttributes(birthdayAttributes);
        await attributesManager.savePersistentAttributes();

        const speakOutput = `Thanks, I'll remember that your name is ${name}. Shall we begin?`;
        i = 0;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};

const YesIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
        && handlerInput.requestEnvelope.request.intent.name === "AMAZON.YesIntent";
    },
    handle(handlerInput){
        const speechText = `I'll say 5 statements. Please rate each statement on a scale of 0-3. 0 being not at all and 3 being all the time.` + questions[i];
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
}

const NoIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
        && handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent";
    },
    handle(handlerInput){
        const speechText = `Okay, have a nice day!`;
        
        return handlerInput.responseBuilder
            .speak(speechText)
            // .reprompt(speechText)
            .getResponse();
    }
}

const AnswerIntentHandler = {
    
 canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
        && handlerInput.requestEnvelope.request.intent.name === "AnswerIntent";
    },
    handle(handlerInput){
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        const name = sessionAttributes.hasOwnProperty('name') ? sessionAttributes.name : 0;
        if(i === 4) {
            const answer = handlerInput.requestEnvelope.request.intent.slots.answer.value;
            if (parseInt(answer) > 3) {
             value += 3;
             }  
             else if (parseInt(answer) < 0){
                 value+=0;
             }
             else {
            value += parseInt(answer);
             }
            i += 1;
             
    
            const positive = [`That's good to hear ${name} you're doing really well`, `Wow name you're feeling geat aren't you!`, `I'm really happy to hear how well you're doing ${name}`, `Oh my ${name} someones doing great today!`, `Go on ${name} spoil yourself, gt a glass of bubbly out!`];
            const hobby = ['music', 'podcast', 'cardio','dance'];
            const randomN = Math.floor(Math.random() * Math.floor(4));
            const neutral = [`Thanks for taking the time to answer ${name} maybe you should ` + hobby[randomN],`I think it's time we practice some self ${name} love why dont you go for a `+ hobby[randomN],`Have you been busy recently ${name} i think we should practice `+ hobby[randomN], `when was the last time you `+ hobby[randomN]+ ` if it hasnt been a while, I think you should do it now`,`${name} maybe you should call a friend`];
            const negative = [`${name} I think it's time for a check up, maybe you should make an appointment.`];
            var x;
            var max;
            if (value<6){
                max = positive.length;
                x = positive;
            }
            else if (value >=6 && value <= 10){
                max = neutral.length;
                x = neutral;
            }
            else {
                max =  negative.length;
                 x = negative;
            }
            const randomNum = Math.floor(Math.random() * Math.floor(max));
             const speechText = x[randomNum];
    
            return handlerInput.responseBuilder
                .speak(speechText)
                .getResponse();
            }
            else {
            const answer = handlerInput.requestEnvelope.request.intent.slots.answer.value;
            if (parseInt(answer) > 3) {
             value += 3;
             }
             else if (parseInt(answer) < 0){
                 value+=0;
             } else {
            value += parseInt(answer);
             }
            i += 1;
            
            const speechText = questions[i];
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .getResponse();
        }

    }
}

const CreateReminderIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
         && handlerInput.requestEnvelope.request.intent.name === 'CreateReminderIntent';
    },
    async handle(handlerInput) {
        const reminderApiClient = handlerInput.serviceClientFactory.getReminderManagementServiceClient(),
            { permissions } = handlerInput.requestEnvelope.context.System.user
            
        if(!permissions) {
            return handlerInput.responseBuilder
                .speak("Please go to the Alexa mobile app to grant reminder permissions.")
                .withAskForPermissionsConsentCard(['alexa::alerts:reminders:skill:readwrite'])
                .getResponse();
        }
        
        const reminderRequest = {
           "trigger": {
                "type" : "SCHEDULED_RELATIVE",
                "offsetInSeconds" : "30"
           },
           "alertInfo": {
                "spokenInfo": {
                    "content": [{
                        "locale": "en-US", 
                        "text": "Let's Talk!"
                    }]
                }
            },
            "pushNotification" : {                            
                 "status" : "ENABLED"
            }
        }
        
        try {
            await reminderApiClient.createReminder(reminderRequest);
        } catch (error) {
            console.log(`~~~~ Error handled: ${error}`);
            return handlerInput.responseBuilder
                .speak("There was an error in your reminder. Please try again later.")
                .getResponse();
        }
        
        const speechText = 'You succesfully created a reminder!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LoadBirthdayInterceptor = {    
    async process(handlerInput) {        
        const attributesManager = handlerInput.attributesManager;        
        const sessionAttributes = await attributesManager.getPersistentAttributes() || {};
        
        const name = sessionAttributes.hasOwnProperty('name') ? sessionAttributes.name : 0;
        if (name) {            
            attributesManager.setSessionAttributes(sessionAttributes);        
        }    
    }
};


    
// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .withApiClient(new Alexa.DefaultApiClient())
    .withPersistenceAdapter( 
        new persistenceAdapter.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET}) 
    )

    .addRequestHandlers(
        HasNameLaunchRequestHandler,
        LaunchRequestHandler,
        CaptureNameIntentHandler,
        AnswerIntentHandler,
        CreateReminderIntentHandler,
        YesIntentHandler,
        NoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
        
    )
    .addRequestInterceptors(
            LoadBirthdayInterceptor 
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();
