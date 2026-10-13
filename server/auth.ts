import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const ENV_FILE = path.resolve(process.cwd(), '.env');

// Ensure a strong JWT secret exists
let JWT_SECRET = process.env.JWT_SECRET;
let ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'shanmukha_admin';
let ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// Default initial password: Shanmukha@2026!
const DEFAULT_INITIAL_PASSWORD = 'Shanmukha@2026!';

if (!JWT_SECRET || !ADMIN_PASSWORD_HASH) {
  if (!JWT_SECRET) {
    JWT_SECRET = 'agy_jwt_sec_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
  if (!ADMIN_PASSWORD_HASH) {
    const salt = bcrypt.genSaltSync(12);
    ADMIN_PASSWORD_HASH = bcrypt.hashSync(DEFAULT_INITIAL_PASSWORD, salt);
  }

  // Persist into .env file if not present
  try {
    const envContent = [
      `# Antigravity Portfolio Admin Configuration`,
      `PORT=5000`,
      `ADMIN_USERNAME=${ADMIN_USERNAME}`,
      `ADMIN_PASSWORD_HASH=${ADMIN_PASSWORD_HASH}`,
      `JWT_SECRET=${JWT_SECRET}`,
      `NODE_ENV=production`,
      ``,
    ].join('\n');

    if (!fs.existsSync(ENV_FILE)) {
      fs.writeFileSync(ENV_FILE, envContent, 'utf-8');
      console.log('✅ Initialized secure .env file with generated credentials.');
    }
  } catch (err) {
    console.warn('Could not write .env file:', err);
  }
}

// Rate Limiting for login endpoint (protects against brute force)
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
});

export interface TokenPayload {
  username: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

export function generateToken(username: string): string {
  return jwt.sign({ username, role: 'admin' }, JWT_SECRET as string, {
    expiresIn: '7d',
  });
}

export function verifyPassword(password: string): boolean {
  if (!ADMIN_PASSWORD_HASH) return false;
  return bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
}

export function updatePassword(newPassword: string): void {
  const salt = bcrypt.genSaltSync(12);
  const newHash = bcrypt.hashSync(newPassword, salt);
  ADMIN_PASSWORD_HASH = newHash;

  try {
    let content = '';
    if (fs.existsSync(ENV_FILE)) {
      content = fs.readFileSync(ENV_FILE, 'utf-8');
      if (content.includes('ADMIN_PASSWORD_HASH=')) {
        content = content.replace(/ADMIN_PASSWORD_HASH=.*/g, `ADMIN_PASSWORD_HASH=${newHash}`);
      } else {
        content += `\nADMIN_PASSWORD_HASH=${newHash}`;
      }
    } else {
      content = `ADMIN_USERNAME=${ADMIN_USERNAME}\nADMIN_PASSWORD_HASH=${newHash}\nJWT_SECRET=${JWT_SECRET}\n`;
    }
    fs.writeFileSync(ENV_FILE, content, 'utf-8');
  } catch (err) {
    console.error('Failed to update password hash in .env:', err);
  }
}

export function getAdminUsername(): string {
  return ADMIN_USERNAME;
}

export interface AuthenticatedRequest extends Request {
  adminUser?: TokenPayload;
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  // Extract token from either Authorization header or cookies
  let token = req.cookies?.admin_token;

  const authHeader = req.headers.authorization;
  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
    res.status(401).json({ error: 'Unauthorized. Authentication token is missing.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as TokenPayload;
    if (decoded.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden. Admin role required.' });
      return;
    }
    req.adminUser = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
  }
}
