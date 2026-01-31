# AWS EC2 Deployment Guide

This guide walks through deploying the Croatian Food Aggregator to a single AWS EC2 instance with self-hosted PostgreSQL.

## Prerequisites

- AWS Account
- Domain name (optional but recommended)
- SSH key pair for EC2 access
- Basic Linux/Ubuntu knowledge

## Part 1: Provision EC2 Instance

### 1.1 Launch EC2 Instance

1. **Login to AWS Console** → EC2 → Launch Instance

2. **Configure Instance:**
   - **Name:** food-aggregator-prod
   - **AMI:** Ubuntu Server 22.04 LTS (HVM), SSD Volume Type
   - **Instance Type:** t3.medium (2 vCPU, 4GB RAM minimum)
   - **Key Pair:** Create new or select existing
   - **Network Settings:**
     - Create security group with:
       - SSH (22) from your IP
       - HTTP (80) from anywhere
       - HTTPS (443) from anywhere
   - **Storage:** 20GB gp3 (minimum)

3. **Launch Instance** and wait for it to be running

4. **Elastic IP (Recommended):**
   - Allocate Elastic IP
   - Associate with instance
   - Update DNS A record to point to Elastic IP

### 1.2 Connect to Instance

```bash
# Download your key pair (.pem file)
chmod 400 your-key.pem

# Connect via SSH
ssh -i your-key.pem ubuntu@YOUR_INSTANCE_IP
```

## Part 2: Server Setup

### 2.1 Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Install Node.js 18

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version  # Should be v18.x.x
npm --version
```

### 2.3 Install PostgreSQL 16

```bash
# Add PostgreSQL APT repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Import repository signing key
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Update and install
sudo apt update
sudo apt install postgresql-16 postgresql-contrib-16 -y

# Start and enable service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify
sudo -u postgres psql --version
```

### 2.4 Configure PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell, run:
CREATE DATABASE food_aggregator;
CREATE USER food_app WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE food_aggregator TO food_app;
ALTER DATABASE food_aggregator OWNER TO food_app;
\q

# Enable local connections
sudo nano /etc/postgresql/16/main/pg_hba.conf

# Add this line before other rules:
local   all   food_app   md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### 2.5 Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify
sudo systemctl status nginx
```

### 2.6 Install PM2 (Process Manager)

```bash
npm install -g pm2

# Setup PM2 to start on boot
pm2 startup systemd
# Run the command it outputs (starts with 'sudo env')
```

## Part 3: Application Deployment

### 3.1 Create Application User

```bash
# Create dedicated user (optional but recommended)
sudo adduser --disabled-password --gecos "" appuser
sudo usermod -aG sudo appuser

# Switch to app user for remaining steps
sudo su - appuser
```

### 3.2 Clone and Setup Application

```bash
# Create app directory
mkdir -p /home/appuser/app
cd /home/appuser/app

# Clone repository (or upload files via scp/rsync)
# Option 1: From Git
git clone <your-repo-url> .

# Option 2: Transfer files
# On local machine:
# rsync -avz -e "ssh -i your-key.pem" ./ ubuntu@YOUR_IP:/home/appuser/app/

# Install dependencies
npm ci --production=false
```

### 3.3 Configure Environment

```bash
# Create production environment file
nano .env.production

# Add the following (adjust values):
DATABASE_URL="postgresql://food_app:your_secure_password_here@localhost:5432/food_aggregator?schema=public"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-generated-secret-here"
NODE_ENV="production"
PORT=3000

# Trending algorithm (optional)
TRENDING_WEIGHT_VIEWS=1.0
TRENDING_WEIGHT_FAVORITES=2.0
TRENDING_WEIGHT_REVIEWS=3.0
TRENDING_WEIGHT_RATING=10.0
TRENDING_CACHE_TTL=900

# Rate limiting
RATE_LIMIT_REVIEW_PER_HOUR=5
RATE_LIMIT_API_PER_MINUTE=60

# Admin email
ADMIN_EMAIL="admin@yourdomain.com"

# Save and exit (Ctrl+X, Y, Enter)

# Secure the file
chmod 600 .env.production
```

### 3.4 Database Migration

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
DATABASE_URL="postgresql://food_app:your_secure_password_here@localhost:5432/food_aggregator?schema=public" npm run db:migrate:deploy

# Optional: Seed initial data
npm run db:seed
```

### 3.5 Build Application

```bash
# Build Next.js application
npm run build

# Verify build
ls -la .next/
```

### 3.6 Start Application with PM2

```bash
# Start application
pm2 start npm --name "food-aggregator" -- start

# Save PM2 configuration
pm2 save

# Verify it's running
pm2 status
pm2 logs food-aggregator

# Monitor
pm2 monit
```

## Part 4: Nginx Configuration

### 4.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/food-aggregator

# Add the following configuration:
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS (will be added after SSL setup)
    # return 301 https://$server_name$request_uri;

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

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # Client upload size
    client_max_body_size 10M;
}
```

### 4.2 Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/food-aggregator /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 4.3 Test HTTP Access

```bash
# Should return HTML
curl http://YOUR_INSTANCE_IP

# Or visit in browser
# http://YOUR_INSTANCE_IP
```

## Part 5: SSL with Let's Encrypt

### 5.1 Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 5.2 Obtain SSL Certificate

```bash
# Replace with your domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose redirect HTTP to HTTPS (option 2)

# Verify auto-renewal
sudo certbot renew --dry-run
```

### 5.3 Update Nginx Configuration

Certbot automatically updates Nginx config. Verify:

