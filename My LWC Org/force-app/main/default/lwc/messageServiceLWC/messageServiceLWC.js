import { LightningElement, wire, track} from 'lwc';
import { publish, subscribe, releaseMessageContext, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';

import SAYWHATMC from '@salesforce/messageChannel/SayWhat__c';

export default class SubscribeComponent extends LightningElement {
    @track myMessage = '';
    @wire(MessageContext)
    messageContext;
    

    subscription = null;
    receivedMessage;

    subscribeMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext,
            SAYWHATMC, (message) => {
                this.handleMessage(message);
            },
            {scope: APPLICATION_SCOPE});
    }

    unsubscribeMC() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleMessage(message) {

        const mess = message.messageToSend;
        const source = message.sourceSystem;
        console.log('-mess---'+mess);
        this.receivedMessage = 'Message: ' + mess + '. Sent From: ' + source;
        //this.receivedMessage = message ? JSON.stringify(message, null, '\t') : 'no message payload';
    }

    handleChange(event) {
        this.myMessage = event.target.value;
    }

    handleClick() {
        const payload = {
            sourceSystem: "lwc",
            messageToSend: this.myMessage
        };

        publish(this.messageContext, SAYWHATMC, payload);
    }

    disconnectedCallback() {
        releaseMessageContext(this.messageContext);
    }

}