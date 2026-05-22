import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Menu, X, Heart, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils';

function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Campaigns', path: '/campaigns' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Success Stories', path: '/success-stories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-500 text-white p-2 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-emerald-500/30">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              ImpactFund
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors hover:text-emerald-600',
                    isActive ? 'text-emerald-600' : 'text-gray-600'
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/donations"
              className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
            >
              Donate Now
            </NavLink>
            
            {user ? (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/create-campaign"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Start a Fundraiser
                </NavLink>
                <NavLink
                  to={user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors px-3 py-2"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/create-campaign"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Start a Fundraiser
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'text-lg font-medium py-2',
                      isActive ? 'text-emerald-600' : 'text-gray-800'
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <hr className="border-gray-100" />
              <NavLink
                to="/donations"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-emerald-600 py-2"
              >
                Donate Now
              </NavLink>
              
              {user ? (
                <>
                  <NavLink
                    to={user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-gray-800 py-2"
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="text-left text-lg font-medium text-red-500 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-2">
                  <NavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-gray-100 text-center text-gray-800 py-3 rounded-xl font-medium"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/create-campaign"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-emerald-500 text-center text-white py-3 rounded-xl font-medium"
                  >
                    Start a Fundraiser
                  </NavLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;