```bash
sudo nano /etc/nginx/sites-available/food-aggregator

# Should now include SSL configuration:
# listen 443 ssl;
# ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
```

### 5.4 Test HTTPS

Visit https://yourdomain.com in browser

## Part 6: Database Backups

### 6.1 Create Backup Script

```bash
sudo mkdir -p /var/backups/postgresql
sudo nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
# PostgreSQL Backup Script

BACKUP_DIR="/var/backups/postgresql"
DB_NAME="food_aggregator"
DB_USER="food_app"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="$BACKUP_DIR/food_aggregator_$DATE.sql.gz"

# Create backup
PGPASSWORD='your_secure_password_here' pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $FILENAME

# Keep only last 7 days of backups
find $BACKUP_DIR -name "food_aggregator_*.sql.gz" -mtime +7 -delete

# Log
echo "$(date): Backup completed - $FILENAME" >> /var/log/db-backup.log
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-db.sh

# Test it
sudo /usr/local/bin/backup-db.sh
```

### 6.2 Schedule Daily Backups

```bash
# Edit crontab
sudo crontab -e

# Add this line (daily at 2 AM):
0 2 * * * /usr/local/bin/backup-db.sh

# Verify
sudo crontab -l
```

### 6.3 Restore from Backup

```bash
# List backups
ls -lh /var/backups/postgresql/

# Restore (replace YYYYMMDD_HHMMSS with actual backup date)
gunzip < /var/backups/postgresql/food_aggregator_YYYYMMDD_HHMMSS.sql.gz | \
PGPASSWORD='your_secure_password_here' psql -U food_app -h localhost food_aggregator
```

## Part 7: Monitoring and Logging

### 7.1 Application Logs

```bash
# View PM2 logs
pm2 logs food-aggregator

# View last 100 lines
pm2 logs food-aggregator --lines 100

# Stream logs
pm2 logs food-aggregator --raw
```

### 7.2 Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### 7.3 PostgreSQL Logs

```bash
# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-16-main.log
```

### 7.4 System Resources

```bash
# Disk space
df -h

# Memory usage
free -h

# CPU and processes
htop

# PM2 monitoring
pm2 monit
```

## Part 8: Maintenance

### 8.1 Application Updates

```bash
cd /home/appuser/app

# Pull latest code
git pull origin main

# Install new dependencies
npm ci --production=false

# Run migrations
npm run db:migrate:deploy

# Rebuild
npm run build

# Restart application
pm2 restart food-aggregator

# Save PM2 config
pm2 save
```

### 8.2 Database Maintenance

```bash
# Vacuum database (monthly recommended)
PGPASSWORD='your_secure_password_here' psql -U food_app -h localhost -d food_aggregator -c "VACUUM ANALYZE;"

# Check database size
PGPASSWORD='your_secure_password_here' psql -U food_app -h localhost -d food_aggregator -c "SELECT pg_size_pretty(pg_database_size('food_aggregator'));"
```

### 8.3 Log Rotation

```bash
# Nginx logs are auto-rotated
# For application logs:
pm2 install pm2-logrotate

# Configure
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Part 9: Security Hardening

### 9.1 Firewall

```bash
# Enable UFW
sudo ufw enable

# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Deny direct PostgreSQL access
sudo ufw deny 5432/tcp

# Check status
sudo ufw status
```

### 9.2 Fail2Ban (Optional)

```bash
# Install
sudo apt install fail2ban -y

# Configure
sudo nano /etc/fail2ban/jail.local

# Add:
[sshd]
enabled = true
port = 22
maxretry = 3
bantime = 3600

# Restart
sudo systemctl restart fail2ban
```

### 9.3 Automatic Security Updates

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

## Part 10: Troubleshooting

### Application won't start

```bash
# Check PM2 logs
pm2 logs food-aggregator --err

# Check if port 3000 is in use
sudo lsof -i :3000

# Check environment variables
pm2 env 0
```

### Database connection errors

```bash
# Test connection
PGPASSWORD='your_secure_password_here' psql -U food_app -h localhost -d food_aggregator -c "SELECT 1;"

# Check PostgreSQL status
sudo systemctl status postgresql

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-16-main.log
```

### Nginx errors

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### SSL certificate issues

```bash
# Test certificate renewal
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal

# Check certificate expiry
sudo certbot certificates
```

## Part 11: Scaling Considerations

### Vertical Scaling

When you need more resources:

1. Stop application: `pm2 stop food-aggregator`
2. Stop EC2 instance
3. Change instance type (e.g., t3.medium → t3.large)
4. Start instance
5. Start application: `pm2 start food-aggregator`

### Horizontal Scaling (Future)

For high traffic, consider:

1. **Database:** Move to RDS or separate EC2
2. **Application:** Multiple EC2 instances behind ALB
3. **Caching:** Add Redis for sessions and cache
4. **Static Assets:** Use CloudFront CDN
5. **File Storage:** Use S3 for images

## Summary Checklist

- [ ] EC2 instance provisioned and accessible
- [ ] Node.js 18 installed
- [ ] PostgreSQL 16 installed and configured
- [ ] Application cloned and dependencies installed
- [ ] Environment variables configured
- [ ] Database migrated
- [ ] Application built and running via PM2
- [ ] Nginx configured as reverse proxy
- [ ] SSL certificate installed
- [ ] Backups scheduled
- [ ] Monitoring set up
- [ ] Security hardened

## Support

For deployment issues:
- Check application logs: `pm2 logs`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Check system resources: `htop`
- Review this guide carefully

## Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Prisma Production Guide](https://www.prisma.io/docs/guides/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/getting-started/)
