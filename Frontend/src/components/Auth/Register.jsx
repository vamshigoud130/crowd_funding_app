import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import useAuthStore from '../../store/authStore';

const BLOCKED_DOMAINS = [
  'yopmail.com', 'yopmail.fr', 'yopmail.net', 'cool.fr.nf', 'jetable.org',
  'mailinator.com', 'tempmail.com', '10minutemail.com', 'sharklasers.com', 
  'guerrillamail.com', 'dispostable.com', 'getairmail.com', 'maildrop.cc', 
  'trashmail.com', 'burnermail.io', 'tempmail.net', 'example.com', 'test.com', 
  'invalid.com', 'domain.com', 'mock.com', 'spambog.com', 'mailcatch.com', 
  'mailexpire.com', 'mailness.com'
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { register, error, loading, clearError } = useAuthStore();
  const navigate = useNavigate();

  // Clear any leftover errors when this page loads
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    // Dismiss error banner as soon as user starts correcting input
    if (error) clearError();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return useAuthStore.setState({ error: "Passwords do not match" });
    }

    const emailDomain = formData.email.split('@')[1];
    if (emailDomain && BLOCKED_DOMAINS.includes(emailDomain.toLowerCase())) {
      return useAuthStore.setState({ error: "Registration with disposable or test email addresses is not allowed" });
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Join the Community</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="name"
              type="text"
              required
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500"
              placeholder="name"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500"
              placeholder="name@example.com"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500"
              placeholder="••••••••"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500"
              placeholder="••••••••"
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-red-500 text-xs italic">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition duration-150 mt-4 disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;