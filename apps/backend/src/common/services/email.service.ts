import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class EmailService {
  private transporter: Transporter | null = null;
  private readonly logger = new Logger(EmailService.name);
  private readonly from: string;
  private readonly enabled: boolean;

  constructor(private configService: ConfigService) {
    this.enabled = this.configService.get<string>('EMAIL_ENABLED') === 'true';
    this.from = this.configService.get<string>('EMAIL_FROM') || 'noreply@ticketsystem.com';

    if (this.enabled) {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('SMTP_HOST'),
        port: this.configService.get<number>('SMTP_PORT') || 587,
        secure: this.configService.get<string>('SMTP_SECURE') === 'true',
        auth: {
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASS'),
        },
      });

      this.logger.log('Email service initialized');
    } else {
      this.logger.warn('Email service is disabled');
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.enabled || !this.transporter) {
      this.logger.debug(`Email disabled - Would send to ${options.to}: ${options.subject}`);
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      this.logger.log(`Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to send email: ${err.message}`, err.stack);
      return false;
    }
  }

  async sendTicketCreatedEmail(to: string, ticketId: number, title: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: `Ticket #${ticketId} Created: ${title}`,
      html: `
        <h2>New Ticket Created</h2>
        <p>A new support ticket has been created:</p>
        <ul>
          <li><strong>Ticket ID:</strong> #${ticketId}</li>
          <li><strong>Title:</strong> ${title}</li>
        </ul>
        <p>You can view and manage this ticket in the system.</p>
      `,
      text: `New Ticket Created\n\nTicket ID: #${ticketId}\nTitle: ${title}\n\nYou can view and manage this ticket in the system.`,
    });
  }

  async sendTicketAssignedEmail(to: string, ticketId: number, title: string, assignedBy: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: `Ticket #${ticketId} Assigned to You`,
      html: `
        <h2>Ticket Assigned</h2>
        <p>A ticket has been assigned to you:</p>
        <ul>
          <li><strong>Ticket ID:</strong> #${ticketId}</li>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Assigned by:</strong> ${assignedBy}</li>
        </ul>
        <p>Please review and start working on this ticket.</p>
      `,
      text: `Ticket Assigned\n\nTicket ID: #${ticketId}\nTitle: ${title}\nAssigned by: ${assignedBy}\n\nPlease review and start working on this ticket.`,
    });
  }

  async sendTicketUpdatedEmail(to: string, ticketId: number, title: string, updatedBy: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: `Ticket #${ticketId} Updated`,
      html: `
        <h2>Ticket Updated</h2>
        <p>A ticket has been updated:</p>
        <ul>
          <li><strong>Ticket ID:</strong> #${ticketId}</li>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Updated by:</strong> ${updatedBy}</li>
        </ul>
        <p>Check the ticket for the latest updates.</p>
      `,
      text: `Ticket Updated\n\nTicket ID: #${ticketId}\nTitle: ${title}\nUpdated by: ${updatedBy}\n\nCheck the ticket for the latest updates.`,
    });
  }

  async sendTicketCommentedEmail(to: string, ticketId: number, title: string, commentedBy: string, comment: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: `New Comment on Ticket #${ticketId}`,
      html: `
        <h2>New Comment</h2>
        <p>A new comment has been added to your ticket:</p>
        <ul>
          <li><strong>Ticket ID:</strong> #${ticketId}</li>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Commented by:</strong> ${commentedBy}</li>
        </ul>
        <p><strong>Comment:</strong></p>
        <blockquote>${comment}</blockquote>
      `,
      text: `New Comment\n\nTicket ID: #${ticketId}\nTitle: ${title}\nCommented by: ${commentedBy}\n\nComment:\n${comment}`,
    });
  }

  async sendTicketResolvedEmail(to: string, ticketId: number, title: string, resolvedBy: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: `Ticket #${ticketId} Resolved`,
      html: `
        <h2>Ticket Resolved</h2>
        <p>Your ticket has been resolved:</p>
        <ul>
          <li><strong>Ticket ID:</strong> #${ticketId}</li>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Resolved by:</strong> ${resolvedBy}</li>
        </ul>
        <p>Please review the solution and close the ticket if you're satisfied.</p>
      `,
      text: `Ticket Resolved\n\nTicket ID: #${ticketId}\nTitle: ${title}\nResolved by: ${resolvedBy}\n\nPlease review the solution and close the ticket if you're satisfied.`,
    });
  }

  async sendTicketClosedEmail(to: string, ticketId: number, title: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: `Ticket #${ticketId} Closed`,
      html: `
        <h2>Ticket Closed</h2>
        <p>Your ticket has been closed:</p>
        <ul>
          <li><strong>Ticket ID:</strong> #${ticketId}</li>
          <li><strong>Title:</strong> ${title}</li>
        </ul>
        <p>Thank you for using our support system!</p>
      `,
      text: `Ticket Closed\n\nTicket ID: #${ticketId}\nTitle: ${title}\n\nThank you for using our support system!`,
    });
  }

  async sendSLAWarningEmail(to: string, ticketId: number, title: string, timeRemaining: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: `SLA Warning: Ticket #${ticketId}`,
      html: `
        <h2 style="color: orange;">SLA Warning</h2>
        <p>A ticket is approaching its SLA deadline:</p>
        <ul>
          <li><strong>Ticket ID:</strong> #${ticketId}</li>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Time Remaining:</strong> ${timeRemaining}</li>
        </ul>
        <p><strong>Please prioritize this ticket to avoid SLA breach.</strong></p>
      `,
      text: `SLA Warning\n\nTicket ID: #${ticketId}\nTitle: ${title}\nTime Remaining: ${timeRemaining}\n\nPlease prioritize this ticket to avoid SLA breach.`,
    });
  }
}
