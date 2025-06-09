import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useLanguage } from '../context/LanguageContext';

const AuthCallback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = () => {
      try {
        // Get tokens from URL parameters
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (!accessToken || !refreshToken) {
          setError('Authentication failed: Missing tokens');
          toast.error('Authentication failed: Missing tokens');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // Extract Steam ID from JWT token (if possible)
        let steamId = '';
        try {
          const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
          steamId = tokenData.steamId || '';
        } catch (e) {
          console.warn('Could not extract Steam ID from token');
        }

        // Create a temporary user object with all required fields
        const userData = {
          steamId: steamId,
          username: `User_${steamId.substring(steamId.length - 5)}`,
          displayName: `User_${steamId.substring(steamId.length - 5)}`,
          avatarUrl: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
          isLoggedIn: true,
          tradeUrl: '',
          email: '',
          role: 'user',
          balance: 0,
          isAdmin: false,
          isVerified: false
        };

        // Store tokens and user data
        login(userData, { accessToken, refreshToken });
        
        toast.success('Login successful!');
        
        // Delay navigation to ensure tokens are saved
        setTimeout(() => {
          navigate('/');
        }, 500);
      } catch (error) {
        console.error('Error during authentication callback:', error);
        setError('Authentication failed');
        toast.error('Authentication failed');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--secondaryBgColor)]">
      <div className="text-center p-8 rounded-lg bg-[var(--bgColor)] shadow-xl">
        {error ? (
          <>
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <p className="text-gray-400">{t('loginPage.redirecting')}</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-6 text-white text-xl font-medium">{t('loginPage.authenticating')}</p>
            <p className="mt-2 text-gray-400">{t('loginPage.waiting')}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
