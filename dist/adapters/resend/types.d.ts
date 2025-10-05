import type { Session, User } from "better-auth";
import type { z } from "zod";
import { bulkSendEmailSchema, sendEmailSchema, webhookEventSchema } from "./schema";
export interface BetterAuthAdapter {
    findOne<T = DatabaseEmailLog>(options: {
        model: string;
        where: Array<{
            field: string;
            value: string | number | boolean;
            operator?: string;
        }>;
    }): Promise<T | null>;
    findMany<T = DatabaseEmailLog>(options: {
        model: string;
        where?: Array<{
            field: string;
            value: string | number | boolean;
        }>;
        limit?: number;
        offset?: number;
        sortBy?: {
            field: string;
            direction: "asc" | "desc";
        };
    }): Promise<T[]>;
    create<T = DatabaseEmailLog>(options: {
        model: string;
        data: Partial<T>;
    }): Promise<T>;
    update<T = DatabaseEmailLog>(options: {
        model: string;
        where: Array<{
            field: string;
            value: string | number | boolean;
        }>;
        update: Partial<T>;
    }): Promise<T | null>;
    delete(options: {
        model: string;
        where: Array<{
            field: string;
            value: string | number | boolean;
        }>;
    }): Promise<void>;
}
export type EmailStatus = "pending" | "sent" | "delivered" | "opened" | "clicked" | "bounced" | "complained" | "failed" | "delivery_delayed";
export type EmailContentType = "html" | "text" | "mixed";
export type EmailProvider = "resend" | "sendgrid" | "bravo";
export interface EmailLog {
    id: string;
    resendId?: string;
    fromAddress: string;
    toAddress: string;
    ccAddress?: string;
    bccAddress?: string;
    replyToAddress?: string;
    subject: string;
    content: string;
    contentType: EmailContentType;
    status: EmailStatus;
    providerId?: string;
    provider: EmailProvider;
    errorMessage?: string;
    sentAt?: Date;
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    bouncedAt?: Date;
    complainedAt?: Date;
    failedAt?: Date;
    metadata?: string;
    tags?: string;
    userId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface DatabaseEmailLog {
    id: string;
    resendId?: string;
    fromAddress: string;
    toAddress: string;
    ccAddress?: string;
    bccAddress?: string;
    replyToAddress?: string;
    subject: string;
    content: string;
    contentType: string;
    status: string;
    providerId?: string;
    provider: string;
    errorMessage?: string;
    sentAt?: Date;
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    bouncedAt?: Date;
    complainedAt?: Date;
    failedAt?: Date;
    metadata?: string;
    tags?: string;
    userId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface InputEmailLog {
    resendId?: string;
    fromAddress: string;
    toAddress: string;
    ccAddress?: string;
    bccAddress?: string;
    replyToAddress?: string;
    subject: string;
    content: string;
    contentType: EmailContentType;
    status: EmailStatus;
    providerId?: string;
    provider: EmailProvider;
    errorMessage?: string;
    sentAt?: Date;
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    bouncedAt?: Date;
    complainedAt?: Date;
    failedAt?: Date;
    metadata?: string;
    tags?: string;
    userId?: string;
}
export interface EmailAdapter {
    name: EmailProvider;
    sendEmail(email: SendEmailRequest): Promise<SendEmailResponse>;
    sendBulkEmails(emails: SendEmailRequest[]): Promise<SendEmailResponse[]>;
}
export type SendEmailRequest = z.infer<typeof sendEmailSchema>;
export type BulkSendEmailRequest = z.infer<typeof bulkSendEmailSchema>;
export type WebhookEvent = z.infer<typeof webhookEventSchema>;
export interface SendEmailResponse {
    success: boolean;
    id?: string;
    providerId?: string;
    error?: string;
}
export interface EmailAttachment {
    filename: string;
    content: string | Buffer;
    contentType?: string;
}
export interface EmailTag {
    name: string;
    value: string;
}
export interface EmailOptions {
    defaultProvider?: EmailProvider;
    enableWebhooks?: boolean;
    webhookSecret?: string;
    adapters?: EmailAdapter[];
    fromAddress?: string;
    replyToAddress?: string;
    trackOpens?: boolean;
    trackClicks?: boolean;
}
export interface UserWithEmail extends User {
    emailLogs?: EmailLog[];
}
export interface SessionWithEmail extends Session {
    user: UserWithEmail;
}
export interface ResendWebhookPayload {
    type: string;
    created_at: string;
    data: {
        id?: string;
        email_id?: string;
        from: string;
        to: string[];
        subject: string;
        created_at: string;
        bounce_type?: string;
        complaint_type?: string;
        click?: {
            ipAddress: string;
            link: string;
            timestamp: string;
            userAgent: string;
        };
    };
}
export interface BulkEmailResult {
    total: number;
    successful: number;
    failed: number;
    results: SendEmailResponse[];
}
export interface GetEmailLogsQuery {
    userId?: string;
    status?: EmailStatus;
    provider?: EmailProvider;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
    offset?: number;
}
export interface EmailStats {
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
}
