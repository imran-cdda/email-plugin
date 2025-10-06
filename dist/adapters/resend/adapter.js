import { Resend } from "resend";
import { baseAdapter } from "../base";
/**
 * Resend email adapter implementation
 */
export class ResendEmailAdapter extends baseAdapter {
    constructor() {
        super("resend");
        this.apiKey = process.env.RESEND_API_KEY || "";
        this.resend = new Resend(this.apiKey);
    }
    async sendEmail(email) {
        try {
            // Build email data with required fields
            const emailData = {
                from: email.from.email,
                to: email.to.map((t) => t.email),
                subject: email.subject,
                ...(email.html ? { html: email.html } : {}),
                ...(email.text ? { text: email.text } : {}),
                ...(email.cc ? { cc: email.cc.map((c) => c.email) } : {}),
                ...(email.bcc ? { bcc: email.bcc.map((b) => b.email) } : {}),
                ...(email.replyTo ? { replyTo: email.replyTo.email } : {}),
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
