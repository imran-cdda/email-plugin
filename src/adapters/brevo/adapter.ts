import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
  SendSmtpEmail,
} from "@getbrevo/brevo";
import {
  AddDomainResponse,
  BatchEmailConfig,
  deleteDomainResponse,
  DomainResponse,
  EmailAttachment,
  EmailContact,
  EmailSendResponse,
  EmailStatisticsOptions,
  EmailStatusResponse,
  ScheduledBatchEmailConfig,
  ScheduledEmailConfig,
  SimpleEmailConfig,
} from "./types";

/**
 * Comprehensive Brevo Email Sender with full type safety
 * Supports all Brevo transactional email features
 */
export class BrevoEmailAdapter {
  private api: TransactionalEmailsApi;
  private defaultSender?: EmailContact;
  private apiKey: string = process.env.BREVO_API_KEY || "";
  private readonly baseDomain =
    process.env.BREVO_BASE_DOMAIN || "https://api.brevo.com/v3";

  /**
   * Initialize Brevo Email Sender
   * @param apiKey - Your Brevo API key
   * @param defaultSender - Optional default sender for all emails
   */
  constructor(defaultSender?: EmailContact) {
    this.api = new TransactionalEmailsApi();
    this.api.setApiKey(TransactionalEmailsApiApiKeys.apiKey, this.apiKey);
    this.defaultSender = defaultSender;
  }

