# Team Member Responsibilities - CrowdFund Platform

---

## 📋 Executive Summary

**Project**: CrowdFund - AI-Powered Crowdfunding & Fundraising Platform  
**Tech Stack**: MERN (MongoDB, Express.js, React.js, Node.js)  
**Team Size**: 5 members  
**Deployment**: Vercel (Frontend) + Render/Railway (Backend)

---

## 👥 Team Members & Roles

### 1. **Frontend Lead - UI/UX & Components** (Member 1)

**Role Name**: Senior Frontend Developer - UI Components & Layout

**Main Responsibilities**:
- Build and maintain core UI components (Button, Card, Modal, Form)
- Create responsive page layouts for all views
- Implement CSS styling and animations using Tailwind CSS
- Design form components with validation
- Manage routing structure for public pages
- Coordinate with Backend Lead for API integration planning

**Technologies Used**:
- React.js 19.2
- Vite (build tool)
- Tailwind CSS
- React Router v7
- Lucide React (icons)
- Framer Motion (animations)

**Important Concepts**:
- Component composition and reusability
- CSS-in-JS with Tailwind utility classes
- Client-side routing
- Responsive design (mobile-first approach)
- State management patterns (lifting state up)
- Form handling and validation

**Files/Folders Handled**:
```
Frontend/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx (Navigation, Logo, User Menu)
│   │   │   ├── Footer.jsx (Links, Social Media, Info)
│   │   │   ├── RootLayout.jsx (Main layout wrapper)
│   │   │   ├── Home.jsx (Landing page hero)
│   │   │   ├── About.jsx (About section)
│   │   │   ├── HowItWorks.jsx (Platform guide)
│   │   │   └── ContactUs.jsx (Contact form)
│   │   ├── Campaign/
│   │   │   ├── CampaignCard.jsx (Card component)
│   │   │   ├── ProgressBar.jsx (Visual progress indicator)
│   │   │   ├── TrustScore.jsx (Trust score badge)
│   │   │   └── StretchGoals.jsx (Milestone visualization)
│   │   └── Donations/
│   │       ├── DonationFeed.jsx (Recent donations list)
│   │       └── ImpactDetails.jsx (Impact metrics display)
│   ├── App.jsx (Route configuration)
│   ├── App.css (Global styles)
│   └── index.css (Tailwind setup)
├── vite.config.js
├── tailwind.config.js
└── ESLint configuration
```

**How Their Work Connects**:
- ✅ Provides UI components used by Frontend Dev 2
- ✅ Works with Backend Lead on API response shape
- ✅ Coordinates with Database Dev for component data requirements
- ✅ Shares component state management patterns with Frontend Dev 2

---

### 2. **Frontend Developer - Features & State Management** (Member 2)

**Role Name**: Frontend Developer - Feature Implementation & State Management

**Main Responsibilities**:
- Implement campaign creation and management features
- Build donation flow and payment integration UI
- Create authentication pages (Login, Register)
- Implement analytics dashboards (User & Admin)
- Manage application state using Zustand
- Connect Frontend services with Backend APIs
- Handle real-time notifications (Socket.IO)

**Technologies Used**:
- React.js 19.2
- Vite
- Zustand (state management)
- Axios (HTTP requests)
- React Router v7
- React Hot Toast (notifications)
- Recharts (data visualization)
- Socket.IO Client (real-time updates)

**Important Concepts**:
- State management with Zustand stores
- API integration patterns
- Async/await and error handling
- Form submission and validation
- Real-time data updates
- User authentication flows
- Dashboard data visualization

