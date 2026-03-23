const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

// Rate limiting store (in-memory, simple implementation)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 3; // Max 3 submissions per window per IP

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy for accurate IP addresses (important for rate limiting)
app.set('trust proxy', true);

// Load blog data
const blogData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'blog.json'), 'utf8'));

// Home route
app.get('/', (req, res) => {
  res.render('layout', { body: 'pages/home', blogPosts: blogData, title: 'Geo | DevOps' });
});

// Architecture page
app.get('/architecture', (req, res) => {
  res.render('layout', { body: 'pages/architecture', title: 'Architecture | Geo' });
});

// Security page
app.get('/security', (req, res) => {
  res.render('layout', { body: 'pages/security', title: 'Security | Geo' });
});

// Kubernetes page
app.get('/kubernetes', (req, res) => {
  res.render('layout', { body: 'pages/kubernetes', title: 'Kubernetes | Geo' });
});

// Skills page
app.get('/skills', (req, res) => {
  res.render('layout', { body: 'pages/skills', title: 'Skills | Geo' });
});

// Case Studies page
app.get('/cases', (req, res) => {
  res.render('layout', { body: 'pages/cases', title: 'Case Studies | Geo' });
});

// Blog page
app.get('/blog', (req, res) => {
  res.render('layout', { body: 'pages/blog', blogPosts: blogData, title: 'Blog | Geo' });
});

// Research page
app.get('/research', (req, res) => {
  res.render('layout', { body: 'pages/research', title: 'Research & Industry Signals | Geo' });
});

// Contact page
app.get('/contact', (req, res) => {
  res.render('layout', { body: 'pages/contact', title: 'Contact | Geo' });
});

// Contact form submission (POST)
app.post('/contact', (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  // Rate limiting check
  const now = Date.now();
  const clientData = rateLimitStore.get(clientIP) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (now > clientData.resetTime) {
    clientData.count = 0;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  if (clientData.count >= RATE_LIMIT_MAX) {
    return res.status(429).json({ 
      success: false, 
      error: 'Too many requests. Please try again later.' 
    });
  }
  
  // Honeypot check (spam protection)
  if (req.body.website && req.body.website.trim() !== '') {
    // Bot detected, silently fail
    return res.status(200).json({ success: true });
  }
  
  // Validate required fields
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'All fields are required.' 
    });
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid email address.' 
    });
  }
  
  // Sanitize inputs (basic)
  const sanitizedName = name.trim().substring(0, 100);
  const sanitizedEmail = email.trim().substring(0, 100);
  const sanitizedMessage = message.trim().substring(0, 2000);
  
  // Get recipient email from environment variable (not exposed in code)
  const recipientEmail = process.env.CONTACT_EMAIL || 'your-email@example.com';
  
  // Log the contact attempt (in production, you'd send an email here)
  console.log(`[CONTACT] From: ${sanitizedName} <${sanitizedEmail}>`);
  console.log(`[CONTACT] Message: ${sanitizedMessage.substring(0, 100)}...`);
  console.log(`[CONTACT] IP: ${clientIP}`);
  
  // Increment rate limit counter
  clientData.count++;
  rateLimitStore.set(clientIP, clientData);
  
  // In production, you would send an email here using nodemailer or similar
  // For now, we'll just log it and return success
  // TODO: Implement email sending with nodemailer or AWS SES
  
  res.status(200).json({ 
    success: true, 
    message: 'Message sent successfully. I\'ll get back to you soon.' 
  });
});

// Health check route for Kubernetes probes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running on http://${HOSTNAME}:${PORT}`);
});
