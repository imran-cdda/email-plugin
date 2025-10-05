import { Resend } from "resend";
/**
 * Resend email adapter implementation
 */
export class ResendEmailAdapter {
    constructor() {
        this.apiKey = process.env.RESEND_API_KEY || "";
        this.name = "resend";
        this.resend = new Resend(this.apiKey);
    }
    async sendEmail(email) {
        try {
            // Build email data with required fields
            const emailData = {
                from: email.from,
                to: Array.isArray(email.to) ? email.to : [email.to],
                subject: email.subject,
                ...(email.html ? { html: email.html } : {}),
                ...(email.text ? { text: email.text } : {}),
                ...(email.cc
                    ? { cc: Array.isArray(email.cc) ? email.cc : [email.cc] }
                    : {}),
                ...(email.bcc
                    ? { bcc: Array.isArray(email.bcc) ? email.bcc : [email.bcc] }
                    : {}),
                ...(email.replyTo ? { replyTo: email.replyTo } : {}),
                ...(email.tags ? { tags: email.tags } : {}),
                ...(email.attachments
                    ? {
                        attachments: email.attachments.map((att) => ({
                            filename: att.filename,
                            content: att.content,
                            react: false,
                            ...(att.contentType ? { content_type: att.contentType } : {}),
                        })),
                    }
                    : {}),
            };
            const response = await this.resend.emails.send(emailData);
            if (response.error) {
                return {
                    success: false,
                    error: response.error.message,
                };
            }
            return {
                success: true,
                id: response.data?.id,
                providerId: response.data?.id,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
            };
        }
    }
    async sendBulkEmails(emails) {
        const results = [];
        // Process emails in batches to avoid rate limits
        const batchSize = 10;
        for (let i = 0; i < emails.length; i += batchSize) {
            const batch = emails.slice(i, i + batchSize);
            const batchPromises = batch.map((email) => this.sendEmail(email));
            const batchResults = await Promise.allSettled(batchPromises);
            for (const result of batchResults) {
                if (result.status === "fulfilled") {
                    results.push(result.value);
                }
                else {
                    results.push({
                        success: false,
                        error: result.reason instanceof Error
                            ? result.reason.message
                            : "Unknown error",
                    });
                }
            }
        }
        return results;
    }
}
