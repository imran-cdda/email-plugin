import { z } from "zod";
export function getSchema() {
    return {
        emailLog: {
            fields: {
                id: {
                    type: "string",
                    required: true,
                },
                resendId: {
                    type: "string",
                    required: false,
                },
                fromAddress: {
                    type: "string",
                    required: true,
                },
                toAddress: {
                    type: "string",
                    required: true,
                },
                ccAddress: {
                    type: "string",
                    required: false,
                },
                bccAddress: {
                    type: "string",
                    required: false,
                },
                replyToAddress: {
                    type: "string",
                    required: false,
                },
                subject: {
                    type: "string",
                    required: true,
                },
                content: {
                    type: "string",
                    required: true,
                },
                contentType: {
                    type: "string",
                    required: true,
                },
                status: {
                    type: "string",
                    required: true,
                },
                providerId: {
                    type: "string",
                    required: false,
                },
                provider: {
                    type: "string",
                    required: true,
                },
                errorMessage: {
                    type: "string",
                    required: false,
                },
                sentAt: {
                    type: "date",
                    required: false,
                },
                deliveredAt: {
                    type: "date",
                    required: false,
                },
                openedAt: {
                    type: "date",
                    required: false,
                },
                clickedAt: {
                    type: "date",
                    required: false,
                },
                bouncedAt: {
                    type: "date",
                    required: false,
                },
                complainedAt: {
                    type: "date",
                    required: false,
                },
                failedAt: {
                    type: "date",
                    required: false,
                },
                metadata: {
                    type: "string",
                    required: false,
                },
                tags: {
                    type: "string",
                    required: false,
                },
                userId: {
                    type: "string",
                    required: false,
                },
                createdAt: {
                    type: "date",
                    required: true,
                },
                updatedAt: {
                    type: "date",
                    required: true,
                },
            },
        },
    };
}
// Validation schemas
export const sendEmailSchema = z.object({
    to: z.union([z.string().email(), z.array(z.string().email())]),
    from: z.string().email(),
    subject: z.string().min(1),
    html: z.string().optional(),
    text: z.string().optional(),
    cc: z.union([z.string().email(), z.array(z.string().email())]).optional(),
    bcc: z.union([z.string().email(), z.array(z.string().email())]).optional(),
    replyTo: z.string().email().optional(),
    tags: z
        .array(z.object({
        name: z.string(),
        value: z.string(),
    }))
        .optional(),
    attachments: z
        .array(z.object({
        filename: z.string(),
        content: z.union([z.string(), z.instanceof(Buffer)]),
        contentType: z.string().optional(),
    }))
        .optional(),
});
export const bulkSendEmailSchema = z.object({
    emails: z.array(sendEmailSchema),
});
export const webhookEventSchema = z.object({
    type: z.enum([
        "email.sent",
        "email.delivered",
        "email.delivery_delayed",
        "email.complained",
        "email.bounced",
        "email.opened",
        "email.clicked",
        "email.failed",
    ]),
    created_at: z.string(),
    data: z.object({
        id: z.string(),
        from: z.string(),
        to: z.array(z.string()),
        subject: z.string(),
        created_at: z.string(),
        email_id: z.string().optional(),
        bounce_type: z.string().optional(),
        complaint_type: z.string().optional(),
        click: z
            .object({
            ipAddress: z.string(),
            link: z.string(),
            timestamp: z.string(),
            userAgent: z.string(),
        })
            .optional(),
    }),
});