**Files/Folders Handled**:
```
Frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx (Login form & logic)
│   │   │   └── Register.jsx (Registration form & logic)
│   │   ├── Campaign/
│   │   │   ├── CampaignList.jsx (Campaign listing page)
│   │   │   ├── CampaignDetails.jsx (Single campaign view)
│   │   │   ├── CreateCampaign.jsx (Form component)
│   │   │   ├── CreateCampaignPage.jsx (Page wrapper)
│   │   │   └── SearchBar.jsx (Campaign search logic)
│   │   ├── Donations/
│   │   │   ├── DonationPage.jsx (Donation main page)
│   │   │   └── DonationForm.jsx (Payment form integration)
│   │   └── Analytics/
│   │       ├── UserDashboard.jsx (User analytics page)
│   │       ├── AdminDashboard.jsx (Admin analytics page)
│   │       ├── Charts.jsx (Chart components)
│   │       └── StatsCard.jsx (Stats display cards)
│   ├── store/
│   │   ├── authStore.js (Auth state: user, token, login/logout)
│   │   ├── campaignStore.js (Campaign data & actions)
│   │   ├── donationStore.js (Donation state & transactions)
│   │   ├── adminStore.js (Admin-specific state)
│   │   └── analyticsStore.js (Analytics data cache)
│   ├── services/
│   │   └── donationService.js (Donation API calls)
│   ├── toast.jsx (Custom toast component)
│   ├── toast.js (Toast utility functions)
│   ├── utils.js (Utility functions)
│   ├── main.jsx (App entry point)
│   └── index.html
├── package.json
├── vercel.json (Deployment config)
└── vite.config.js
```

**How Their Work Connects**:
- ✅ Uses UI components from Frontend Lead
- ✅ Consumes APIs created by Backend Devs
- ✅ Coordinates with Backend Team on authentication flow
- ✅ Works with Backend Lead for real-time socket events
- ✅ Integrates with Database Dev for environment variables

---

### 3. **Backend Developer - APIs & Controllers** (Member 1)

**Role Name**: Senior Backend Developer - REST APIs & Business Logic

**Main Responsibilities**:
- Design and implement REST API endpoints
- Create route handlers and API documentation
- Implement business logic in controllers
- Handle payment integration (Razorpay)
- Implement fraud detection logic
- Create middleware for request processing
- Set up error handling and validation

**Technologies Used**:
- Node.js
- Express.js
- JWT Authentication
- Razorpay Payment Gateway
- Cloudinary (image storage)
- Mongoose ODM
- Express Validator
- Helmet (security)
- Express Rate Limit
- Socket.IO
- Nodemailer

**Important Concepts**:
- RESTful API design principles
- HTTP methods and status codes
- Middleware pipeline
- Request validation and sanitization
- JWT token generation and verification
- Payment gateway integration
- Fraud detection algorithms
- Email notifications
- Real-time event emission
- CORS and security headers
- Rate limiting for API protection

**Files/Folders Handled**:
```
backend/
├── routes/
│   ├── authRoutes.js (Login, Register, Logout, Password Reset)
│   ├── campaignRoutes.js (Campaign CRUD operations)
│   ├── donationRoutes.js (Donation creation, history)
│   ├── analyticsRoutes.js (Analytics data endpoints)
│   └── adminRoutes.js (Admin management endpoints)
├── controllers/
│   ├── authController.js (Auth logic, JWT handling)
│   ├── campaignController.js (Campaign operations)
│   ├── donationController.js (Donation processing)
│   ├── analyticsController.js (Analytics calculations)
│   └── adminController.js (Admin operations)
├── middleware/
│   ├── authMiddleware.js (JWT verification)
│   ├── adminMiddleware.js (Role-based access control)
│   └── errorMiddleware.js (Global error handler)
├── services/
│   ├── fraudDetectionService.js (Fraud scoring)
│   ├── trustScoreService.js (Trust calculation)
│   ├── recommendationService.js (Campaign recommendations)
│   └── analyticsService.js (Analytics aggregation)
├── utils/
│   ├── emailSender.js (Email sending logic)
│   ├── referralGenerator.js (Referral code generation)
│   └── validators.js (Input validation rules)
├── server.js (Express app setup)
├── package.json
└── req.http (API testing file)
```

**How Their Work Connects**:
- ✅ Provides APIs consumed by Frontend Dev 2
- ✅ Works with Backend Dev 2 on authentication and database models
- ✅ Coordinates with Database Dev on MongoDB schema
- ✅ Emits Socket.IO events for Frontend real-time updates
- ✅ Integrates with payment gateway (connects to donation flow)

---

### 4. **Backend Developer - Database & Authentication** (Member 2)

**Role Name**: Backend Developer - Database Models & Authentication

