import { z } from "zod";
export declare function getSchema(): {
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
export declare const sendEmailSchema: z.ZodObject<{
    to: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>;
    from: z.ZodString;
    subject: z.ZodString;
    html: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
    cc: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
    bcc: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
    replyTo: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>>;
    attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        filename: z.ZodString;
        content: z.ZodUnion<readonly [z.ZodString, z.ZodCustom<Buffer<ArrayBufferLike>, Buffer<ArrayBufferLike>>]>;
        contentType: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const bulkSendEmailSchema: z.ZodObject<{
    emails: z.ZodArray<z.ZodObject<{
        to: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>;
        from: z.ZodString;
        subject: z.ZodString;
        html: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
        cc: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
        bcc: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
        replyTo: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>>;
        attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            filename: z.ZodString;
            content: z.ZodUnion<readonly [z.ZodString, z.ZodCustom<Buffer<ArrayBufferLike>, Buffer<ArrayBufferLike>>]>;
            contentType: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const webhookEventSchema: z.ZodObject<{
    type: z.ZodEnum<{
        "email.sent": "email.sent";
        "email.delivered": "email.delivered";
        "email.delivery_delayed": "email.delivery_delayed";
        "email.complained": "email.complained";
        "email.bounced": "email.bounced";
        "email.opened": "email.opened";
        "email.clicked": "email.clicked";
        "email.failed": "email.failed";
    }>;
    created_at: z.ZodString;
    data: z.ZodObject<{
        id: z.ZodString;
        from: z.ZodString;
        to: z.ZodArray<z.ZodString>;
        subject: z.ZodString;
        created_at: z.ZodString;
        email_id: z.ZodOptional<z.ZodString>;
        bounce_type: z.ZodOptional<z.ZodString>;
        complaint_type: z.ZodOptional<z.ZodString>;
        click: z.ZodOptional<z.ZodObject<{
            ipAddress: z.ZodString;
            link: z.ZodString;
            timestamp: z.ZodString;
            userAgent: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
