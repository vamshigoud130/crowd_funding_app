# CrowdFund Backend Server

This is the Node.js/Express API server for the CrowdFund platform. It handles user authentication, database operations with MongoDB, payment integration, trust scoring, fraud detection, mail distribution, and real-time updates via WebSockets.

---

## 🚀 Key Features

*   **Secure Authentication**: JWT validation with HTTPOnly cookie options and middleware-level role verification.
*   **Trust Scoring System**: Automated score generation calculating account age, campaign activity, and feedback metrics.
*   **AI-Powered Fraud Flagging**: Real-time evaluation of campaign titles and descriptions to detect patterns matching suspicious activity.
*   **Real-time Event Push**: WebSockets (Socket.io) broadcasting donation events and raising campaign funds instantly across active clients.
*   **API Security**: Features Helmet header masking, CORS setup, rate limiting, and inputs/parameters validator.
*   **Mail service**: Automated transactional emails using Nodemailer (for registering campaigns, milestone creation, etc.).

---

## 🛠️ Tech Stack

*   **Runtime & Server**: Node.js, Express.js
*   **Database**: MongoDB Atlas via Mongoose ODM
*   **Real-time Communication**: Socket.io
*   **Authentication & Hashing**: JSON Web Tokens (JWT), Bcrypt.js
*   **Cloud Storage**: Multer, Cloudinary Integration
*   **Email Notification**: Nodemailer
*   **Payments Integration**: Razorpay API

---

## ⚙️ Project Structure

```text
backend/
├── config/              # Configuration files (Database, Cloudinary, Socket)
├── controllers/         # Handler functions (Campaign, Donation, Auth, Admin)
├── middleware/          # Security, token verification, and role checks
├── models/              # MongoDB schemas (User, Campaign, Donation, FraudLog, Milestone, Update)
├── routes/              # Express API route endpoints
├── services/            # Automated services (Fraud detection, Trust score)
├── utils/               # Utility modules (Email templates)
└── server.js            # Node app entry point
```

---

## 🏃 Local Run & Install

1. Install project dependencies:
   ```bash
   npm install
   ```
2. Set up environment configuration:
   * Create a `.env` file in the root of the `backend` directory.
   * Add the following configuration variables:
     ```env
     PORT=5000
     MONGO_URI=mongodb+srv://your-mongodb-connection-uri
     JWT_SECRET=your_secret_jwt_string_key
     
     # Media files storage (Cloudinary)
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret

     # Nodemailer Config
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USER=your_gmail_address
     EMAIL_PASS=your_gmail_app_password
     ```
3. Start the dev server using nodemon:
   ```bash
   npm run dev
   ```

---

## 📡 API Routing Reference

### 👤 User Authentication
*   `POST /api/auth/register` - Create user account
*   `POST /api/auth/login` - User login
*   `POST /api/auth/logout` - Logout current session
*   `GET /api/auth/profile` - Fetch current user profile
*   `PUT /api/auth/profile` - Update user settings

### 📢 Campaigns
*   `GET /api/campaigns` - List approved campaigns (support sorting, category filtering, search)
*   `GET /api/campaigns/stats` - Public analytics (funded count, total raised, unique donors)
*   `GET /api/campaigns/:id` - Campaign by ID (includes donor counts)
*   `POST /api/campaigns` - Create a campaign (private)
*   `PUT /api/campaigns/:id` - Edit campaign info (private)
*   `DELETE /api/campaigns/:id` - Delete campaign (private)
*   `GET /api/campaigns/user/:userId` - Fetch campaigns created by user

### 💳 Donations
*   `POST /api/donations` - Record a new donation (private)
*   `GET /api/donations/campaign/:campaignId` - List donations for a campaign
*   `GET /api/donations/user/:userId` - List user's contribution history

### 🛡️ Administration (Admin Role Required)
*   `GET /api/admin/campaigns/pending` - Pending campaign queue
*   `PUT /api/admin/campaigns/:id/approve` - Approve campaign
*   `PUT /api/admin/campaigns/:id/reject` - Reject campaign
*   `GET /api/admin/fraud-logs` - View security logs
*   `GET /api/admin/users` - View all users
*   `PUT /api/admin/users/:userId/block` - Toggle account block status