**Main Responsibilities**:
- Design and implement MongoDB schema and models
- Create database connection and configuration
- Implement JWT authentication strategy
- Build user registration and password hashing
- Handle database queries and optimizations
- Manage data relationships and validations
- Create database migration strategies
- Implement data indexing for performance

**Technologies Used**:
- Node.js
- Express.js
- MongoDB
- Mongoose (ODM)
- JWT (JSON Web Tokens)
- Bcryptjs (password hashing)
- Socket.IO
- Nodemailer
- Environment variables (dotenv)

**Important Concepts**:
- Database schema design
- Data relationships (One-to-Many, Many-to-Many)
- Password hashing and security
- JWT tokens (generation, verification, refresh)
- Data validation at model level
- Database indexing for queries
- Transaction handling
- Data consistency and integrity
- User roles and permissions
- Session management

**Files/Folders Handled**:
```
backend/
├── models/
│   ├── User.js (User schema: email, password, profile, role)
│   ├── Campaign.js (Campaign schema: title, description, goals)
│   ├── Donation.js (Donation schema: amount, campaign, user)
│   ├── Update.js (Campaign updates: milestones, news)
│   ├── Milestone.js (Stretch goals and achievements)
│   └── FraudLog.js (Fraud detection records)
├── config/
│   ├── db.js (MongoDB connection setup)
│   ├── cloudinary.js (Cloudinary configuration)
│   ├── razorpay.js (Razorpay payment setup)
│   └── socket.js (Socket.IO configuration)
├── middleware/
│   ├── authMiddleware.js (Token verification)
│   ├── adminMiddleware.js (Role validation)
│   └── errorMiddleware.js (Error handling)
├── controllers/
│   └── authController.js (User auth operations)
├── services/
│   └── trustScoreService.js (Trust calculations)
├── utils/
│   └── emailSender.js (Email notifications)
├── .env (Environment variables)
└── server.js (App initialization)
```

**How Their Work Connects**:
- ✅ Provides database models used by Backend Dev 1
- ✅ Implements authentication middleware used by all routes
- ✅ Works with Backend Dev 1 on API contracts
- ✅ Coordinates with Database + Deployment Dev on data requirements
- ✅ Shares JWT strategy with Frontend Dev 2 for token storage

---

### 5. **Database & Deployment Engineer** (Member 1)

**Role Name**: Full-Stack DevOps & Database Architect

**Main Responsibilities**:
- Set up and configure MongoDB database
- Create and manage database backups
- Design database performance optimizations
- Deploy Frontend to Vercel
- Deploy Backend to Render/Railway
- Manage environment variables and secrets
- Set up GitHub repository and CI/CD
- Configure CORS and API endpoints
- Monitor application performance
- Handle production database migrations
- Manage API keys and third-party integrations
- Create deployment documentation
- Set up monitoring and logging

**Technologies Used**:
- MongoDB Atlas
- Mongoose (ODM)
- Vercel (Frontend deployment)
- Render/Railway (Backend deployment)
- GitHub (Version control)
- Environment variables (dotenv)
- Cloudinary API
- Razorpay API
- Nodemailer configuration
- Socket.IO production setup
- Database indexing and optimization

**Important Concepts**:
- Database schema optimization
- Index design for query performance
- Connection pooling
- Database replication and backups
- API endpoint configuration
- Environment-based configuration
- Secrets management
- CORS policy setup
- Deployment strategies
- Continuous Integration/Deployment
- Performance monitoring
- Error logging and debugging
- API rate limiting setup
- SSL/TLS certificates
- Domain and DNS configuration

**Files/Folders Handled**:
```
backend/
├── config/
│   ├── db.js (MongoDB URI connection)
│   ├── cloudinary.js (Media API keys)
│   ├── razorpay.js (Payment gateway keys)
│   └── socket.js (Real-time server setup)
├── .env (All environment variables)
├── .env.example (Template for env variables)
├── .gitignore (Git ignore rules)
├── server.js (Server startup configuration)
├── package.json (Dependencies management)
└── api-tests.http.env.json (API test configuration)

Frontend/
├── vercel.json (Vercel deployment config)
├── vite.config.js (Build configuration)
├── .env.production (Production environment)
├── .env.development (Development environment)
└── package.json

Root/
├── .git/ (Repository setup)
├── .gitignore
├── README.md (Project documentation)
├── TEAM_RESPONSIBILITIES.md (This file)
├── DEPLOYMENT_GUIDE.md (Deployment instructions)
├── API_DOCUMENTATION.md (API endpoints reference)
└── ARCHITECTURE.md (System design document)
```

