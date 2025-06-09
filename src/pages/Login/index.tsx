import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { authAPI } from '../../services/api';
import { toast } from 'react-toastify';
import steamLogo from '/src/assets/steam-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/account');
    }
    
    // Check for callback from Steam
    const queryParams = new URLSearchParams(location.search);
    const steamCallback = queryParams.get('steam_callback');
    const steamData = queryParams.get('data');
    
    if (steamCallback === 'true' && steamData) {
      try {
        // Process Steam login callback
        const data = JSON.parse(atob(steamData));
        if (data.success) {
          handleLoginSuccess(data);
        } else {
          toast.error('Logowanie przez Steam nie powiodło się');
        }
      } catch (error) {
        console.error('Error processing Steam callback:', error);
        toast.error('Wystąpił błąd podczas logowania');
      }
    }
  }, [isAuthenticated, location, navigate]);

  // Handle successful login from Steam
  const handleLoginSuccess = (data: any) => {
    const userData = {
      steamId: data.user.steamId || '',
      username: data.user.username || data.user.displayName || 'User',
      displayName: data.user.displayName || data.user.username || 'User',
      avatarUrl: data.user.avatarUrl || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
      isLoggedIn: true,
      tradeUrl: data.user.tradeUrl || '',
      email: data.user.email || '',
      role: data.user.role || 'user',
      balance: data.user.balance || 0,
      isAdmin: data.user.isAdmin || false,
      isVerified: data.user.isVerified || false
    };
    
    // Use the login function from AuthContext
    login(userData, {
      accessToken: data.tokens.accessToken,
      refreshToken: data.tokens.refreshToken
    });
    
    toast.success('Zalogowano pomyślnie');
    navigate('/account');
  };

  const handleSteamLogin = async () => {
    setIsLoading(true);
    
    try {
      // Call the Steam login API to get the auth URL
      const response = await authAPI.loginWithSteam();
      
      if (response.success && response.url) {
        // Redirect to Steam login page
        window.location.href = response.url;
      } else {
        throw new Error('Failed to generate Steam login URL');
      }
    } catch (error) {
      console.error('Error initiating Steam login:', error);
      toast.error('Nie udało się zainicjować logowania przez Steam');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-md mx-auto bg-[var(--bgColor)] p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-8">{t('loginPage.title')}</h1>
        
        <div className="text-center mb-8">
          <p className="text-gray-400 mb-4">
            {t('loginPage.description')}
          </p>
        </div>
        
        <button 
          onClick={handleSteamLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-[var(--btnColor)] hover:opacity-90 transition-colors text-[var(--bgColor)] py-3 px-4 rounded-lg cursor-pointer"
        >
          {isLoading ? (
            <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
          ) : (
            <>
              <img src={steamLogo} alt="Steam Logo" className="w-6" />
              <span>{t('loginPage.loginButton')}</span>
            </>
          )}
        </button>
        
        <div className="mt-6 text-xs text-center text-gray-500">
          {t('loginPage.termsAgreement')} <a href="/terms" className="text-[var(--btnColor)] hover:underline">{t('loginPage.termsLink')}</a> {t('loginPage.and')} <a href="/terms" className="text-[var(--btnColor)] hover:underline">{t('loginPage.privacyLink')}</a>.
        </div>
      </div>
    </div>
  );
};

export default Login;
