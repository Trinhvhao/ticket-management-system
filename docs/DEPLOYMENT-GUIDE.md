# Production Deployment Guide

**Version:** 1.0  
**Last Updated:** 18/01/2026  
**Target:** Production Environment

---

## 📋 Pre-Deployment Checklist

### 1. Code Quality
- [x] Backend build successful
- [x] Frontend build successful
- [ ] All tests passing
- [ ] No console errors
- [ ] Code review completed
- [ ] Security audit completed

### 2. Environment Configuration
- [ ] Production `.env` files configured
- [ ] Database credentials secured
- [ ] JWT secrets changed from default
- [ ] SMTP configured for emails
- [ ] CORS origins updated
- [ ] File upload paths configured

### 3. Database
- [ ] Production database created
- [ ] Migrations run successfully
- [ ] Seed data loaded (categories, SLA rules, holidays)
- [ ] Database backup strategy in place
- [ ] Connection pooling configured

### 4. Security
- [ ] SSL certificates installed
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Input validation tested
- [ ] File upload restrictions verified

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Internet                         │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              Nginx Reverse Proxy                    │
│         (SSL Termination, Load Balancing)           │
└────────────┬────────────────────────┬────────────────┘
             │                        │
             ▼                        ▼
┌────────────────────────┐  ┌────────────────────────┐
│   Frontend (Next.js)   │  │   Backend (NestJS)     │
│   Port: 3001           │  │   Port: 3000           │
│   PM2 Process          │  │   PM2 Process          │
└────────────────────────┘  └───────────┬────────────┘
                                        │
                                        ▼
                            ┌────────────────────────┐
                            │  PostgreSQL Database   │
                            │  (Supabase)            │
                            └────────────────────────┘
```

---

## 🚀 Deployment Steps

### Step 1: Server Setup

#### 1.1 System Requirements
```bash
# Minimum Requirements
- OS: Ubuntu 20.04 LTS or later
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB SSD
- Node.js: 18.x or later
- PostgreSQL: 14.x or later (Supabase)
```

#### 1.2 Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

---

### Step 2: Clone Repository

```bash
# Create app directory
sudo mkdir -p /var/www/ticket-system
sudo chown -R $USER:$USER /var/www/ticket-system

# Clone repository
cd /var/www/ticket-system
git clone https://github.com/Trinhvhao/ticket-management-system.git .

# Install dependencies
npm install
cd apps/backend && npm install
cd ../frontend && npm install
```

---

### Step 3: Configure Environment Variables

#### 3.1 Backend Environment
```bash
# Create production .env
cd /var/www/ticket-system/apps/backend
nano .env
```

```env
# Server Configuration
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Supabase PostgreSQL Configuration
DB_DIALECT=postgres
DB_HOST=aws-1-ap-south-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.oxyhzfrhkzxghgnpxjse
DB_PASS=YOUR_PRODUCTION_PASSWORD
DB_SSL=true
DB_POOL_MAX=20
DB_POOL_MIN=5
DB_POOL_IDLE=10000

# JWT Configuration (CHANGE THESE!)
JWT_SECRET=CHANGE_THIS_TO_RANDOM_64_CHAR_STRING
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration
EMAIL_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-production-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@28h.com

# File Upload Configuration
UPLOAD_PATH=/var/www/ticket-system/apps/backend/uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx,txt,zip

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=https://your-domain.com
CORS_CREDENTIALS=true
```

#### 3.2 Frontend Environment
```bash
cd /var/www/ticket-system/apps/frontend
nano .env.production
```

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api/v1
NEXT_PUBLIC_API_TIMEOUT=30000

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=https://api.your-domain.com

# App Configuration
NEXT_PUBLIC_APP_NAME=Ticket Management System
NEXT_PUBLIC_COMPANY_NAME=TNHH 28H

# File Upload
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx,txt,zip
```

---

### Step 4: Database Setup

```bash
cd /var/www/ticket-system/apps/backend

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Create admin user (if not exists)
npm run seed:users
```

#### 4.1 Verify Database
```sql
-- Connect to PostgreSQL
psql -h aws-1-ap-south-1.pooler.supabase.com -p 6543 -U postgres.oxyhzfrhkzxghgnpxjse -d postgres

-- Check tables
\dt

-- Check users
SELECT id, email, "fullName", role, "isActive" FROM users;

-- Check categories
SELECT * FROM categories;

-- Check SLA rules
SELECT * FROM sla_rules;

-- Check holidays
SELECT * FROM holidays ORDER BY date;
```

---

### Step 5: Build Applications

#### 5.1 Build Backend
```bash
cd /var/www/ticket-system/apps/backend
npm run build

# Verify build
ls -la dist/
```

#### 5.2 Build Frontend
```bash
cd /var/www/ticket-system/apps/frontend
npm run build

# Verify build
ls -la .next/
```

---

### Step 6: Configure PM2