**How Their Work Connects**:
- ✅ Provides MongoDB setup for Backend Devs
- ✅ Deploys code pushed by all team members
- ✅ Configures environment variables for Frontend & Backend
- ✅ Sets up authentication keys for payment gateway integration
- ✅ Monitors production issues and logs
- ✅ Ensures Frontend-Backend integration works correctly

---

## 📁 Complete File/Folder Allocation Matrix

| Folder/File | Lead | Backend 1 | Backend 2 | Frontend 1 | Frontend 2 | DB+Deploy |
|---|---|---|---|---|---|---|
| **Backend Routes** | — | ✅ Primary | ⚠️ Auth routes | — | — | — |
| **Backend Controllers** | — | ✅ Primary | ⚠️ Auth controller | — | — | — |
| **Backend Models** | — | ⚠️ Uses | ✅ Primary | — | — | — |
| **Backend Middleware** | — | ✅ Primary | ⚠️ Auth | — | — | — |
| **Backend Services** | — | ✅ Fraud, Analytics | ⚠️ Trust Score | — | — | — |
| **Backend Config** | — | — | — | — | — | ✅ Primary |
| **Frontend Components Layout** | ✅ Primary | — | — | — | — | — |
| **Frontend Components Campaign** | ⚠️ Cards/UI | — | — | — | ✅ List/Details/Create | — |
| **Frontend Components Auth** | — | — | — | — | ✅ Primary | — |
| **Frontend Components Analytics** | — | — | — | — | ✅ Primary | — |
| **Frontend Store** | — | — | — | — | ✅ Primary | — |
| **Frontend Services** | — | — | — | — | ✅ Primary | — |
| **Environment Variables** | — | — | — | — | — | ✅ Primary |
| **Deployment Configs** | — | — | — | — | — | ✅ Primary |
| **Database Backups** | — | — | — | — | — | ✅ Primary |

---

## 🔄 API Flow Explanation

### **1. Complete Request-Response Cycle**

```
┌─────────────────────────────────────────────────────────────────┐
│                    REQUEST FLOW (Client → Server)                │
└─────────────────────────────────────────────────────────────────┘

1. USER ACTION (Frontend)
   └─> User clicks button or submits form
   └─> React component triggers action

2. STATE UPDATE (Frontend - State Management)
   └─> Zustand store dispatches action
   └─> Store updates local state optimistically
   └─> UI re-renders with loading state

3. API REQUEST (Frontend - Service Layer)
   └─> Axios sends HTTP request to Backend
   └─> Includes JWT token in Authorization header
   └─> Request format: POST /api/endpoint
   └─> Request body: JSON data

4. BACKEND RECEIVES (Express Server)
   └─> Express router matches the URL path
   └─> Request passes through middleware pipeline:
       ├─ bodyParser (parse JSON)
       ├─ corsHandler (verify origin)
       ├─ authMiddleware (verify JWT token)
       └─ adminMiddleware (check permissions if needed)

5. CONTROLLER LOGIC (Backend Business Logic)
   └─> Controller receives req, res objects
   └─> Extracts data from req.body, req.params
   └─> Calls business logic services
   └─> May call external APIs (Razorpay, Cloudinary)

6. DATABASE OPERATIONS (MongoDB)
   └─> Mongoose models query/insert/update data
   └─> Example: Campaign.findById(campaignId)
   └─> Data validated against schema
   └─> Database returns data or errors

7. SERVICE LAYER (Backend Services)
   └─> Calculate trust score from user history
   └─> Run fraud detection algorithms
   └─> Generate recommendations
   └─> Format response data

8. RESPONSE SENT (Backend → Frontend)
   └─> Controller sends JSON response
   └─> HTTP Status: 200 (success), 400 (error), 401 (auth), 500 (server)
   └─> Response includes data or error message

9. RESPONSE RECEIVED (Frontend)
   └─> Axios interceptors check response status
   └─> Success: Update Zustand store with data
   └─> Error: Show toast notification to user

10. UI UPDATE (Frontend)
    └─> React components re-render with new data
    └─> User sees loading state removed
    └─> Displays success message or error message
```

