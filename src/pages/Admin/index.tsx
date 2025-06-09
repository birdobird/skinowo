import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import { toast } from 'react-toastify';

const Admin = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Check if user is admin
  useEffect(() => {
    // Only run this once or when auth state changes
    if (initialized) return;
    
    // If auth is still loading, wait
    if (isAuthLoading) {
      return;
    }
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { from: '/admin' } });
      return;
    }
    
    // If user is authenticated, check admin status
    const checkAdminStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/check-admin`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to check admin status');
        }
        
        const data = await response.json();
        
        if (!data.isAdmin) {
          toast.error('Brak uprawnień administratora');
          navigate('/');
          return;
        }
        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast.error('Błąd podczas sprawdzania uprawnień');
        navigate('/');
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };
    
    // Start checking admin status
    checkAdminStatus();
  }, [user, isAuthenticated, navigate, initialized, isAuthLoading]);

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