  private async executeRequest(url: string, method: string, body?: string) {
    try {
      const response = await fetch(`${this.baseDomain}${url}`, {
        method,
        body,
        headers: {
          "Content-Type": "application/json",
          "api-key": this.apiKey,
        },
      });
      if (!response.ok) {
        return {
          success: false,
          message: await response.text(),
        };
      }
      return {
        success: true,
        data: await response.json(),
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  // ==========================================================================
  // SIMPLE EMAIL SENDING
  // ==========================================================================

  /**
   * Send a simple transactional email with HTML/text content
   * @param config - Email configuration
   * @returns Promise with message ID
   */
  async sendEmail(config: SimpleEmailConfig): Promise<EmailSendResponse> {
    const emailData: SendSmtpEmail = {
      sender: config.sender || this.defaultSender,
      to: config.to,
      cc: config.cc,
      bcc: config.bcc,
      subject: config.subject,
      htmlContent: config.htmlContent,
      textContent: config.textContent,
      replyTo: config.replyTo,
      attachment: config.attachment,
      headers: config.headers,
      tags: config.tags,
      params: config.params,
    };

    this.validateEmailData(emailData);

    const response = await this.api.sendTransacEmail(emailData);
    return {
      messageId: response.body.messageId,
    };
  }

  /**
   * Send a quick email with minimal configuration
   * @param to - Recipient email address
   * @param subject - Email subject
   * @param htmlContent - HTML content
   * @param textContent - Optional plain text content
   * @returns Promise with message ID
   */
  async sendQuickEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string
  ): Promise<EmailSendResponse> {
    if (!this.defaultSender) {
      throw new Error(
        "Default sender must be configured to use sendQuickEmail"
      );
    }

    return this.sendEmail({
      sender: this.defaultSender,
      to: [{ email: to }],
      subject,
      htmlContent,
      textContent,
    });
  }

  // ==========================================================================
  // BATCH EMAIL SENDING
  // ==========================================================================

  /**
   * Send batch emails with multiple versions (up to 1000 versions per call)
   * @param config - Batch email configuration
   * @returns Promise with array of message IDs
   */
  async sendBatchEmails(config: BatchEmailConfig): Promise<EmailSendResponse> {
    if (config.messageVersions.length > 1000) {
      throw new Error("Maximum 1000 message versions allowed per batch");
    }

    const emailData: SendSmtpEmail = {
      sender: config.sender || this.defaultSender,
      subject: config.subject,
      htmlContent: config.htmlContent,
      textContent: config.textContent,
      templateId: config.templateId,
      params: config.params,
      batchId: config.batchId,
      replyTo: config.replyTo,
      headers: config.headers,
      tags: config.tags,
    };

    this.validateEmailData(emailData);

    const response = await this.api.sendTransacEmail(emailData);
    return {
      messageIds: response.body.messageIds,
    };
  }

  // ==========================================================================
  // SCHEDULED EMAIL SENDING
  // ==========================================================================

  /**
   * Schedule an email to be sent at a specific time
   * @param config - Scheduled email configuration
   * @returns Promise with message ID
   */
  async scheduleEmail(
    config: ScheduledEmailConfig
  ): Promise<EmailSendResponse> {
    this.validateScheduledDate(config.scheduledAt);

    const emailData: SendSmtpEmail = {
      sender: config.sender || this.defaultSender,
      to: config.to,
      cc: config.cc,
      bcc: config.bcc,
      subject: config.subject,
      htmlContent: config.htmlContent,
      textContent: config.textContent,
      scheduledAt: new Date(config.scheduledAt),
      batchId: config.batchId,
      replyTo: config.replyTo,
      attachment: config.attachment,
      headers: config.headers,
      tags: config.tags,
      params: config.params,
    };

    this.validateEmailData(emailData);

    const response = await this.api.sendTransacEmail(emailData);
    return {
      messageId: response.body.messageId,
    };
  }

  /**
   * Schedule batch emails to be sent at a specific time
   * @param config - Scheduled batch email configuration
   * @returns Promise with array of message IDs
   */
  async scheduleBatchEmails(
    config: ScheduledBatchEmailConfig
  ): Promise<EmailSendResponse> {
    this.validateScheduledDate(config.scheduledAt);

    if (config.messageVersions.length > 1000) {
      throw new Error("Maximum 1000 message versions allowed per batch");
    }

    const emailData: SendSmtpEmail = {
      sender: config.sender || this.defaultSender,
      subject: config.subject,
      htmlContent: config.htmlContent,
      textContent: config.textContent,
      templateId: config.templateId,
      params: config.params,
      scheduledAt: new Date(config.scheduledAt),
      batchId: config.batchId,
      replyTo: config.replyTo,
      headers: config.headers,
      tags: config.tags,
    };

    this.validateEmailData(emailData);

    const response = await this.api.sendTransacEmail(emailData);
    return {
      messageIds: response.body.messageIds,
    };
  }

  // ==========================================================================
  // SCHEDULED EMAIL MANAGEMENT
  // ==========================================================================

  /**
   * Get status of a scheduled email
   * @param identifier - Message ID or Batch ID
   * @returns Promise with email status
   */
  async getScheduledEmailStatus(
    limit?: number,
    startDate?: string,
    endDate?: string,
    days?: number,
    email?: string,
    event?:
      | "bounces"
      | "hardBounces"
      | "softBounces"
      | "delivered"
      | "spam"
      | "requests"
      | "opened"
      | "clicks"
      | "invalid"
      | "deferred"
      | "blocked"
      | "unsubscribed"
      | "error"
      | "loadedByProxy",
    messageId?: string,
    sort?: "asc" | "desc"
  ): Promise<EmailStatusResponse> {
    const response = await this.api.getEmailEventReport(
      limit,
      undefined,
      startDate,
      endDate,
      days,
      email,
      event,
      messageId,
      sort
    );
    return response.body as EmailStatusResponse;
  }

  /**
   * Delete a scheduled email
   * @param identifier - Message ID or Batch ID
   * @returns Promise<void>
   */
  async deleteScheduledEmail(identifier: string): Promise<void> {
    await this.api.deleteScheduledEmailById(identifier);
  }

  // ==========================================================================
  // EMAIL TRACKING & STATISTICS
  // ==========================================================================

  /**
   * Get transactional email statistics
   * @param options - Statistics filter options
   * @returns Promise with email statistics
   */
  async getEmailStatistics(options: EmailStatisticsOptions = {}): Promise<any> {
    const response = await this.api.getTransacEmailsList(
      undefined,
      undefined,
      options.messageId,
      options.startDate,
      options.endDate,
      undefined, // sort
      options.limit
    );
    return response.body;
  }

  // ==========================================================================
  // BLOCKED DOMAINS MANAGEMENT
  // ==========================================================================

  /**
   * Add a domain to the list of blocked domains
   * @param domain - Domain to
   * @returns Promise with added domain
   */
  async addDomain(domain: string): Promise<AddDomainResponse> {
    const response = await this.executeRequest(
      "/senders/domains",
      "POST",
      JSON.stringify({ name: domain })
    );
    return response.data;
  }

  /**
   * Get list of domains
   * @returns Promise with domain list
   */
  async getDomains(): Promise<DomainResponse> {
    const response = await this.executeRequest("/senders/domains", "GET");
    return response.data;
  }

  /**
   * Delete a domain from the list of domains
   * @param domain - Domain to delete
   * @returns Promise with deleted domain
   */
  async deleteDomain(domain: string): Promise<deleteDomainResponse> {
    const response = await this.executeRequest(
      "/senders/domains/" + domain,
      "DELETE"
    );
    return response.data;
  }

  /**
   * Get list of blocked domains
   * @returns Promise with blocked domains
   */
  async getBlockedDomains(): Promise<any> {
    const response = await this.api.getBlockedDomains();
    return response.body;
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  /**
   * Validate email data before sending
   * @param emailData - Email data to validate
   * @throws Error if validation fails
   */
  private validateEmailData(emailData: SendSmtpEmail): void {
    if (!emailData.sender) {
      throw new Error("Sender is required");
    }

    if (!emailData.sender.email) {
      throw new Error("Sender email is required");
    }

    if (!this.isValidEmail(emailData.sender.email)) {
      throw new Error("Invalid sender email address");
    }

    // Validate recipients
    if (emailData.to && emailData.to.length > 0) {
      emailData.to.forEach((recipient) => {
        if (!this.isValidEmail(recipient.email)) {
          throw new Error(`Invalid recipient email: ${recipient.email}`);
        }
      });
    } else if (
      !emailData.messageVersions ||
      emailData.messageVersions.length === 0
    ) {
      throw new Error("At least one recipient is required");
    }

    // Validate CC recipients
    if (emailData.cc && emailData.cc.length > 0) {
      emailData.cc.forEach((recipient) => {
        if (!this.isValidEmail(recipient.email)) {
          throw new Error(`Invalid CC email: ${recipient.email}`);
        }
      });
    }

    // Validate BCC recipients
    if (emailData.bcc && emailData.bcc.length > 0) {
      emailData.bcc.forEach((recipient) => {
        if (!this.isValidEmail(recipient.email)) {
          throw new Error(`Invalid BCC email: ${recipient.email}`);
        }
      });
    }

    // Validate subject
    if (!emailData.subject && !emailData.templateId) {
      throw new Error("Subject is required when not using a template");
    }

    // Validate content
    if (
      !emailData.htmlContent &&
      !emailData.textContent &&
      !emailData.templateId &&
      (!emailData.messageVersions || emailData.messageVersions.length === 0)
    ) {
      throw new Error(
        "Either htmlContent, textContent, or templateId is required"
      );
    }
  }

  /**
   * Validate email address format
   * @param email - Email address to validate
   * @returns boolean
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate scheduled date format
   * @param scheduledAt - Date string to validate
   * @throws Error if date is invalid or in the past
   */
  private validateScheduledDate(scheduledAt: string): void {
    const scheduledDate = new Date(scheduledAt);
    const now = new Date();

    if (isNaN(scheduledDate.getTime())) {
      throw new Error("Invalid scheduled date format. Use ISO 8601 format.");
    }

    if (scheduledDate <= now) {
      throw new Error("Scheduled date must be in the future");
    }
  }

  /**
   * Create an email attachment from a file
   * @param content - Base64 encoded file content
   * @param name - File name with extension
   * @returns EmailAttachment object
   */
  static createAttachment(content: string, name: string): EmailAttachment {
    return { content, name };
  }

  /**
   * Create an email attachment from a URL
   * @param url - URL of the file
   * @param name - Optional file name
   * @returns EmailAttachment object
   */
  static createAttachmentFromUrl(url: string, name?: string): EmailAttachment {
    return { url, name };
  }

  /**
   * Generate ISO 8601 formatted date for scheduling
   * @param date - Date object or timestamp
   * @returns ISO formatted date string
   */
  static formatScheduledDate(date: Date | number): string {
    if (typeof date === "number") {
      date = new Date(date);
    }
    return date.toISOString();
  }

  /**
   * Schedule email for a specific number of hours from now
   * @param hours - Number of hours from now
   * @returns ISO formatted date string
   */
  static scheduleInHours(hours: number): string {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date.toISOString();
  }

  /**
   * Schedule email for a specific number of days from now
   * @param days - Number of days from now
   * @returns ISO formatted date string
   */
  static scheduleInDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }
}

export default BrevoEmailAdapter;
