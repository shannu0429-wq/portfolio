import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { portfolioStore } from './store';
import { 
  loginRateLimiter, 
  generateToken, 
  verifyPassword, 
  updatePassword,
  getAdminUsername,
  requireAdmin, 
  AuthenticatedRequest 
} from './auth';
import { 
  saveMessage, 
  getMessages, 
  markMessageRead, 
  deleteMessage, 
  sendEmailNotification,
  getEmailConfig,
  saveEmailConfig
} from './mailer';

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PROD = process.env.NODE_ENV === 'production';

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Multer storage setup for uploads
const publicDir = path.resolve(process.cwd(), 'public');
const imagesDir = path.join(publicDir, 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const photoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, imagesDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `profile${ext}`);
  },
});

const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, publicDir),
  filename: (_req, _file, cb) => {
    cb(null, 'resume.pdf');
  },
});

const imageFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image type. Only JPG, PNG, and WebP are allowed.'));
  }
};

const pdfFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid document type. Only PDF is allowed.'));
  }
};

const uploadPhoto = multer({
  storage: photoStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: imageFilter,
});

const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: pdfFilter,
});

// Serve public static files (images, resume)
app.use(express.static(publicDir));

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Rate-limited login
app.post('/api/auth/login', loginRateLimiter, (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required.' });
    return;
  }

  const expectedUsername = getAdminUsername();
  if (username !== expectedUsername || !verifyPassword(password)) {
    res.status(401).json({ error: 'Invalid admin credentials.' });
    return;
  }

  const token = generateToken(username);

  // Set secure HttpOnly cookie
  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    success: true,
    token,
    username,
    message: 'Authentication successful.',
  });
});

// Logout
app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
  });
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Check current auth status
app.get('/api/auth/me', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    authenticated: true,
    username: req.adminUser?.username,
  });
});

// Change admin password
app.post('/api/auth/change-password', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Current password and new password are required.' });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    return;
  }

  if (!verifyPassword(currentPassword)) {
    res.status(401).json({ error: 'Current password does not match.' });
    return;
  }

  updatePassword(newPassword);
  res.json({ success: true, message: 'Admin password updated successfully.' });
});

// ==========================================
// PUBLIC PORTFOLIO DATA & CONTACT ROUTES
// ==========================================
app.get('/api/portfolio', (_req: Request, res: Response) => {
  try {
    const data = portfolioStore.get();
    res.json(data);
  } catch (err) {
    console.error('Failed to read portfolio data:', err);
    res.status(500).json({ error: 'Failed to retrieve portfolio data' });
  }
});

// Public contact form submission (Real email + persistent storage)
app.post('/api/contact', async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required fields.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }

  try {
    // 1. Save message to persistent inbox
    const savedMsg = saveMessage({
      name: name.trim(),
      email: email.trim(),
      subject: (subject || '').trim(),
      message: message.trim(),
    });

    // 2. Dispatch real email notification via SMTP (if configured)
    const emailResult = await sendEmailNotification(savedMsg);

    res.json({
      success: true,
      message: 'Thank you! Your message has been delivered directly to Shanmukha.',
      emailDispatched: emailResult.sent,
    });
  } catch (err: any) {
    console.error('Error handling contact form:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again or email directly.' });
  }
});

// ==========================================
// PROTECTED ADMIN CONTENT ROUTES
// ==========================================

// Get full portfolio data for dashboard
app.get('/api/admin/portfolio', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  res.json(portfolioStore.get());
});

