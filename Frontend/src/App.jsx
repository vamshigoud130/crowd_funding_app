import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './components/Layout/RootLayout';
import Home from './components/Layout/Home';
import About from './components/Layout/About';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import CampaignList from './components/Campaign/CampaignList';
import CampaignDetails from './components/Campaign/CampaignDetails'; 
import CreateCampaignPage from './components/Campaign/CreateCampaignPage';
import DonationFeed from './components/Donations/DonationFeed';
import DonationPage from './components/Donations/DonationPage';
import ContactUs from './components/Layout/ContactUs';
import AdminDashboard from './components/Analytics/AdminDashboard';
import UserDashboard from './components/Analytics/UserDashboard';
import HowItWorks from './components/Layout/HowItWorks';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "", element: <Home /> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
        { path: "about", element: <About /> },
        { path: "how-it-works", element: <HowItWorks /> },
        { path: "success-stories", element: <CampaignList /> },

        // Campaigns
        { path: "campaign", element: <CampaignList /> },
        { path: "campaigns", element: <CampaignList /> },
        { path: "campaign/:id", element: <CampaignDetails /> }, 
        { path: "create-campaign", element: <CreateCampaignPage /> },

        // Donations
        { path: "donation", element: <CampaignList /> },
        { path: "donations", element: <CampaignList /> },
        { path: "donate", element: <CampaignList /> },
        { path: "donate/:id", element: <DonationPage /> },

        // Contact
        { path: "contact", element: <ContactUs /> },

        // Dashboards
        { path: "admin-dashboard", element: <AdminDashboard /> },
        { path: "user-dashboard", element: <UserDashboard /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;