---

### **2. Authentication Flow Example**

```
REGISTRATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. User fills registration form on Frontend (Email, Name, Password)
   │
2. Frontend submits to: POST /api/auth/register
   ├─ Body: { email, name, password }
   │
3. Backend authController.registerUser()
   ├─ Validates input (email format, password strength)
   ├─ Checks if user already exists in User model
   ├─ Hashes password using bcryptjs
   ├─ Creates new User document in MongoDB
   │
4. Response: { token, user: { id, email, name } }
   │
5. Frontend stores token in localStorage
   ├─ Updates authStore with user info
   ├─ Redirects to dashboard
   │
6. All future requests include: Authorization: Bearer {token}


LOGIN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. User enters email and password
   │
2. Frontend submits to: POST /api/auth/login
   ├─ Body: { email, password }
   │
3. Backend authController.loginUser()
   ├─ Finds user by email in MongoDB
   ├─ Compares hashed password using bcryptjs
   ├─ If match, generates JWT token
   │
4. Response: { token, user: { id, email, name, role } }
   │
5. Frontend stores token and user data
   ├─ AuthStore sets authenticated = true
   │
6. Protected routes now accessible with valid token


PROTECTED REQUEST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Frontend makes request: GET /api/campaigns
   ├─ Header: { Authorization: Bearer {token} }
   │
2. Backend receives request
   ├─ authMiddleware extracts token from header
   ├─ Verifies token signature using JWT_SECRET
   ├─ Extracts user ID from token payload
   ├─ Attaches user to req.user
   │
3. If invalid/expired:
   ├─ Response: 401 Unauthorized
   ├─ Frontend removes token from localStorage
   ├─ Redirects to login page
   │
4. If valid:
   ├─ Request proceeds to controller
   ├─ Controller accesses req.user for user context
```

---

### **3. Campaign Creation & Donation Flow**

```
CAMPAIGN CREATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Frontend:
  User fills form → CampaignStore.createCampaign() → POST /api/campaigns/create

Backend:
  1. authMiddleware verifies creator is logged in
  2. campaignController.createCampaign():
     ├─ Validates campaign data
     ├─ Calculates initial trust score (via trustScoreService)
     ├─ Creates Campaign document in MongoDB
     ├─ Stores campaign with: title, description, goal, creator_id, images
  3. Response: { campaignId, campaign data }

Frontend:
  - CampaignStore updates with new campaign
  - User redirected to campaign detail page
  - Toast shows "Campaign created successfully"


DONATION PROCESS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. FRONTEND - Donation Form
   User selects amount → DonationForm.jsx
   ├─ Shows donation preview
   └─ Clicks "Donate Now"

2. FRONTEND - Payment Gateway
   POST /api/donations/create-order
   ├─ Body: { campaignId, amount }
   ├─ DonationStore triggers loading state

3. BACKEND - Order Creation
   donationController.createOrder()
   ├─ Validates campaign exists and is active
   ├─ Calls Razorpay API to create order
   ├─ Order created in MongoDB Donation collection (status: pending)
   ├─ Response: { orderId, amount, currency }

4. FRONTEND - Razorpay Integration
   Opens Razorpay payment modal
   ├─ User enters payment details
   ├─ Razorpay processes payment
   ├─ Returns: paymentId, signature

5. FRONTEND - Payment Verification
   POST /api/donations/verify-payment
   ├─ Body: { orderId, paymentId, signature }

6. BACKEND - Signature Verification
   donationController.verifyPayment()
   ├─ Verifies Razorpay signature (security check)
   ├─ If valid:
   │   ├─ Marks Donation as "completed"
   │   ├─ Updates Campaign.totalRaised
   │   ├─ Calculates new trust score (fruad detection)
   │   ├─ Sends confirmation email
   │   ├─ Emits Socket.IO event for real-time updates
   │   └─ Response: { success: true, donation }
   └─ If invalid: Response: { success: false, error }

7. FRONTEND - Success Handler
   ├─ Stores donation in donationStore
   ├─ Shows success toast message
   ├─ Updates campaign progress bar
   ├─ Emits Socket.IO listener for real-time donation feed

8. DATABASE - Data Persistence
   MongoDB stores:
   ├─ Donation document (campaignId, donorId, amount, timestamp)
   ├─ Updated Campaign totals
   ├─ FraudLog entry if suspicious
   └─ User trust score update


REAL-TIME UPDATES (Socket.IO):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Backend emits: socket.emit('newDonation', donationData)
2. Frontend listeners (in DonationFeed.jsx):
   ├─ Listen for 'newDonation' event
   ├─ Add donation to feed in real-time
   ├─ Update campaign raised amount
   ├─ Show toast notification
```

