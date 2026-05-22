# CrowdFund Frontend Client

This is the front-end user interface of the CrowdFund platform, built using React, Vite, and Tailwind CSS. It connects to the Express/MongoDB backend server to display dynamic campaigns, donor tracking, real-time events, and moderation control panel.

---

## 🚀 Features

*   **Premium Interactive Design**: Clean modern UI with responsive flexboxes, micro-animations via Framer Motion, and soft color gradients.
*   **Role-Based Dashboards**:
    *   **Admin Dashboard**: A secure control panel allowing system admins to approve/reject campaigns, review AI-flagged security alerts, view aggregated platform stats, and block accounts.
    *   **User Dashboard**: Custom area for campaigners to track their campaigns, manage incoming donations, post updates, and edit profile settings.
*   **Campaign Directory**: Filter and search campaigns by status, category, or title.
*   **Dynamic Client-Side Verification**: Prevents unauthorized access using React Router safeguards and automated redirection checks.
*   **State Management & Stores**: Utilizes Zustand for simple, fast, and persistent authentication state management.
*   **Responsive Charts**: Integrated Recharts to render daily donation volume and trends inside dashboards.

---

## 🛠️ Technology Stack

*   **Core**: React 19, React Router Dom v7, Vite
*   **Styling**: CSS, Tailwind CSS, Lucide React (icons)
*   **State Management**: Zustand
*   **HTTP Client**: Axios (configured with environment checking)
*   **Animations**: Framer Motion
*   **Toasts**: React Hot Toast
*   **Charts**: Recharts

---

## ⚙️ Project Structure

```text
Frontend/
├── public/                 # Static asset resources
└── src/
    ├── components/
    │   ├── Analytics/      # Admin and User Analytics dashboards
    │   ├── Campaign/       # CampaignCard, CampaignDetails, CampaignCreation, etc.
    │   ├── Layout/         # Header, Footer, Home, and About views
    │   └── Auth/           # Login & Registration views
    ├── store/
    │   ├── authStore.js    # Auth state management
    │   └── axios.js        # API endpoint auto-detection
    ├── utils/              # Class concatenation & Tailwind utils
    ├── App.jsx             # App layout & routing structure
    └── main.jsx            # Entry point for rendering to DOM
```

---

## 🏃 Run Locally

1. Install package dependencies:
   ```bash
   npm install
   ```
2. Start the development build server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## 🌐 API Endpoint Auto-Detection

The axios client configuration in [axios.js](file:///c:/Users/Aishwarya/Desktop/Crowd_Funding_App/Frontend/src/store/axios.js) is designed to dynamically resolve the server URL:
*   **Development**: Connects to `http://localhost:5000/api` if accessed via `localhost` or `127.0.0.1`.
*   **Production**: Points directly to the deployed cloud production server (Render base URL).

---

## 🔧 Build for Production

To create a minified, fully optimized production bundle inside the `/dist` folder, run:
```bash
npm run build
```
You can preview the built bundle locally using:
```bash
npm run preview
```
