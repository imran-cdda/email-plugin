import type { Resend } from "resend";
import type { EmailAdapter, EmailProvider, SendEmailRequest, SendEmailResponse } from "./types";
/**
 * Resend email adapter implementation
 */
export declare class ResendEmailAdapter implements EmailAdapter {
    name: EmailProvider;
    private resend;
    constructor(resend: Resend);
    sendEmail(email: SendEmailRequest): Promise<SendEmailResponse>;
    sendBulkEmails(emails: SendEmailRequest[]): Promise<SendEmailResponse[]>;
}
/**
 * Placeholder for SendGrid adapter
 */
export declare class SendGridEmailAdapter implements EmailAdapter {
    name: EmailProvider;
    constructor(apiKey: string);
    sendEmail(_email: SendEmailRequest): Promise<SendEmailResponse>;
    sendBulkEmails(_emails: SendEmailRequest[]): Promise<SendEmailResponse[]>;
}
/**
 * Placeholder for Bravo adapter
 */
export declare class BravoEmailAdapter implements EmailAdapter {
    name: EmailProvider;
    constructor(apiKey: string);
    sendEmail(_email: SendEmailRequest): Promise<SendEmailResponse>;
    sendBulkEmails(_emails: SendEmailRequest[]): Promise<SendEmailResponse[]>;
}
