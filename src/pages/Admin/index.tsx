import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

// Hardcoded admin IDs for demo purposes
const ADMIN_IDS = ['76561198123456789'];

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Check if user is admin directly in this component
  useEffect(() => {
    // Only run this once
    if (initialized) return;

    const checkAccess = () => {
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, redirecting to login');
        navigate('/login');
        return;
      }

      // Check if user is admin
      const hasAdminAccess = ADMIN_IDS.includes(user.steamId);
      setIsAdmin(hasAdminAccess);

      if (!hasAdminAccess) {
        console.log('User not admin, redirecting to home');
        navigate('/');
        return;
      }

      setIsLoading(false);
    };

    // Short timeout to ensure auth state is fully loaded
    const timer = setTimeout(() => {
      checkAccess();
      setInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [user, isAuthenticated, navigate, initialized]);

  // Simple loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bgColor)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
      </div>
    );
  }

  // Only render admin panel if user is authenticated and has admin access
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--bgColor)] text-white flex">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin;
