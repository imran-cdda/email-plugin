import { EmailAdapter, EmailProvider, SendEmailRequest, SendEmailResponse } from "./types";
/**
 * Resend email adapter implementation
 */
export declare class ResendEmailAdapter implements EmailAdapter {
    private apiKey;
    name: EmailProvider;
    private resend;
    constructor();
    sendEmail(email: SendEmailRequest): Promise<SendEmailResponse>;
    sendBulkEmails(emails: SendEmailRequest[]): Promise<SendEmailResponse[]>;
}
