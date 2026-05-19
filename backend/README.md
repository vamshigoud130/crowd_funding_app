# Crowdfunding Platform Backend

A comprehensive MERN stack backend for a crowdfunding platform with advanced features like trust scoring, fraud detection, real-time updates, and analytics.

## Features

- **User Authentication & Authorization** - JWT-based auth with role-based access
- **Campaign Management** - Create, approve, and manage crowdfunding campaigns
- **Donation System** - Secure donation processing with real-time updates
- **Trust Score System** - Automated trust scoring for campaign creators
- **Fraud Detection** - AI-powered fraud detection algorithms
- **Real-time Updates** - Socket.io for live donation feeds
- **Analytics Dashboard** - Comprehensive analytics for admins and creators
- **Milestone-based Funding** - Transparent fund release system
- **Referral System** - Viral sharing with referral tracking
- **Email Notifications** - Automated email system for important events

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Media storage
- **Nodemailer** - Email service

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get single campaign
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Donations
- `POST /api/donations` - Create donation
- `GET /api/donations/campaign/:campaignId` - Get campaign donations
- `GET /api/donations/user/:userId` - Get user donations

### Admin
- `GET /api/admin/campaigns/pending` - Get pending campaigns
- `PUT /api/admin/campaigns/:id/approve` - Approve campaign
- `PUT /api/admin/campaigns/:id/reject` - Reject campaign
- `GET /api/admin/fraud-logs` - Get fraud logs

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard data
- `GET /api/analytics/campaigns/:id` - Get campaign analytics

## Database Schema

### User
- name, email, password, role, profileImage, verified
- createdCampaigns, donations, referralCode

### Campaign
- title, description, category, goalAmount, currentAmount
- deadline, creatorId, images, documents, status, trustScore
- stretchGoals, impactUnit

### Donation
- donorId, campaignId, amount, anonymous, paymentId
- referralId, message

### Milestone
- campaignId, title, amount, status, verificationDocuments

### Update
- campaignId, title, description, media

### FraudLog
- campaignId, riskScore, reasons, status

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- Role-based access control
- CORS protection
- Helmet security headers

## Real-time Features

- Live donation updates
- Campaign progress tracking
- Real-time notifications

## Deployment

The backend is designed to be deployed on:
- **Heroku** / **Railway** / **Render** for the server
- **MongoDB Atlas** for the database
- **Cloudinary** for media storage

## Environment Variables

See `.env.example` for required environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.