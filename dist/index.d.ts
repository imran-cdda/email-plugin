import { z } from "zod";
import type { DatabaseEmailLog, EmailOptions, EmailStats, GetEmailLogsQuery } from "./types";
declare const EMAIL_ERROR_CODES: {
    readonly EMAIL_NOT_FOUND: "Email log not found";
    readonly INVALID_EMAIL_ADDRESS: "Invalid email address format";
    readonly SEND_FAILED: "Failed to send email";
    readonly ADAPTER_NOT_FOUND: "Email adapter not found";
    readonly WEBHOOK_VERIFICATION_FAILED: "Webhook signature verification failed";
    readonly INVALID_WEBHOOK_PAYLOAD: "Invalid webhook payload";
    readonly PROVIDER_ERROR: "Email provider error";
    readonly MISSING_CONTENT: "Email content is required (html or text)";
    readonly UNAUTHORIZED_ACCESS: "Unauthorized to access email logs";
    readonly BULK_SEND_FAILED: "Bulk email send operation failed";
};
export declare const email: <O extends EmailOptions>(options?: O) => {
    id: "email";
    endpoints: {
        /**
         * ### Endpoint
         *
         * POST `/email/send`
         *
         * ### API Methods
         *
         * **server:**
         * `auth.api.sendEmail`
         *
         * **client:**
         * `authClient.email.send`
         */
        sendEmail: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    to: {
                        email: string;
                        name?: string | undefined;
                    }[];
                    from: {
                        email: string;
                        name?: string | undefined;
                    };
                    subject: string;
                    replyTo: {
                        email: string;
                        name?: string | undefined;
                    };
                    html?: string | undefined;
                    text?: string | undefined;
                    cc?: {
                        email: string;
                        name?: string | undefined;
                    }[] | undefined;
                    bcc?: {
                        email: string;
                        name?: string | undefined;
                    }[] | undefined;
                    tags?: {
                        name: string;
                        value: string;
                    }[] | undefined;
                    attachments?: {
                        filename: string;
                        content: string | Buffer<ArrayBufferLike>;
                        url?: string | undefined;
                        contentType?: string | undefined;
                    }[] | undefined;
                    provider?: "resend" | "sendgrid" | "bravo" | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth/*").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    success: boolean;
                    emailId: string;
                    providerId: string | undefined;
                    message: string;
                };
            } : {
                success: boolean;
                emailId: string;
                providerId: string | undefined;
                message: string;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    to: z.ZodArray<z.ZodObject<{
                        email: z.ZodEmail;
                        name: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>;
                    from: z.ZodObject<{
                        email: z.ZodEmail;
                        name: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>;
                    subject: z.ZodString;
                    html: z.ZodOptional<z.ZodString>;
                    text: z.ZodOptional<z.ZodString>;
                    cc: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        email: z.ZodEmail;
                        name: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>>;
                    bcc: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        email: z.ZodEmail;
                        name: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>>;
                    replyTo: z.ZodObject<{
                        email: z.ZodEmail;
                        name: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>;
                    tags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        name: z.ZodString;
                        value: z.ZodString;
                    }, z.core.$strip>>>;
                    attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        url: z.ZodOptional<z.ZodString>;
                        filename: z.ZodString;
                        content: z.ZodUnion<readonly [z.ZodString, z.ZodCustom<Buffer<ArrayBufferLike>, Buffer<ArrayBufferLike>>]>;
                        contentType: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>>;
                    provider: z.ZodOptional<z.ZodEnum<{
                        resend: "resend";
                        sendgrid: "sendgrid";
                        bravo: "bravo";
                    }>>;
                }, z.core.$strip>;
                use: ((inputContext: import("better-auth/*").MiddlewareInputContext<import("better-auth/*").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
            } & {
                use: any[];
            };
            path: "/email/send";
        };
        /**
         * ### Endpoint
         *
         * POST `/email/send-bulk`
         *
         * ### API Methods
         *
         * **server:**
         * `auth.api.sendBulkEmails`
         *
         * **client:**
         * `authClient.email.sendBulk`
         */
        sendBulkEmails: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    emails: {
                        to: string | string[];
                        subject: string;
                        replyTo: {
                            email: string;
                            name?: string | undefined;
                        };
                        from?: string | undefined;
                        html?: string | undefined;
                        text?: string | undefined;
                        cc?: {
                            email: string;
                            name?: string | undefined;
                        }[] | undefined;
                        bcc?: {
                            email: string;
                            name?: string | undefined;
                        }[] | undefined;
                        tags?: {
                            name: string;
                            value: string;
                        }[] | undefined;
                    }[];
                    provider?: "resend" | "sendgrid" | "bravo" | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth/*").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    emailLogs: string[];
                    message: string;
                    total: number;
                    successful: number;
                    failed: number;
                    results: import("./types").SendEmailResponse[];
                    success: boolean;
                };
            } : {
                emailLogs: string[];
                message: string;
                total: number;
                successful: number;
                failed: number;
                results: import("./types").SendEmailResponse[];
                success: boolean;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    emails: z.ZodArray<z.ZodObject<{
                        to: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>;
                        from: z.ZodOptional<z.ZodString>;
                        subject: z.ZodString;
                        html: z.ZodOptional<z.ZodString>;
                        text: z.ZodOptional<z.ZodString>;
                        cc: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            email: z.ZodEmail;
                            name: z.ZodOptional<z.ZodString>;
                        }, z.core.$strip>>>;
                        bcc: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            email: z.ZodEmail;
                            name: z.ZodOptional<z.ZodString>;
                        }, z.core.$strip>>>;
                        replyTo: z.ZodObject<{
                            email: z.ZodEmail;
                            name: z.ZodOptional<z.ZodString>;
                        }, z.core.$strip>;
                        tags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            name: z.ZodString;
                            value: z.ZodString;
                        }, z.core.$strip>>>;
                    }, z.core.$strip>>;
                    provider: z.ZodOptional<z.ZodEnum<{
                        resend: "resend";
                        sendgrid: "sendgrid";
                        bravo: "bravo";
                    }>>;
                }, z.core.$strip>;
                use: ((inputContext: import("better-auth/*").MiddlewareInputContext<import("better-auth/*").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
            } & {
                use: any[];
            };
            path: "/email/send-bulk";
        };
        /**
         * ### Endpoint
         *
         * GET `/email/logs`
         *
         * ### API Methods
         *
         * **server:**
         * `auth.api.getEmailLogs`
         *
         * **client:**
         * `authClient.email.logs`
         */
        getEmailLogs: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query?: {
                    userId?: string | undefined;
                    status?: "pending" | "sent" | "delivered" | "opened" | "clicked" | "bounced" | "complained" | "failed" | "delivery_delayed" | undefined;
                    provider?: "resend" | "sendgrid" | "brevo" | undefined;
                    limit?: string | undefined;
                    offset?: string | undefined;
                } | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth/*").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }) | undefined): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    success: boolean;
                    emailLogs: DatabaseEmailLog[];
                    count: number;
                    query: GetEmailLogsQuery;
                };
            } : {
                success: boolean;
                emailLogs: DatabaseEmailLog[];
                count: number;
                query: GetEmailLogsQuery;
            }>;
            options: {
                method: "GET";
                query: z.ZodOptional<z.ZodObject<{
                    userId: z.ZodOptional<z.ZodString>;
                    status: z.ZodOptional<z.ZodEnum<{
                        pending: "pending";
                        sent: "sent";
                        delivered: "delivered";
                        opened: "opened";
                        clicked: "clicked";
                        bounced: "bounced";
                        complained: "complained";
                        failed: "failed";
                        delivery_delayed: "delivery_delayed";
                    }>>;
                    provider: z.ZodOptional<z.ZodEnum<{
                        resend: "resend";
                        sendgrid: "sendgrid";
                        brevo: "brevo";
                    }>>;
                    limit: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
                    offset: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
                }, z.core.$strip>>;
                use: ((inputContext: import("better-auth/*").MiddlewareInputContext<import("better-auth/*").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
            } & {
                use: any[];
            };
            path: "/email/logs";
        };
        /**
         * ### Endpoint
         *
         * GET `/email/stats`
         *
         * ### API Methods
         *
         * **server:**
         * `auth.api.getEmailStats`
         *
         * **client:**
         * `authClient.email.stats`
         */
        getEmailStats: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query?: {
                    userId?: string | undefined;
                    provider?: "resend" | "sendgrid" | "bravo" | undefined;
                } | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth/*").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }) | undefined): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    success: boolean;
                    stats: EmailStats;
                    userId: string;
                };
            } : {
                success: boolean;
                stats: EmailStats;
                userId: string;
            }>;
            options: {
                method: "GET";
                query: z.ZodOptional<z.ZodObject<{
                    userId: z.ZodOptional<z.ZodString>;
                    provider: z.ZodOptional<z.ZodEnum<{
                        resend: "resend";
                        sendgrid: "sendgrid";
                        bravo: "bravo";
                    }>>;
                }, z.core.$strip>>;
                use: ((inputContext: import("better-auth/*").MiddlewareInputContext<import("better-auth/*").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
            } & {
                use: any[];
            };
            path: "/email/stats";
        };
        /**
         * ### Endpoint
         *
         * POST `/email/webhook`
         *
         * ### API Methods
         *
         * **server:**
         * `auth.api.handleEmailWebhook`
         *
         * Handles webhooks from email providers to update email status
         */
        /**
         * ### Endpoint
         *
         * POST `/email/send-system`
         *
         * ### API Methods
         *
         * **server:**
         * `auth.api.sendSystemEmail`
         *
         * System-level email sending (no authentication required)
         * Used by auth flows like verification, welcome, reset emails
         */
        sendSystemEmail: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    to: {
                        email: string;
                        name?: string | undefined;
                    }[];
                    subject: string;
                    replyTo: {
                        email: string;
                        name?: string | undefined;
                    };
                    from?: string | undefined;
                    html?: string | undefined;
                    text?: string | undefined;
                    cc?: {
                        email: string;
                        name?: string | undefined;
                    }[] | undefined;
                    bcc?: {
                        email: string;
                        name?: string | undefined;
                    }[] | undefined;
                    tags?: {
                        name: string;
                        value: string;
                    }[] | undefined;
                    provider?: "resend" | "sendgrid" | "bravo" | undefined;
                    systemUsage?: string | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth/*").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    success: boolean;
                    emailId: string;
                    providerId: string | undefined;
                    message: string;
                };
            } : {
                success: boolean;
                emailId: string;
                providerId: string | undefined;
                message: string;
            }>;
            options: {
                method: "POST";
                body: z.ZodObject<{
                    to: z.ZodArray<z.ZodObject<{
                        email: z.ZodEmail;
                        name: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>;
                    from: z.ZodOptional<z.ZodString>;
                    subject: z.ZodString;
                    html: z.ZodOptional<z.ZodString>;
                    text: z.ZodOptional<z.ZodString>;
                    cc: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        email: z.ZodEmail;
                        name: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>>;
                    bcc: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        email: z.ZodEmail;
                        name: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>>;
                    replyTo: z.ZodObject<{
                        email: z.ZodEmail;
                        name: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>;
                    tags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        name: z.ZodString;
                        value: z.ZodString;
                    }, z.core.$strip>>>;
                    provider: z.ZodOptional<z.ZodEnum<{
                        resend: "resend";
                        sendgrid: "sendgrid";
                        bravo: "bravo";
                    }>>;
                    systemUsage: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>;
            } & {
                use: any[];
            };
            path: "/email/send-system";
        };
        handleEmailWebhook: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                body?: undefined;
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth/*").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }) | undefined): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    success: boolean;
                    message: string;
                    messageId: string;
                    status: string;
                    emailId?: undefined;
                    updated?: undefined;
                } | {
                    success: boolean;
                    message: string;
                    emailId: string;
                    messageId: string | undefined;
                    status: import("./types").EmailStatus | undefined;
                    updated: boolean;
                };
            } : {
                success: boolean;
                message: string;
                messageId: string;
                status: string;
                emailId?: undefined;
                updated?: undefined;
            } | {
                success: boolean;
                message: string;
                emailId: string;
                messageId: string | undefined;
                status: import("./types").EmailStatus | undefined;
                updated: boolean;
            }>;
            options: {
                method: "POST";
                metadata: {
                    isAction: boolean;
                };
                cloneRequest: true;
                disableBody: true;
            } & {
                use: any[];
            };
            path: "/email/webhook";
        };
    };
    schema: {
        readonly emailLog: {
            readonly fields: {
                readonly id: {
                    readonly type: "string";
                    readonly required: true;
                };
                readonly resendId: {
                    readonly type: "string";
                    readonly required: false;
                };
                readonly fromAddress: {
                    readonly type: "string";
                    readonly required: true;
                };
                readonly toAddress: {
                    readonly type: "string";
                    readonly required: true;
                };
                readonly ccAddress: {
                    readonly type: "string";
                    readonly required: false;
                };
                readonly bccAddress: {
                    readonly type: "string";
                    readonly required: false;
                };
                readonly replyToAddress: {
                    readonly type: "string";
                    readonly required: false;
                };
                readonly subject: {
                    readonly type: "string";
                    readonly required: true;
                };
                readonly content: {
                    readonly type: "string";
                    readonly required: true;
                };
                readonly contentType: {
                    readonly type: "string";
                    readonly required: true;
                };
                readonly status: {
                    readonly type: "string";
                    readonly required: true;
                };
                readonly providerId: {
                    readonly type: "string";
                    readonly required: false;
                };
                readonly provider: {
                    readonly type: "string";
                    readonly required: true;
                };
                readonly errorMessage: {
                    readonly type: "string";
                    readonly required: false;
                };
                readonly sentAt: {
                    readonly type: "date";
                    readonly required: false;
                };
                readonly deliveredAt: {
                    readonly type: "date";
                    readonly required: false;
                };
                readonly openedAt: {
                    readonly type: "date";
                    readonly required: false;
                };
                readonly clickedAt: {
                    readonly type: "date";
                    readonly required: false;
                };
                readonly bouncedAt: {
                    readonly type: "date";
                    readonly required: false;
                };
                readonly complainedAt: {
                    readonly type: "date";
                    readonly required: false;
                };
                readonly failedAt: {
                    readonly type: "date";
                    readonly required: false;
                };
                readonly metadata: {
                    readonly type: "string";
                    readonly required: false;
                };
                readonly tags: {
                    readonly type: "string";
                    readonly required: false;
                };
                readonly userId: {
                    readonly type: "string";
                    readonly required: false;
                };
                readonly createdAt: {
                    readonly type: "date";
                    readonly required: true;
                };
                readonly updatedAt: {
                    readonly type: "date";
                    readonly required: true;
                };
            };
        };
    };
};
/**
 * Server-side email service for system use
 * Can be used by auth flows and other server-side code
 */
export declare class EmailService {
    private static instance;
    private baseUrl;
    private constructor();
    static getInstance(baseUrl?: string): EmailService;
    sendSystemEmail(emailData: {
        to: string | string[];
        from?: string;
        subject: string;
        html?: string;
        text?: string;
        cc?: string | string[];
        bcc?: string | string[];
        replyTo?: string;
        systemUsage?: string;
    }): Promise<any>;
    sendEmail(emailData: {
        to: {
            email: string;
            name?: string;
        }[];
        from?: {
            email: string;
            name?: string;
        };
        subject: string;
        html?: string;
        text?: string;
        cc?: {
            email: string;
            name?: string;
        }[];
        bcc?: {
            email: string;
            name?: string;
        }[];
        replyTo?: {
            email: string;
            name?: string;
        };
        systemUsage?: string;
    }): Promise<any>;
    sendVerificationEmail(user: {
        email: string;
        name?: string;
    }, verificationUrl: string): Promise<any>;
    sendWelcomeEmail(user: {
        email: string;
        name?: string;
    }): Promise<any>;
    sendPasswordResetEmail(user: {
        email: string;
        name?: string;
    }, resetUrl: string): Promise<any>;
}
export * from "./types";
export * from "./utils";
export { EMAIL_ERROR_CODES };
