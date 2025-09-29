import type { CreateEmailOptions, Resend } from "resend";
import type {
  EmailAdapter,
  EmailAttachment,
  EmailProvider,
  SendEmailRequest,
  SendEmailResponse,
} from "./types";

/**
 * Resend email adapter implementation
 */
export class ResendEmailAdapter implements EmailAdapter {
  name: EmailProvider = "resend";
  private resend: Resend;

  constructor(resend: Resend) {
    this.resend = resend;
  }

  async sendEmail(email: SendEmailRequest): Promise<SendEmailResponse> {
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
              attachments: email.attachments.map((att: EmailAttachment) => ({
                filename: att.filename,
                content: att.content,
                ...(att.contentType ? { content_type: att.contentType } : {}),
              })),
            }
          : {}),
      };

      const response = await this.resend.emails.send(
        emailData as CreateEmailOptions
      );

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
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async sendBulkEmails(
    emails: SendEmailRequest[]
  ): Promise<SendEmailResponse[]> {
    const results: SendEmailResponse[] = [];

    // Process emails in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const batchPromises = batch.map((email) => this.sendEmail(email));
      const batchResults = await Promise.allSettled(batchPromises);

      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          results.push(result.value);
        } else {
          results.push({
            success: false,
            error:
              result.reason instanceof Error
                ? result.reason.message
                : "Unknown error",
          });
        }
      }
    }

    return results;
  }
}

/**
 * Placeholder for SendGrid adapter
 */
export class SendGridEmailAdapter implements EmailAdapter {
  name: EmailProvider = "sendgrid";

  constructor(apiKey: string) {
    // TODO: Initialize SendGrid client
    console.log("SendGrid adapter initialized with API key:", apiKey);
  }

  async sendEmail(_email: SendEmailRequest): Promise<SendEmailResponse> {
    // TODO: Implement SendGrid email sending
    throw new Error("SendGrid adapter not yet implemented");
  }

  async sendBulkEmails(
    _emails: SendEmailRequest[]
  ): Promise<SendEmailResponse[]> {
    // TODO: Implement SendGrid bulk email sending
    throw new Error("SendGrid bulk adapter not yet implemented");
  }
}

/**
 * Placeholder for Bravo adapter
 */
export class BravoEmailAdapter implements EmailAdapter {
  name: EmailProvider = "bravo";

  constructor(apiKey: string) {
    // TODO: Initialize Bravo client
    console.log("Bravo adapter initialized with API key:", apiKey);
  }

  async sendEmail(_email: SendEmailRequest): Promise<SendEmailResponse> {
    // TODO: Implement Bravo email sending
    throw new Error("Bravo adapter not yet implemented");
  }

  async sendBulkEmails(
    _emails: SendEmailRequest[]
  ): Promise<SendEmailResponse[]> {
    // TODO: Implement Bravo bulk email sending
    throw new Error("Bravo bulk adapter not yet implemented");
  }
}
