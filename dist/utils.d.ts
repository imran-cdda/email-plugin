import type { EmailContentType, EmailLog, EmailStatus, ResendWebhookPayload, WebhookEvent } from "./types";
/**
 * Generate a unique ID for email logs
 */
export declare function generateEmailId(): string;
/**
 * Validate email address format
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Validate email addresses in an array
 */
export declare function validateEmailArray(emails: string | string[]): string[];
/**
 * Determine content type based on provided content
 */
export declare function determineContentType(html?: string, text?: string): EmailContentType;
/**
 * Convert arrays to comma-separated strings for database storage
 */
export declare function arrayToString(arr?: string[]): string | undefined;
/**
 * Convert comma-separated strings to arrays
 */
export declare function stringToArray(str?: string): string[] | undefined;
/**
 * Convert webhook event to email log status
 */
export declare function webhookEventToStatus(eventType: string): EmailStatus;
/**
 * Extract timestamp from webhook event
 */
export declare function extractEventTimestamp(event: WebhookEvent): Date;
/**
 * Verify webhook signature using Svix library (used by Resend)
 */
export declare function verifyWebhookSignature(payload: string, headers: Record<string, string | null>, secret: string): boolean;
/**
 * Parse Resend webhook payload
 */
export declare function parseResendWebhook(payload: ResendWebhookPayload): Partial<EmailLog>;
/**
 * Sanitize email content for database storage
 */
export declare function sanitizeEmailContent(content: string): string;
/**
 * Calculate email statistics
 */
export declare function calculateEmailStats(emailLogs: EmailLog[]): {
    total: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    complained: number;
    failed: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
};