// Save updated portfolio data
app.put('/api/admin/portfolio', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const payload = req.body;

    if (!payload || !payload.profile || !payload.projects) {
      res.status(400).json({ error: 'Invalid payload structure.' });
      return;
    }

    const updated = portfolioStore.update((current) => ({
      ...current,
      ...payload,
      profile: { ...current.profile, ...payload.profile },
      skills: { ...current.skills, ...payload.skills },
      projects: payload.projects,
      education: payload.education || current.education,
      certifications: payload.certifications || current.certifications,
      socialLinks: payload.socialLinks || current.socialLinks,
    }));

    res.json({
      success: true,
      data: updated,
      message: 'Portfolio successfully updated and published!',
    });
  } catch (err: any) {
    console.error('Failed to update portfolio:', err);
    res.status(500).json({ error: err.message || 'Internal server error while saving updates.' });
  }
});

// Reset portfolio to defaults
app.post('/api/admin/reset', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const reset = portfolioStore.resetToDefault();
    res.json({
      success: true,
      data: reset,
      message: 'Portfolio reset to default baseline configuration.',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Upload profile photo
app.post('/api/admin/upload-photo', requireAdmin, uploadPhoto.single('photo'), (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No image file uploaded.' });
    return;
  }

  const filename = req.file.filename;
  const photoUrl = `/images/${filename}?t=${Date.now()}`;

  // Automatically update profile photo URL in store
  portfolioStore.update((curr) => ({
    ...curr,
    profile: {
      ...curr.profile,
      photoUrl,
    },
  }));

  res.json({
    success: true,
    photoUrl,
    message: 'Profile photo updated successfully!',
  });
});

// Upload resume PDF
app.post('/api/admin/upload-resume', requireAdmin, uploadResume.single('resume'), (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No PDF file uploaded.' });
    return;
  }

  const resumeUrl = `/resume.pdf?t=${Date.now()}`;

  // Automatically activate resume in store
  portfolioStore.update((curr) => ({
    ...curr,
    profile: {
      ...curr.profile,
      resumeAvailable: true,
      resumeUrl,
    },
  }));

  res.json({
    success: true,
    resumeUrl,
    message: 'Résumé PDF uploaded and activated successfully!',
  });
});

// ==========================================
// ADMIN INBOX / MESSAGE MANAGEMENT
// ==========================================
app.get('/api/admin/messages', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  res.json(getMessages());
});

app.patch('/api/admin/messages/:id/read', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { read } = req.body;
  const success = markMessageRead(id, read !== false);
  res.json({ success });
});

app.delete('/api/admin/messages/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const success = deleteMessage(id);
  res.json({ success });
});

// ==========================================
// ADMIN EMAIL DELIVERY CONFIGURATION
// ==========================================
app.get('/api/admin/email-config', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const cfg = getEmailConfig();
  res.json({
    ...cfg,
    gmailAppPassword: cfg.gmailAppPassword ? '••••••••••••••••' : '',
    smtpPass: cfg.smtpPass ? '••••••••••••••••' : '',
  });
});

app.post('/api/admin/email-config', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const payload = req.body;
  if (payload.gmailAppPassword === '••••••••••••••••') delete payload.gmailAppPassword;
  if (payload.smtpPass === '••••••••••••••••') delete payload.smtpPass;

  const updated = saveEmailConfig(payload);
  res.json({ success: true, config: updated, message: 'Email settings saved successfully!' });
});

app.post('/api/admin/test-email', requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  const testMsg = {
    id: `test-${Date.now()}`,
    name: 'Shanmukha Admin Studio',
    email: 'system-test@shanmukha.dev',
    subject: 'Verification Test Email',
    message: 'This is a test notification from your Portfolio Admin Studio. Email delivery is working!',
    createdAt: new Date().toISOString(),
    read: true,
  };

  const result = await sendEmailNotification(testMsg);
  res.json(result);
});

// ==========================================
// PRODUCTION CLIENT SERVING
// ==========================================
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (req: Request, res: Response, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: err.message || 'An unexpected error occurred' });
});

const HOST = process.env.HOST || '0.0.0.0';
app.listen(Number(PORT), HOST, () => {
  console.log(`⚡ Portfolio backend running securely on http://${HOST}:${PORT}`);
});

export default app;
