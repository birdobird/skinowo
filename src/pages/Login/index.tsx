import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import steamLogo from '/src/assets/steam-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleSteamLogin = () => {
    // In a real implementation, this would redirect to Steam OpenID
    setIsLoading(true);
    
    // Simulating authentication for frontend demo purposes
    setTimeout(() => {
      // Create mock user data for demo purposes
      const mockUserData = {
        steamId: '76561198123456789',
        username: 'SteamUser123',
        avatarUrl: 'https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
        isLoggedIn: true
      };
      
      // Use the login function from AuthContext
      login(mockUserData);
      navigate('/inventory');
      setIsLoading(false);
    }, 1500);
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
          className="w-full flex items-center justify-center gap-3 bg-[#1b2838] hover:bg-[#2a3f5a] transition-colors text-white py-3 px-4 rounded-lg cursor-pointer"
        >
          {isLoading ? (
            <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
          ) : (
            <>
              <img src={steamLogo} alt="Steam Logo" className="w-6 h-6" />
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
