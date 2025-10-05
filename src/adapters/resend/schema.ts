import { z } from "zod";

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
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  attachments: z
    .array(
      z.object({
        filename: z.string(),
        content: z.union([z.string(), z.instanceof(Buffer)]),
        contentType: z.string().optional(),
      })
    )
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
