import { EmailProvider, SendEmailRequest, SendEmailResponse } from "./types";
export declare abstract class baseAdapter {
    name: EmailProvider;
    constructor(name: EmailProvider);
    abstract sendEmail(email: SendEmailRequest): Promise<SendEmailResponse>;
    abstract sendBulkEmails(emails: SendEmailRequest[]): Promise<SendEmailResponse[]>;
}
