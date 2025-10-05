import { baseAdapter } from "../base";
import { SendEmailRequest, SendEmailResponse } from "../types";
/**
 * Resend email adapter implementation
 */
export declare class ResendEmailAdapter extends baseAdapter {
    private apiKey;
    private resend;
    constructor();
    sendEmail(email: SendEmailRequest): Promise<SendEmailResponse>;
    sendBulkEmails(emails: SendEmailRequest[]): Promise<SendEmailResponse[]>;
}