---

### **4. Analytics Dashboard Flow**

```
ADMIN ANALYTICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Admin navigates to Dashboard
   └─> Frontend: AdminDashboard.jsx

2. Component mounts:
   ├─ analyticsStore.fetchDashboardData()
   ├─ POST /api/analytics/dashboard
   │   └─ Requires: adminMiddleware (role check)

3. Backend analyticsController.getDashboardData():
   ├─ analyticsService.getTotalUsers()
   │   └─ User.countDocuments()
   ├─ analyticsService.getTotalCampaigns()
   │   └─ Campaign.countDocuments()
   ├─ analyticsService.getTotalDonations()
   │   └─ Donation.aggregate() [sum amounts]
   ├─ analyticsService.getFraudMetrics()
   │   └─ FraudLog analysis
   └─ Response: { users, campaigns, donations, fraud }

4. Frontend:
   ├─ analyticsStore updates with data
   ├─ Charts.jsx renders data using Recharts
   ├─ StatsCard.jsx displays key metrics
   └─ AdminDashboard re-renders

5. Real-time updates via Socket.IO:
   ├─ Backend emits hourly: socket.emit('analyticsUpdate')
   ├─ Frontend updates without page refresh
```

---

### **5. Request Headers & Response Format**

```
REQUEST EXAMPLE:
┌─────────────────────────────────────────────────────────┐
│ POST /api/donations/create                              │
│ Host: https://crowdfund-backend.render.com              │
│ Content-Type: application/json                          │
│ Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │
│ CORS-Origin: https://crowdfund.vercel.app               │
│                                                          │
│ {                                                        │
│   "campaignId": "507f1f77bcf86cd799439011",            │
│   "amount": 5000,                                       │
│   "message": "Great project!"                           │
│ }                                                        │
└─────────────────────────────────────────────────────────┘


RESPONSE EXAMPLE (SUCCESS):
┌─────────────────────────────────────────────────────────┐
│ HTTP/1.1 200 OK                                         │
│ Content-Type: application/json                          │
│ Set-Cookie: token=xyz; HttpOnly; Secure;               │
│                                                          │
│ {                                                        │
│   "success": true,                                      │
│   "message": "Donation created successfully",           │
│   "data": {                                             │
│     "_id": "507f1f77bcf86cd799439012",                 │
│     "campaignId": "507f1f77bcf86cd799439011",          │
│     "donorId": "507f1f77bcf86cd799439010",             │
│     "amount": 5000,                                     │
│     "status": "completed",                              │
│     "timestamp": "2026-05-26T10:30:00Z"                │
│   }                                                      │
│ }                                                        │
└─────────────────────────────────────────────────────────┘


RESPONSE EXAMPLE (ERROR):
┌─────────────────────────────────────────────────────────┐
│ HTTP/1.1 400 Bad Request                                │
│ Content-Type: application/json                          │
│                                                          │
│ {                                                        │
│   "success": false,                                     │
│   "message": "Invalid campaign ID",                     │
│   "error": "Campaign not found"                         │
│ }                                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🔗 Team Communication & Handoffs

### **Frontend ↔ Backend**

| Interaction | Frontend Responsibility | Backend Responsibility |
|---|---|---|
| **API Contract** | Define data structure needed | Implement endpoint to return exact format |
| **Authentication** | Store JWT tokens securely | Generate and validate tokens |
| **Error Handling** | Display user-friendly error messages | Return meaningful error codes & messages |
| **Loading States** | Show spinners/skeletons | Ensure endpoints respond quickly |
| **Real-time Updates** | Listen to Socket.IO events | Emit events when data changes |

### **Backend ↔ Database**

| Interaction | Backend Responsibility | Database Responsibility |
|---|---|---|
| **Schema Design** | Communicate data needs | Provide optimized schema design |
| **Queries** | Write Mongoose queries | Ensure indexes are created for performance |
| **Migrations** | Implement schema changes | Backup and restore data safely |
| **Performance** | Monitor slow queries | Optimize indexes and aggregations |

### **Frontend/Backend ↔ Deployment**

| Interaction | Frontend/Backend Responsibility | Deployment Responsibility |
|---|---|---|
| **Environment Variables** | Request and use env vars | Provide secure secret management |
| **Deployment** | Push code to git | Pull code and deploy to production |
| **Monitoring** | Report bugs and issues | Monitor logs and error tracking |
| **Scaling** | Identify performance bottlenecks | Increase resources and optimize |

---

## 📊 Development Workflow

```
WEEK PLANNING:
├─ Frontend 1 & 2 plan UI/feature priorities
├─ Backend 1 & 2 design new API endpoints
├─ Database + Deploy ensures infrastructure ready

