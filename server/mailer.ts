import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface EmailSettings {
  service: 'web3forms' | 'gmail' | 'smtp' | 'inbox-only';
  web3FormsKey?: string;
  gmailUser?: string;
  gmailAppPassword?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  recipientEmail: string;
}

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.resolve(process.cwd(), 'server', 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const CONFIG_FILE = path.join(DATA_DIR, 'email-config.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function getEmailConfig(): EmailSettings {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(raw) as EmailSettings;
    }
  } catch (err) {
    console.error('Error reading email-config.json:', err);
  }

  // Fallback to process.env
  return {
    service: (process.env.EMAIL_SERVICE as any) || (process.env.WEB3FORMS_KEY ? 'web3forms' : process.env.GMAIL_APP_PASSWORD ? 'gmail' : 'inbox-only'),
    web3FormsKey: process.env.WEB3FORMS_KEY || '',
    gmailUser: process.env.GMAIL_USER || 'shannu0429@gmail.com',
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD || '',
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    recipientEmail: process.env.NOTIFICATION_EMAIL || 'shannu0429@gmail.com',
  };
}

export function saveEmailConfig(config: Partial<EmailSettings>): EmailSettings {
  const current = getEmailConfig();
  const updated: EmailSettings = {
    ...current,
    ...config,
  };

  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save email config:', err);
  }

  return updated;
}

export function getMessages(): ContactMessage[] {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      return JSON.parse(raw) as ContactMessage[];
    }
  } catch (err) {
    console.error('Error reading messages.json:', err);
  }
  return [];
}

export function saveMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): ContactMessage {
  const messages = getMessages();
  const newMessage: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };

  messages.unshift(newMessage);

  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save message to disk:', err);
  }

  return newMessage;
}

export function markMessageRead(id: string, read: boolean = true): boolean {
  const messages = getMessages();
  const target = messages.find((m) => m.id === id);
  if (target) {
    target.read = read;
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
    return true;
  }
  return false;
}

export function deleteMessage(id: string): boolean {
  let messages = getMessages();
  const initialLen = messages.length;
  messages = messages.filter((m) => m.id !== id);
  if (messages.length !== initialLen) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
    return true;
  }
  return false;
}

/**
 * Send real email via configured provider: Web3Forms API or Nodemailer SMTP / Gmail
 */
export async function sendEmailNotification(msg: ContactMessage): Promise<{ sent: boolean; provider: string; reason?: string }> {
  const cfg = getEmailConfig();
  const recipientEmail = cfg.recipientEmail || 'shannu0429@gmail.com';

  // 1. Try Web3Forms if key is provided
  if (cfg.web3FormsKey) {
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: cfg.web3FormsKey,
          name: msg.name,
          email: msg.email,
          subject: `[Portfolio Inquiry] ${msg.subject || 'New message from ' + msg.name}`,
          message: msg.message,
          from_name: `${msg.name} (via Portfolio)`,
          to_email: recipientEmail,
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        console.log(`[Web3Forms] Real email delivered to ${recipientEmail}`);
        return { sent: true, provider: 'Web3Forms API' };
      } else {
        console.warn('[Web3Forms] API returned error:', resData.message);
      }
    } catch (err: any) {
      console.error('[Web3Forms] Failed to send via Web3Forms API:', err);
    }
  }

  // 2. Try Gmail or Custom SMTP with Nodemailer
  const gmailPass = cfg.gmailAppPassword || process.env.GMAIL_APP_PASSWORD;
  const gmailUser = cfg.gmailUser || process.env.GMAIL_USER || 'shannu0429@gmail.com';

  if (gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact System" <${gmailUser}>`,
        to: recipientEmail,
        replyTo: msg.email,
        subject: `[Portfolio Inquiry] ${msg.subject || 'Message from ' + msg.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #1e293b; border-radius: 12px; background: #050814; color: #f8fafc;">
            <h2 style="color: #00f2fe; margin-top: 0; padding-bottom: 12px; border-bottom: 1px solid #1e293b;">
              📬 New Message from Portfolio
            </h2>
            <p style="font-size: 14px; color: #94a3b8;"><strong>Sender:</strong> <span style="color: #ffffff;">${msg.name}</span></p>
            <p style="font-size: 14px; color: #94a3b8;"><strong>Email:</strong> <a href="mailto:${msg.email}" style="color: #00f2fe; text-decoration: none;">${msg.email}</a></p>
            <p style="font-size: 14px; color: #94a3b8;"><strong>Subject:</strong> <span style="color: #ffffff;">${msg.subject || 'No subject'}</span></p>
            <div style="background: #0d152c; padding: 18px; border-radius: 8px; border-left: 4px solid #00f2fe; margin: 18px 0;">
              <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #e2e8f0;">${msg.message}</p>
            </div>
            <p style="font-size: 11px; color: #64748b; margin-top: 20px; text-align: center;">
              Sent via Somisetty Shanmukha's Developer Portfolio
            </p>
          </div>
        `,
      });

      console.log(`[Gmail SMTP] Real email delivered to ${recipientEmail}`);
      return { sent: true, provider: 'Gmail SMTP' };
    } catch (err: any) {
      console.error('[Gmail SMTP] Failed to send via Gmail:', err.message);
      return { sent: false, provider: 'Gmail SMTP', reason: err.message };
    }
  }

  // 3. Fallback: Saved to Admin Studio Inbox
  return { 
    sent: false, 
    provider: 'Studio Inbox', 
    reason: 'Message saved to your Studio Inbox. To forward directly to Gmail, add a free Web3Forms Key or Gmail App Password in your Admin Studio.' 
  };
}
