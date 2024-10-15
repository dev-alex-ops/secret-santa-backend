import { Recipient } from "../app.type";

export interface SendMail {
    from?: string;
    to: Recipient;
    receiver: string;

    bcc?: string;
    subject?: string;
    content?: string;
}