#### 6.1 Create PM2 Ecosystem File
```bash
cd /var/www/ticket-system
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [
    {
      name: 'ticket-backend',
      cwd: '/var/www/ticket-system/apps/backend',
      script: 'dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/pm2/ticket-backend-error.log',
      out_file: '/var/log/pm2/ticket-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false,
    },
    {
      name: 'ticket-frontend',
      cwd: '/var/www/ticket-system/apps/frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: '/var/log/pm2/ticket-frontend-error.log',
      out_file: '/var/log/pm2/ticket-frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false,
    },
  ],
};
```

#### 6.2 Start PM2
```bash
# Create log directory
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Start applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
# Follow the instructions printed

# Check status
pm2 status
pm2 logs
```

---

### Step 7: Configure Nginx

#### 7.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/ticket-system
```

```nginx
# Backend API
server {
    listen 80;
    server_name api.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Proxy to Backend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # File uploads
    client_max_body_size 10M;
}

# Frontend
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Proxy to Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3001;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

#### 7.2 Enable Site and Restart Nginx
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ticket-system /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

### Step 8: SSL Certificates (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
sudo certbot --nginx -d api.your-domain.com

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

---

### Step 9: Firewall Configuration

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

---

### Step 10: Monitoring & Logging

#### 10.1 PM2 Monitoring
```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs ticket-backend
pm2 logs ticket-frontend

# View specific lines
pm2 logs ticket-backend --lines 100
```

#### 10.2 System Monitoring
```bash
# Install monitoring tools
sudo apt install -y htop iotop

# Check system resources
htop

# Check disk usage
df -h

# Check memory
free -h
```

---

## 🔄 Update & Maintenance

### Update Application
```bash
# Navigate to app directory
cd /var/www/ticket-system

# Pull latest changes
git pull origin main

# Backend update
cd apps/backend
npm install
npm run build
pm2 restart ticket-backend

# Frontend update
cd ../frontend
npm install
npm run build
pm2 restart ticket-frontend

# Check status
pm2 status
```

### Database Backup
```bash
# Create backup script
nano /var/www/ticket-system/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/ticket-system"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="ticket_db_$DATE.sql"

mkdir -p $BACKUP_DIR

# Backup database
PGPASSWORD=YOUR_PASSWORD pg_dump \
  -h aws-1-ap-south-1.pooler.supabase.com \
  -p 6543 \
  -U postgres.oxyhzfrhkzxghgnpxjse \
  -d postgres \
  > $BACKUP_DIR/$FILENAME

# Compress backup
gzip $BACKUP_DIR/$FILENAME

# Keep only last 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $FILENAME.gz"
```

```bash
# Make executable
chmod +x /var/www/ticket-system/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line:
0 2 * * * /var/www/ticket-system/backup-db.sh
```

---

## 🐛 Troubleshooting

### Backend Not Starting
```bash
# Check logs
pm2 logs ticket-backend --lines 50

# Check environment variables
cd /var/www/ticket-system/apps/backend
cat .env

# Test database connection
npm run db:migrate

# Restart
pm2 restart ticket-backend
```

### Frontend Not Loading
```bash
# Check logs
pm2 logs ticket-frontend --lines 50

# Check build
cd /var/www/ticket-system/apps/frontend
ls -la .next/

# Rebuild
npm run build
pm2 restart ticket-frontend
```

### Database Connection Issues
```bash
# Test connection
psql -h aws-1-ap-south-1.pooler.supabase.com -p 6543 -U postgres.oxyhzfrhkzxghgnpxjse -d postgres

# Check pool settings in .env
# Increase DB_POOL_MAX if needed
```

### High Memory Usage
```bash
# Check PM2 processes
pm2 status

# Restart specific app
pm2 restart ticket-backend

# Restart all
pm2 restart all
```

---

## 📊 Performance Optimization

### 1. Database Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_assignee ON tickets("assigneeId");
CREATE INDEX idx_tickets_created ON tickets("createdAt");

-- Analyze tables
ANALYZE tickets;
ANALYZE users;
ANALYZE comments;
```

### 2. Nginx Caching
```nginx
# Add to nginx config
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m inactive=60m;

location /api/v1/categories {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    proxy_pass http://localhost:3000;
}
```

### 3. PM2 Cluster Mode
```javascript
// Already configured in ecosystem.config.js
instances: 2, // Use 2 instances for backend
exec_mode: 'cluster',
```

---

## ✅ Post-Deployment Checklist

- [ ] All services running (pm2 status)
- [ ] Frontend accessible via HTTPS
- [ ] Backend API responding
- [ ] Database connected
- [ ] SSL certificates valid
- [ ] Login/Register working
- [ ] Create ticket working
- [ ] File upload working
- [ ] Email notifications working
- [ ] Cron jobs running (escalation)
- [ ] Monitoring setup
- [ ] Backups configured
- [ ] Firewall configured
- [ ] DNS records updated

---

## 📞 Support

**Technical Issues:**
- Check logs: `pm2 logs`
- Check system: `htop`, `df -h`
- Check nginx: `sudo nginx -t`

**Database Issues:**
- Supabase Dashboard: https://supabase.com/dashboard
- Check connection pooling
- Review slow queries

---

*Deployment Guide Version 1.0*  
*Last Updated: 18/01/2026*  
*Status: Ready for Production*
