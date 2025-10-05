import sgMail from "@sendgrid/mail";
import sgClient from "@sendgrid/client";
/**
 * Comprehensive SendGrid Email Adapter with full type safety
 * Supports all SendGrid transactional email features
 */
export class SendGridEmailAdapter {
    /**
     * Initialize SendGrid Email Adapter
     * @param apiKey - Your SendGrid API key (optional if set in env)
     * @param defaultSender - Optional default sender for all emails
     */
    constructor(apiKey, defaultSender) {
        this.apiKey = apiKey || process.env.SENDGRID_API_KEY || "";
        if (!this.apiKey) {
            throw new Error("SendGrid API key is required");
        }
        this.mailService = sgMail;
        this.mailService.setApiKey(this.apiKey);
        sgClient.setApiKey(this.apiKey);
        this.defaultSender = defaultSender;
    }
    // ==========================================================================
    // SIMPLE EMAIL SENDING
    // ==========================================================================
    /**
     * Send a simple transactional email with HTML/text content
     * @param config - Email configuration
     * @returns Promise with response details
     */
    async sendEmail(config) {
        const emailData = {
            from: config.sender || this.defaultSender,
            to: config.to,
            cc: config.cc,
            bcc: config.bcc,
            subject: config.subject,
            content: [
                {
                    type: "text/html",
                    value: config.htmlContent || "",
                },
            ],
            attachments: config.attachments?.map((a) => ({
                ...a,
                content: a.content ?? "",
            })),
            headers: config.headers,
            categories: config.categories,
            customArgs: config.customArgs,
            sendAt: config.sendAt,
            batchId: config.batchId,
            asm: config.asm,
            ipPoolName: config.ipPoolName,
        };
        this.validateEmailData(emailData);
        const [response] = await this.mailService.send(emailData);
        return {
            statusCode: response.statusCode,
            headers: response.headers,
            body: response.body,
        };
    }
    /**
     * Send a quick email with minimal configuration
     * @param to - Recipient email address
     * @param subject - Email subject
     * @param htmlContent - HTML content
     * @param textContent - Optional plain text content
     * @returns Promise with response details
     */
    async sendQuickEmail(to, subject, htmlContent, textContent) {
        if (!this.defaultSender) {
            throw new Error("Default sender must be configured to use sendQuickEmail");
        }
        return this.sendEmail({
            sender: this.defaultSender,
            to: [{ email: to }],
            subject,
            htmlContent,
            textContent,
        });
    }
    /**
     * Send email using a dynamic template
     * @param to - Recipient(s)
     * @param templateId - SendGrid template ID
     * @param dynamicTemplateData - Template variables
     * @param sender - Optional sender (uses default if not provided)
     * @returns Promise with response details
     */
    async sendTemplateEmail(to, templateId, dynamicTemplateData, sender) {
        const emailData = {
            from: sender || this.defaultSender,
            to,
            templateId,
            dynamicTemplateData,
        };
        this.validateEmailData(emailData);
        const [response] = await this.mailService.send(emailData);
        return {
            statusCode: response.statusCode,
            headers: response.headers,
            body: response.body,
        };
    }
    // ==========================================================================
    // BATCH EMAIL SENDING
    // ==========================================================================
    /**
     * Send batch emails with multiple personalizations
     * @param config - Batch email configuration
     * @returns Promise with response details
     */
    async sendBatchEmails(config) {
        if (config.personalizations.length > 1000) {
            throw new Error("Maximum 1000 personalizations allowed per batch");
        }
        const emailData = {
            from: config.sender || this.defaultSender,
            subject: config.subject || "",
            content: [
                { type: "text/plain", value: config.textContent || "" },
                { type: "text/html", value: config.htmlContent || "" },
            ],
            replyTo: config.replyTo,
            attachments: config.attachments?.map((a) => ({
                ...a,
                content: a.content ?? "",
            })),
            headers: config.headers,
            categories: config.categories,
            customArgs: config.customArgs,
            batchId: config.batchId,
            asm: config.asm,
            ipPoolName: config.ipPoolName,
        };
        this.validateEmailData(emailData);
        const [response] = await this.mailService.send(emailData);
        return {
            statusCode: response.statusCode,
            headers: response.headers,
            body: response.body,
        };
    }
    /**
     * Send multiple individual emails
     * @param emails - Array of email configurations
     * @returns Promise with array of responses
     */
    async sendMultipleEmails(emails) {
        const emailDataArray = emails.map((config) => ({
            from: config.sender || this.defaultSender,
            to: config.to,
            cc: config.cc,
            bcc: config.bcc,
            subject: config.subject || "",
            content: [
                { type: "text/plain", value: config.textContent || "" },
                { type: "text/html", value: config.htmlContent || "" },
            ],
            replyTo: config.replyTo,
            attachments: config.attachments?.map((a) => ({
                ...a,
                content: a.content ?? "",
            })),
            headers: config.headers,
            categories: config.categories,
            customArgs: config.customArgs,
            sendAt: config.sendAt,
            batchId: config.batchId,
            asm: config.asm,
            ipPoolName: config.ipPoolName,
        }));
        emailDataArray.forEach((emailData) => this.validateEmailData(emailData));
        const [clientResponse] = await this.mailService.send(emailDataArray);
        const responses = [
            {
                statusCode: clientResponse.statusCode,
                headers: clientResponse.headers,
                body: clientResponse.body,
            },
        ];
        return responses;
    }
    // ==========================================================================
    // SCHEDULED EMAIL SENDING
    // ==========================================================================
    /**
     * Schedule an email to be sent at a specific time
     * @param config - Scheduled email configuration
     * @returns Promise with response details
     */
    async scheduleEmail(config) {
        this.validateScheduledTime(config.sendAt);
        const emailData = {
            from: config.sender || this.defaultSender,
            to: config.to,
            cc: config.cc,
            bcc: config.bcc,
            subject: config.subject,
            html: config.htmlContent,
            text: config.textContent,
            sendAt: config.sendAt,
            replyTo: config.replyTo,
            attachments: config.attachments,
            content: [
                {
                    type: "text/html",
                    value: config.htmlContent || "",
                },
                {
                    type: "text/plain",
                    value: config.textContent || "",
                },
            ],
        };
        this.validateEmailData(emailData);
        const [response] = await this.mailService.send(emailData);
        return {
            statusCode: response.statusCode,
            headers: response.headers,
            body: response.body,
        };
    }
    /**
     * Schedule batch emails to be sent at a specific time
     * @param config - Scheduled batch email configuration
     * @returns Promise with response details
     */
    async scheduleBatchEmails(config) {
        this.validateScheduledTime(config.sendAt);
        if (config.personalizations.length > 1000) {
            throw new Error("Maximum 1000 personalizations allowed per batch");
        }
        const emailData = {
            from: config.sender || this.defaultSender,
            subject: config.subject,
            html: config.htmlContent,
            text: config.textContent,
            sendAt: config.sendAt,
            replyTo: config.replyTo,
            attachments: config.attachments,
            content: [
                {
                    type: "text/html",
                    value: config.htmlContent || "",
                },
                {
                    type: "text/plain",
                    value: config.textContent || "",
                },
            ],
        };
        this.validateEmailData(emailData);
        const [response] = await this.mailService.send(emailData);
        return {
            statusCode: response.statusCode,
            headers: response.headers,
            body: response.body,
        };
    }
    // ==========================================================================
    // SCHEDULED EMAIL MANAGEMENT
    // ==========================================================================
    /**
     * Cancel a scheduled send for a specific batch ID
     * @param batchId - The batch ID of the scheduled send
     * @returns Promise with cancellation status
     */
    async cancelScheduledSend(batchId) {
        try {
            const request = {
                url: `/v3/user/scheduled_sends/${batchId}`,
                method: "DELETE",
            };
            await sgClient.request(request);
            return {
                success: true,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    /**
     * Update a scheduled send time
     * @param batchId - The batch ID of the scheduled send
     * @param sendAt - New send time (Unix timestamp)
     * @returns Promise with update status
     */
    async updateScheduledSend(batchId, sendAt) {
        this.validateScheduledTime(sendAt);
        try {
            const request = {
                url: `/v3/user/scheduled_sends/${batchId}`,
                method: "PATCH",
                body: {
                    status: "pause",
                },
            };
            await sgClient.request(request);
            return {
                success: true,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    /**
     * Get all scheduled sends
     * @returns Promise with list of scheduled sends
     */
    async getScheduledSends() {
        const request = {
            url: `/v3/user/scheduled_sends`,
            method: "GET",
        };
        const [response] = await sgClient.request(request);
        return response.body;
    }
    // ==========================================================================
    // EMAIL TRACKING & STATISTICS
    // ==========================================================================
    /**
     * Get email statistics
     * @param options - Statistics filter options
     * @returns Promise with email statistics
     */
    async getEmailStatistics(options = {}) {
        const queryParams = {};
        if (options.startDate)
            queryParams.start_date = options.startDate;
        if (options.endDate)
            queryParams.end_date = options.endDate;
        if (options.aggregatedBy)
            queryParams.aggregated_by = options.aggregatedBy;
        if (options.limit)
            queryParams.limit = options.limit;
        if (options.offset)
            queryParams.offset = options.offset;
        const queryString = new URLSearchParams(queryParams).toString();
        const request = {
            url: `/v3/stats?${queryString}`,
            method: "GET",
        };
        const [response] = await sgClient.request(request);
        return response.body;
    }
    /**
     * Get category-specific statistics
     * @param categories - Array of category names
     * @param options - Statistics filter options
     * @returns Promise with category statistics
     */
    async getCategoryStatistics(categories, options = {}) {
        const queryParams = {
            categories: categories.join(","),
        };
        if (options.startDate)
            queryParams.start_date = options.startDate;
        if (options.endDate)
            queryParams.end_date = options.endDate;
        if (options.aggregatedBy)
            queryParams.aggregated_by = options.aggregatedBy;
        const queryString = new URLSearchParams(queryParams).toString();
        const request = {
            url: `/v3/categories/stats?${queryString}`,
            method: "GET",
        };
        const [response] = await sgClient.request(request);
        return response.body;
    }
    // ==========================================================================
    // SUPPRESSION MANAGEMENT
    // ==========================================================================
    /**
     * Get all suppression groups
     * @returns Promise with list of suppression groups
     */
    async getSuppressionGroups() {
        const request = {
            url: `/v3/asm/groups`,
            method: "GET",
        };
        const [response] = await sgClient.request(request);
        return response.body;
    }
    /**
     * Get blocked emails
     * @param startTime - Optional start time (Unix timestamp)
     * @param endTime - Optional end time (Unix timestamp)
     * @param limit - Optional limit
     * @param offset - Optional offset
     * @returns Promise with list of blocked emails
     */
    async getBlockedEmails(startTime, endTime, limit, offset) {
        const queryParams = {};
        if (startTime)
            queryParams.start_time = startTime;
        if (endTime)
            queryParams.end_time = endTime;
        if (limit)
            queryParams.limit = limit;
        if (offset)
            queryParams.offset = offset;
        const queryString = new URLSearchParams(queryParams).toString();
        const request = {
            url: `/v3/suppression/blocks?${queryString}`,
            method: "GET",
        };
        const [response] = await sgClient.request(request);
        return response.body;
    }
    /**
     * Delete a blocked email
     * @param email - Email address to unblock
     * @returns Promise<void>
     */
    async deleteBlockedEmail(email) {
        const request = {
            url: `/v3/suppression/blocks/${email}`,
            method: "DELETE",
        };
        await sgClient.request(request);
    }
    /**
     * Get bounced emails
     * @param startTime - Optional start time (Unix timestamp)
     * @param endTime - Optional end time (Unix timestamp)
     * @returns Promise with list of bounced emails
     */
    async getBouncedEmails(startTime, endTime) {
        const queryParams = {};
        if (startTime)
            queryParams.start_time = startTime;
        if (endTime)
            queryParams.end_time = endTime;
        const queryString = new URLSearchParams(queryParams).toString();
        const request = {
            url: `/v3/suppression/bounces?${queryString}`,
            method: "GET",
        };
        const [response] = await sgClient.request(request);
        return response.body;
    }
    /**
     * Get spam reports
     * @param startTime - Optional start time (Unix timestamp)
     * @param endTime - Optional end time (Unix timestamp)
     * @returns Promise with list of spam reports
     */
    async getSpamReports(startTime, endTime) {
        const queryParams = {};
        if (startTime)
            queryParams.start_time = startTime;
        if (endTime)
            queryParams.end_time = endTime;
        const queryString = new URLSearchParams(queryParams).toString();
        const request = {
            url: `/v3/suppression/spam_reports?${queryString}`,
            method: "GET",
        };
        const [response] = await sgClient.request(request);
        return response.body;
    }
    /**
     * Get invalid emails
     * @param startTime - Optional start time (Unix timestamp)
     * @param endTime - Optional end time (Unix timestamp)
     * @returns Promise with list of invalid emails
     */
    async getInvalidEmails(startTime, endTime) {
        const queryParams = {};
        if (startTime)
            queryParams.start_time = startTime;
        if (endTime)
            queryParams.end_time = endTime;
        const queryString = new URLSearchParams(queryParams).toString();
        const request = {
            url: `/v3/suppression/invalid_emails?${queryString}`,
            method: "GET",
        };
        const [response] = await sgClient.request(request);
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
    validateEmailData(emailData) {
        if (!emailData.from) {
            throw new Error("Sender is required");
        }
        const senderEmail = typeof emailData.from === "string"
            ? emailData.from
            : emailData.from.email;
        if (!this.isValidEmail(senderEmail)) {
            throw new Error("Invalid sender email address");
        }
        // Validate recipients
        const recipients = Array.isArray(emailData.to)
            ? emailData.to
            : [emailData.to];
        if (recipients.length === 0 && !emailData.personalizations) {
            throw new Error("At least one recipient is required");
        }
        recipients
            .filter((r) => r !== undefined)
            .forEach((recipient) => {
            const recipientEmail = typeof recipient === "string" ? recipient : recipient.email;
            if (!this.isValidEmail(recipientEmail)) {
                throw new Error(`Invalid recipient email: ${recipientEmail}`);
            }
        });
        // Validate subject
        if (!emailData.subject &&
            !emailData.templateId &&
            !emailData.personalizations) {
            throw new Error("Subject is required when not using a template");
        }
        // Validate content
        if (!emailData.html &&
            !emailData.text &&
            !emailData.templateId &&
            !emailData.personalizations) {
            throw new Error("Either html, text, or templateId is required");
        }
    }
    /**
     * Validate email address format
     * @param email - Email address to validate
     * @returns boolean
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    /**
     * Validate scheduled time
     * @param sendAt - Unix timestamp to validate
     * @throws Error if time is invalid or in the past
     */
    validateScheduledTime(sendAt) {
        const now = Math.floor(Date.now() / 1000);
        if (sendAt <= now) {
            throw new Error("Scheduled time must be in the future");
        }
        // SendGrid requires scheduling at least 10 minutes in the future
        const tenMinutesFromNow = now + 600;
        if (sendAt < tenMinutesFromNow) {
            throw new Error("Scheduled time must be at least 10 minutes in the future");
        }
        // SendGrid doesn't allow scheduling more than 72 hours in advance
        const maxScheduleTime = now + 72 * 60 * 60;
        if (sendAt > maxScheduleTime) {
            throw new Error("Scheduled time cannot be more than 72 hours in the future");
        }
    }
    /**
     * Create an email attachment from base64 content
     * @param content - Base64 encoded file content
     * @param filename - File name with extension
     * @param type - MIME type
     * @param disposition - Attachment or inline
     * @returns EmailAttachment object
     */
    static createAttachment(content, filename, type, disposition = "attachment") {
        return { content, filename, type, disposition };
    }
    /**
     * Create an inline image attachment
     * @param content - Base64 encoded image content
     * @param filename - File name
     * @param contentId - Content ID for referencing in HTML
     * @param type - MIME type
     * @returns EmailAttachment object
     */
    static createInlineImage(content, filename, contentId, type) {
        return {
            content,
            filename,
            type,
            disposition: "inline",
            contentId,
        };
    }
    /**
     * Generate Unix timestamp for scheduling
     * @param date - Date object or timestamp
     * @returns Unix timestamp
     */
    static getUnixTimestamp(date) {
        if (typeof date === "number") {
            return Math.floor(date / 1000);
        }
        return Math.floor(date.getTime() / 1000);
    }
    /**
     * Schedule email for a specific number of hours from now
     * @param hours - Number of hours from now
     * @returns Unix timestamp
     */
    static scheduleInHours(hours) {
        const date = new Date();
        date.setHours(date.getHours() + hours);
        return Math.floor(date.getTime() / 1000);
    }
    /**
     * Schedule email for a specific number of days from now
     * @param days - Number of days from now
     * @returns Unix timestamp
     */
    static scheduleInDays(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return Math.floor(date.getTime() / 1000);
    }
    /**
     * Generate a unique batch ID
     * @returns Batch ID string
     */
    static generateBatchId() {
        return `batch_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
}
export default SendGridEmailAdapter;
