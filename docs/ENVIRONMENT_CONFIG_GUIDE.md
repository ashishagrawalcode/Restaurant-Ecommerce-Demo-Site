# The Saffron Plate - Environment Configuration & Infrastructure Guide

This manual details the environment variable schemas, secret rotation procedures, local `.env` bootstrapping, MongoDB Atlas cluster network rules, and process manager configurations for **The Saffron Plate** restaurant platform.

---

## 1. Environment Variables Specification

The backend server loads runtime variables from environment variables or a local `.env` file in `backend/` parsed by `backend/config/env.js`.

### 1.1 Complete Variables Reference Table

| Variable Key | Type | Default Value | Production Recommended | Description & Context |
| :--- | :---: | :---: | :---: | :--- |
| `PORT` | Number | `5000` | `5000` or `8080` | Port on which the native Node.js HTTP server listens. |
| `NODE_ENV` | String | `'development'` | `'production'` | Operational environment mode. Controls error verbosity. |
| `MONGO_URI` | String | *Empty (None)* | *Valid Atlas URI* | MongoDB connection URI string including credentials and replica set parameters. |
| `DB_NAME` | String | `'saffron_plate'` | `'saffron_plate'` | Name of database namespace in MongoDB cluster. |
| `CORS_ORIGIN` | String | `'*'` | `'https://saffronplate.com'` | Permitted cross-origin origin header for production environments. |
| `SESSION_SECRET` | String | `'saffron-dev-secret'` | *Cryptographic 64-char hex* | Secret key used for signing session identifiers. |

---

## 2. Bootstrapping Local Environment (`.env`)

1. In the `backend/` directory, create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Populate the keys with your local development parameters:
   ```ini
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://saffron_admin:SecretPassword123@cluster0.mongodb.net/saffron_plate?retryWrites=true&w=majority
   ```
3. Start or restart the server:
   ```bash
   node server.js
   ```

---

## 3. MongoDB Atlas Cluster Configuration Guide

### 3.1 Network Access & IP Whitelisting
1. Log in to the [MongoDB Atlas Console](https://cloud.mongodb.com/).
2. Select your cluster and navigate to **Security** > **Network Access**.
3. For local development or dynamic IP environments, add an IP Access List Entry:
   - Select **Allow Access From Anywhere** (`0.0.0.0/0`) or add your current external IP.
   - For production, bind strictly to your VPS static elastic IP address.

### 3.2 Database User Permissions
1. Under **Security** > **Database Access**, create a dedicated user:
   - **Username**: `saffron_app_user`
   - **Authentication Method**: Password (SCRAM-SHA-256)
   - **Role**: `readWrite` on database `saffron_plate`.
2. Avoid using cluster administrator credentials (`atlasAdmin`) for standard application web connections.

---

## 4. Production Process Management with PM2

For 24/7 uptime, automated restarts on failure, and clustering, use PM2 (Process Manager 2):

### 4.1 Ecosystem Configuration (`ecosystem.config.js`)
Create `ecosystem.config.js` in the backend directory:

```javascript
module.exports = {
  apps: [
    {
      name: 'saffron-plate-server',
      script: 'server.js',
      cwd: './backend',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
```

### 4.2 PM2 Command Reference
```bash
# Start cluster with PM2
pm2 start ecosystem.config.js --env production

# View active instances and CPU / RAM consumption
pm2 status

# Inspect streaming log output
pm2 logs saffron-plate-server

# Restart with zero downtime (reload)
pm2 reload saffron-plate-server
```
