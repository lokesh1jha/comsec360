# ComSec-backend

### **Complete Documentation: Deploying Node.js Application on EC2**

This guide details how to deploy a Node.js application (e.g., **ComSec360-backend**) on an AWS EC2 instance using PM2 for process management.  

---

### **Prerequisites**
- AWS account with access to an EC2 instance.
- A Node.js application ready for deployment.
- Basic knowledge of Linux commands.
- Installed software:
  - Node.js & npm
  - PM2
  - Git
  - PostgreSQL or a configured database.

---

### **Steps**

#### 1. **Launch an EC2 Instance**
1. Go to the AWS Management Console and navigate to **EC2**.
2. Click **Launch Instance**.
   - Select a **Linux AMI** (Amazon Linux, Ubuntu, etc.).
   - Choose an instance type (e.g., t2.micro for free tier).
   - Configure instance details and storage.
3. Add a security group with rules to allow:
   - HTTP/HTTPS (Ports 80/443) for web access.
   - SSH (Port 22) for server access.
4. Launch the instance and download the key pair (`.pem` file).

---

#### 2. **Connect to the Instance**
1. Open a terminal and navigate to the directory where your key pair is saved.
2. Use the following SSH command:
   ```bash
   ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
   ```

---

#### 3. **Set Up the Environment**
##### Update the System
```bash
sudo apt update && sudo apt upgrade -y
```

##### Install Node.js and npm
1. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```
2. Verify the installation:
   ```bash
   node -v
   npm -v
   ```

##### Install Git
```bash
sudo apt install git -y
```

##### Install PM2
```bash
sudo npm install -g pm2
```

---

#### 4. **Clone Your Project**
1. Navigate to a directory where you want to deploy the project:
   ```bash
   cd ~
   ```
2. Clone your repository:
   ```bash
   git clone https://github.com/your-repo-name.git
   cd your-repo-name
   ```

---

#### 5. **Install Dependencies**
1. Navigate to the project directory and install Node.js dependencies:
   ```bash
   npm install
   ```

---

#### 6. **Configure Environment Variables**
1. Create an `.env` file in the project root (if it doesn’t exist):
   ```bash
   nano .env
   ```
2. Add your environment variables:
   ```env
   NODE_ENV=production
   DATABASE_URL=your_database_url
   MAILJET_API_KEY=your_mailjet_api_key
   MAILJET_API_SECRET=your_mailjet_api_secret
   ```
3. Save the file (`CTRL + O`, `Enter`, `CTRL + X`).

---

#### 7. **Build and Start the Application**
1. Build the project (if required):
   ```bash
   npm run build
   ```
2. Start the application with PM2:
   ```bash
   pm2 start dist/index.js --name "ComSec360-backend"
   ```

---

#### 8. **Set Up PM2 to Auto-Start on Reboot**
```bash
pm2 startup
pm2 save
```

---

#### 9. **Configure Firewall and Security Group**
1. Allow inbound traffic for the application by editing the EC2 security group:
   - Add a rule for port 5000 (or the port your app runs on).
2. Open the port in the instance's firewall (if needed):
   ```bash
   sudo ufw allow 5000
   sudo ufw enable
   ```

---

#### 10. **Install and Configure NGINX (Optional)**
To serve the application on port 80 (standard HTTP), use NGINX as a reverse proxy.
1. Install NGINX:
   ```bash
   sudo apt install nginx -y
   ```
2. Configure NGINX:
   - Open the NGINX configuration file:
     ```bash
     sudo nano /etc/nginx/sites-available/default
     ```
   - Replace the contents with:
     ```nginx
     server {
         listen 80;
         server_name your-domain.com;

         location / {
             proxy_pass http://localhost:5000;
             proxy_http_version 1.1;
             proxy_set_header Upgrade $http_upgrade;
             proxy_set_header Connection 'upgrade';
             proxy_set_header Host $host;
             proxy_cache_bypass $http_upgrade;
         }
     }
     ```
   - Save the file (`CTRL + O`, `Enter`, `CTRL + X`).
3. Restart NGINX:
   ```bash
   sudo systemctl restart nginx
   ```

---

#### 11. **Monitor Logs**
Use PM2 to view application logs:
```bash
pm2 logs
```

---

#### 12. **Test the Application**
- Access the application in your browser:
  - Directly via `http://your-ec2-public-ip:5000`
  - Through your domain (if configured with NGINX): `http://your-domain.com`

---

### **Troubleshooting**
- **App crashes repeatedly:** Check PM2 logs (`pm2 logs`) for error details.
- **Environment variables not loading:** Ensure `.env` is correctly set up and used by your app.
- **Port issues:** Verify security group and firewall rules.

---

### **Conclusion**
This documentation walks you through setting up and deploying a Node.js app on AWS EC2. Your application should now be live and accessible!