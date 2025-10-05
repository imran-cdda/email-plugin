import { AddDomainResponse, BatchEmailConfig, deleteDomainResponse, DomainResponse, EmailAttachment, EmailContact, EmailSendResponse, EmailStatisticsOptions, EmailStatusResponse, ScheduledBatchEmailConfig, ScheduledEmailConfig, SimpleEmailConfig } from "./types";
/**
 * Comprehensive Brevo Email Sender with full type safety
 * Supports all Brevo transactional email features
 */
export declare class BrevoEmailAdapter {
    private api;
    private defaultSender?;
    private apiKey;
    private readonly baseDomain;
    /**
     * Initialize Brevo Email Sender
     * @param apiKey - Your Brevo API key
     * @param defaultSender - Optional default sender for all emails
     */
    constructor(defaultSender?: EmailContact);
    private executeRequest;
    /**
     * Send a simple transactional email with HTML/text content
     * @param config - Email configuration
     * @returns Promise with message ID
     */
    sendEmail(config: SimpleEmailConfig): Promise<EmailSendResponse>;
    /**
     * Send a quick email with minimal configuration
     * @param to - Recipient email address
     * @param subject - Email subject
     * @param htmlContent - HTML content
     * @param textContent - Optional plain text content
     * @returns Promise with message ID
     */
    sendQuickEmail(to: string, subject: string, htmlContent: string, textContent?: string): Promise<EmailSendResponse>;
    /**
     * Send batch emails with multiple versions (up to 1000 versions per call)
     * @param config - Batch email configuration
     * @returns Promise with array of message IDs
     */
    sendBatchEmails(config: BatchEmailConfig): Promise<EmailSendResponse>;
    /**
     * Schedule an email to be sent at a specific time
     * @param config - Scheduled email configuration
     * @returns Promise with message ID
     */
    scheduleEmail(config: ScheduledEmailConfig): Promise<EmailSendResponse>;
    /**
     * Schedule batch emails to be sent at a specific time
     * @param config - Scheduled batch email configuration
     * @returns Promise with array of message IDs
     */
    scheduleBatchEmails(config: ScheduledBatchEmailConfig): Promise<EmailSendResponse>;
    /**
     * Get status of a scheduled email
     * @param identifier - Message ID or Batch ID
     * @returns Promise with email status
     */
    getScheduledEmailStatus(limit?: number, startDate?: string, endDate?: string, days?: number, email?: string, event?: "bounces" | "hardBounces" | "softBounces" | "delivered" | "spam" | "requests" | "opened" | "clicks" | "invalid" | "deferred" | "blocked" | "unsubscribed" | "error" | "loadedByProxy", messageId?: string, sort?: "asc" | "desc"): Promise<EmailStatusResponse>;
    /**
     * Delete a scheduled email
     * @param identifier - Message ID or Batch ID
     * @returns Promise<void>
     */
    deleteScheduledEmail(identifier: string): Promise<void>;
    /**
     * Get transactional email statistics
     * @param options - Statistics filter options
     * @returns Promise with email statistics
     */
    getEmailStatistics(options?: EmailStatisticsOptions): Promise<any>;
    /**
     * Add a domain to the list of blocked domains
     * @param domain - Domain to
     * @returns Promise with added domain
     */
    addDomain(domain: string): Promise<AddDomainResponse>;
    /**
     * Get list of domains
     * @returns Promise with domain list
     */
    getDomains(): Promise<DomainResponse>;
    /**
     * Delete a domain from the list of domains
     * @param domain - Domain to delete
     * @returns Promise with deleted domain
     */
    deleteDomain(domain: string): Promise<deleteDomainResponse>;
    /**
     * Get list of blocked domains
     * @returns Promise with blocked domains
     */
    getBlockedDomains(): Promise<any>;
    /**
     * Validate email data before sending
     * @param emailData - Email data to validate
     * @throws Error if validation fails
     */
    private validateEmailData;
    /**
     * Validate email address format
     * @param email - Email address to validate
     * @returns boolean
     */
    private isValidEmail;
    /**
     * Validate scheduled date format
     * @param scheduledAt - Date string to validate
     * @throws Error if date is invalid or in the past
     */
    private validateScheduledDate;
    /**
     * Create an email attachment from a file
     * @param content - Base64 encoded file content
     * @param name - File name with extension
     * @returns EmailAttachment object
     */
    static createAttachment(content: string, name: string): EmailAttachment;
    /**
     * Create an email attachment from a URL
     * @param url - URL of the file
     * @param name - Optional file name
     * @returns EmailAttachment object
     */
    static createAttachmentFromUrl(url: string, name?: string): EmailAttachment;
    /**
     * Generate ISO 8601 formatted date for scheduling
     * @param date - Date object or timestamp
     * @returns ISO formatted date string
     */
    static formatScheduledDate(date: Date | number): string;
    /**
     * Schedule email for a specific number of hours from now
     * @param hours - Number of hours from now
     * @returns ISO formatted date string
     */
    static scheduleInHours(hours: number): string;
    /**
     * Schedule email for a specific number of days from now
     * @param days - Number of days from now
     * @returns ISO formatted date string
     */
    static scheduleInDays(days: number): string;
}
export default BrevoEmailAdapter;
