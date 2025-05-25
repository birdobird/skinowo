import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

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
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.979 0C5.678 0 0.584 4.86 0.051 11.062L6.519 13.455C7.127 12.961 7.888 12.673 8.709 12.673C8.766 12.673 8.822 12.674 8.877 12.677L11.871 8.693V8.686C11.871 6.361 13.754 4.478 16.078 4.478C18.402 4.478 20.286 6.361 20.286 8.686C20.286 11.01 18.402 12.894 16.078 12.894C16.001 12.894 15.925 12.891 15.849 12.886L11.956 15.924C11.956 15.975 11.958 16.026 11.958 16.077C11.958 18.084 10.328 19.714 8.321 19.714C6.568 19.714 5.108 18.483 4.775 16.841L0.07 15.051C1.233 20.354 6.145 24.286 11.979 24.286C18.637 24.286 24.036 18.886 24.036 12.229C24.036 5.571 18.637 0.171 11.979 0.171V0ZM7.545 16.459L6.09 15.948C6.326 16.591 6.843 17.128 7.551 17.387C9.09 17.949 10.781 17.077 11.343 15.538C11.615 14.782 11.561 13.964 11.191 13.256C10.82 12.548 10.178 12.017 9.422 11.745C8.676 11.476 7.896 11.512 7.213 11.799L8.707 12.329C9.742 12.713 10.327 13.846 9.943 14.881C9.559 15.916 8.426 16.501 7.391 16.117L7.545 16.459ZM18.689 8.686C18.689 7.243 17.521 6.075 16.078 6.075C14.635 6.075 13.467 7.243 13.467 8.686C13.467 10.129 14.635 11.297 16.078 11.297C17.521 11.297 18.689 10.129 18.689 8.686ZM14.544 8.681C14.544 7.837 15.229 7.151 16.073 7.151C16.918 7.151 17.603 7.837 17.603 8.681C17.603 9.526 16.918 10.211 16.073 10.211C15.229 10.211 14.544 9.526 14.544 8.681Z" />
              </svg>
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
