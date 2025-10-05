import { ScheduledEmailConfig, ScheduledBatchEmailConfig, EmailSendResponse, EmailContact, EmailAttachment, EmailStatisticsOptions, EmailStatistics, CancelScheduledEmailResponse, SuppressionGroup, BlockedEmail, BouncedEmail, SpamReport, InvalidEmail } from "./types";
import { SendEmailRequest, SendEmailResponse } from "../types";
import { baseAdapter } from "../base";
/**
 * Comprehensive SendGrid Email Adapter with full type safety
 * Supports all SendGrid transactional email features
 */
export declare class SendGridEmailAdapter extends baseAdapter {
    private mailService;
    private defaultSender?;
    private apiKey;
    /**
     * Initialize SendGrid Email Adapter
     * @param apiKey - Your SendGrid API key (optional if set in env)
     * @param defaultSender - Optional default sender for all emails
     */
    constructor(apiKey?: string, defaultSender?: EmailContact);
    /**
     * Send a simple transactional email with HTML/text content
     * @param config - Email configuration
     * @returns Promise with response details
     */
    sendEmail(email: SendEmailRequest): Promise<SendEmailResponse>;
    sendBulkEmails(emails: SendEmailRequest[]): Promise<SendEmailResponse[]>;
    /**
     * Schedule an email to be sent at a specific time
     * @param config - Scheduled email configuration
     * @returns Promise with response details
     */
    scheduleEmail(config: ScheduledEmailConfig): Promise<EmailSendResponse>;
    /**
     * Schedule batch emails to be sent at a specific time
     * @param config - Scheduled batch email configuration
     * @returns Promise with response details
     */
    scheduleBatchEmails(config: ScheduledBatchEmailConfig): Promise<EmailSendResponse>;
    /**
     * Cancel a scheduled send for a specific batch ID
     * @param batchId - The batch ID of the scheduled send
     * @returns Promise with cancellation status
     */
    cancelScheduledSend(batchId: string): Promise<CancelScheduledEmailResponse>;
    /**
     * Update a scheduled send time
     * @param batchId - The batch ID of the scheduled send
     * @param sendAt - New send time (Unix timestamp)
     * @returns Promise with update status
     */
    updateScheduledSend(batchId: string, sendAt: number): Promise<CancelScheduledEmailResponse>;
    /**
     * Get all scheduled sends
     * @returns Promise with list of scheduled sends
     */
    getScheduledSends(): Promise<any>;
    /**
     * Get email statistics
     * @param options - Statistics filter options
     * @returns Promise with email statistics
     */
    getEmailStatistics(options?: EmailStatisticsOptions): Promise<EmailStatistics[]>;
    /**
     * Get category-specific statistics
     * @param categories - Array of category names
     * @param options - Statistics filter options
     * @returns Promise with category statistics
     */
    getCategoryStatistics(categories: string[], options?: EmailStatisticsOptions): Promise<EmailStatistics[]>;
    /**
     * Get all suppression groups
     * @returns Promise with list of suppression groups
     */
    getSuppressionGroups(): Promise<SuppressionGroup[]>;
    /**
     * Get blocked emails
     * @param startTime - Optional start time (Unix timestamp)
     * @param endTime - Optional end time (Unix timestamp)
     * @param limit - Optional limit
     * @param offset - Optional offset
     * @returns Promise with list of blocked emails
     */
    getBlockedEmails(startTime?: number, endTime?: number, limit?: number, offset?: number): Promise<BlockedEmail[]>;
    /**
     * Delete a blocked email
     * @param email - Email address to unblock
     * @returns Promise<void>
     */
    deleteBlockedEmail(email: string): Promise<void>;
    /**
     * Get bounced emails
     * @param startTime - Optional start time (Unix timestamp)
     * @param endTime - Optional end time (Unix timestamp)
     * @returns Promise with list of bounced emails
     */
    getBouncedEmails(startTime?: number, endTime?: number): Promise<BouncedEmail[]>;
    /**
     * Get spam reports
     * @param startTime - Optional start time (Unix timestamp)
     * @param endTime - Optional end time (Unix timestamp)
     * @returns Promise with list of spam reports
     */
    getSpamReports(startTime?: number, endTime?: number): Promise<SpamReport[]>;
    /**
     * Get invalid emails
     * @param startTime - Optional start time (Unix timestamp)
     * @param endTime - Optional end time (Unix timestamp)
     * @returns Promise with list of invalid emails
     */
    getInvalidEmails(startTime?: number, endTime?: number): Promise<InvalidEmail[]>;
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
     * Validate scheduled time
     * @param sendAt - Unix timestamp to validate
     * @throws Error if time is invalid or in the past
     */
    private validateScheduledTime;
    /**
     * Create an email attachment from base64 content
     * @param content - Base64 encoded file content
     * @param filename - File name with extension
     * @param type - MIME type
     * @param disposition - Attachment or inline
     * @returns EmailAttachment object
     */
    static createAttachment(content: string, filename: string, type?: string, disposition?: "attachment" | "inline"): EmailAttachment;
    /**
     * Create an inline image attachment
     * @param content - Base64 encoded image content
     * @param filename - File name
     * @param contentId - Content ID for referencing in HTML
     * @param type - MIME type
     * @returns EmailAttachment object
     */
    static createInlineImage(content: string, filename: string, contentId: string, type?: string): EmailAttachment;
    /**
     * Generate Unix timestamp for scheduling
     * @param date - Date object or timestamp
     * @returns Unix timestamp
     */
    static getUnixTimestamp(date: Date | number): number;
    /**
     * Schedule email for a specific number of hours from now
     * @param hours - Number of hours from now
     * @returns Unix timestamp
     */
    static scheduleInHours(hours: number): number;
    /**
     * Schedule email for a specific number of days from now
     * @param days - Number of days from now
     * @returns Unix timestamp
     */
    static scheduleInDays(days: number): number;
    /**
     * Generate a unique batch ID
     * @returns Batch ID string
     */
    static generateBatchId(): string;
}
export default SendGridEmailAdapter;
