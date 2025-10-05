import { SendEmailRequest, SendEmailResponse } from "./types";
/**
 * Resend email adapter implementation
 */
export declare class ResendEmailAdapter {
    private apiKey;
    private resend;
    constructor();
    sendEmail(email: SendEmailRequest): Promise<SendEmailResponse>;
    sendBatchEmails(emails: SendEmailRequest[]): Promise<SendEmailResponse[]>;
}