TASK ASSIGNMENT:
├─ Frontend 1: "Build Campaign Card component"
├─ Frontend 2: "Implement campaign listing page"
├─ Backend 1: "Create GET /api/campaigns endpoint"
├─ Backend 2: "Add Campaign model validations"
└─ DB+Deploy: "Add database indexes for campaigns"

CODE IMPLEMENTATION:
├─ Frontend 1 creates reusable components
├─ Backend 1 implements API routes and controllers
├─ Backend 2 ensures database models are optimized
├─ Frontend 2 integrates backend APIs into UI
└─ All follow .gitignore and environment setup from DB+Deploy

CODE REVIEW:
├─ Frontend Lead reviews Frontend Dev 2's feature code
├─ Backend Lead reviews Backend Dev 2's model code
├─ Database+Deploy reviews deployment configs
└─ All check for: security, performance, code style

TESTING:
├─ Frontend: Manual testing in browser + browser DevTools
├─ Backend: API testing using Postman/req.http
├─ Database: Data integrity and query performance
├─ Integration: Frontend-Backend data flow

DEPLOYMENT:
├─ Git commit and push code
├─ Database+Deploy runs CI/CD pipeline
├─ Frontend deployed to Vercel
├─ Backend deployed to Render/Railway
├─ Verify production environment works
```

---

## 🎯 Success Metrics & Milestones

### **Frontend Team**
- ✅ All pages responsive on mobile/tablet/desktop
- ✅ <3s initial page load time
- ✅ All forms validated and accessible
- ✅ Real-time updates working smoothly

### **Backend Team**
- ✅ All APIs return correct data format
- ✅ Authentication/authorization working securely
- ✅ Payment integration processing correctly
- ✅ Error handling with meaningful messages

### **Database & Deployment**
- ✅ Database backups automated and tested
- ✅ Environment variables secure and managed
- ✅ Deployment process documented and automated
- ✅ Production monitoring and logging in place

---

## 📞 Quick Contact & Escalation

```
ISSUE RESOLUTION FLOW:

If Frontend breaks:
└─> Frontend Lead > Backend Lead (if API issue) > Database+Deploy (if deployment)

If Payment fails:
└─> Backend Lead (payment logic) > Backend Dev 2 (database) > Database+Deploy (Razorpay config)

If Database is slow:
└─> Database+Deploy (query optimization)

If Deployment fails:
└─> Database+Deploy (only point of contact)

If Authentication issues:
└─> Backend Dev 2 (JWT/password handling)
```

---

## 📝 Documentation Requirements

Each team member should maintain:

1. **Frontend Team**: 
   - Component documentation (props, usage examples)
   - Store structure and actions
   - API service documentation

2. **Backend Team**:
   - API endpoint documentation (requests, responses)
   - Controller and service logic explanation
   - Database relationship diagrams

3. **Database + Deployment**:
   - Environment variable setup guide
   - Database connection instructions
   - Deployment procedures and troubleshooting
   - Monitoring and alerting documentation

---

**Document Version**: 1.0  
**Last Updated**: May 26, 2026  
**Next Review**: June 26, 2026
