# CrowdFund - Crowdfunding & Fundraising Platform

CrowdFund is a modern, premium, secure, and transparent MERN stack crowdfunding platform. It features AI-powered fraud detection, dynamic trust scoring, real-time donation notifications, milestone tracking, and user dashboards for both creators/donors and platform administrators.

---

## 🏗️ Project Architecture

The application is split into two main sections:
*   **[backend](file:///c:/Users/Aishwarya/Desktop/Crowd_Funding_App/backend)**: Node.js, Express, MongoDB/Mongoose server handling authentication, payments, analytics, trust scores, email updates, and fraud analysis.
*   **[Frontend](file:///c:/Users/Aishwarya/Desktop/Crowd_Funding_App/Frontend)**: React, Vite, Tailwind CSS application with responsive dashboards, interactive analytics, and high-fidelity layout.

---

## ⚡ Quick Start (Local Development)

To run the complete platform locally, follow these steps:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+ recommended) and [MongoDB](https://www.mongodb.com/) installed on your machine.

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   * Create a file named `.env` in the `backend` folder.
   * Define the following keys:
     ```env
     PORT=5000
     MONGO_URI=mongodb+srv://your-mongodb-uri
     JWT_SECRET=your_jwt_secret_key_here
     
     # Cloudinary Media Storage (Optional)
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret

     # Nodemailer Config (Optional)
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_email_password
     ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

---

### 3. Frontend Setup

1. Open a new terminal window and navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment configuration:
   * The client dynamically detects if you are running locally (`localhost` / `127.0.0.1`) and automatically connects to the local backend port `5000`. 
   * For production builds, it defaults to the main production API server URL.
4. Start the React/Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

---

## 📦 Directory Structure

```text
Crowd_Funding_App/
├── backend/                  # Express REST API Server & DB Models
│   ├── config/               # DB, Cloudinary & Socket.io configuration
│   ├── controllers/          # Business logic handlers (Campaigns, Auth, Admin)
│   ├── middleware/           # Auth and role verification middlewares
│   ├── models/               # MongoDB Mongoose Schemas (User, Campaign, Donation, etc.)
│   ├── routes/               # API Router endpoints
│   ├── services/             # AI Fraud logs & trust score services
│   ├── utils/                # Helper functions (emailSender)
│   └── server.js             # Main server entrypoint
│
└── Frontend/                 # React & Vite Single Page App
    ├── public/               # Static public assets
    └── src/                  
        ├── components/       # UI Components (Campaigns, Analytics, Layouts)
        ├── store/            # State stores (authStore) and Axios client
        ├── utils/            # Formatting and class utils
        ├── App.jsx           # Main React component & routes
        └── main.jsx          # App renderer entrypoint
```

---

## 🔒 User Roles & Access Control

*   **Guest / Public**: Can browse campaigns, read campaign stories, inspect milestones/donors, and view dynamic platform statistics.
*   **Donors / Creators**: Can register, login, customize profile settings, launch fundraising campaigns, post updates/milestones, donate to other campaigns, and track personal analytics.
*   **System Admin**: Accesses `/admin-dashboard` to moderate pending campaigns (Approve / Reject), view AI-flagged fraud risk alerts, block/unblock accounts, and view platform-wide financial analytics.

---

## 📈 Public & Private APIs
*   `GET /api/campaigns/stats` - Returns overall statistics (Funded campaigns, unique donors, money raised) for landing pages.
*   `GET /api/campaigns` - Gets all public approved campaigns.
*   `POST /api/campaigns` - Initiates a campaign draft (creator account required).
*   `POST /api/donations` - Processes a contribution.
*   `GET /api/analytics/dashboard` - Platform-wide financials (restricted to admins).
