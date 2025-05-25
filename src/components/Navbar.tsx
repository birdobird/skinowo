import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import skinowoLogo from '/src/assets/skinowologo.png';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  

  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 ${scrolled ? 'bg-[var(--bgColor)]/95 backdrop-blur-sm shadow-lg' : 'bg-[var(--bgColor)]'} text-white py-4 transition-all duration-300`}>
        <div className="container mx-auto flex justify-between items-center px-8">
        <div className="flex items-center space-x-12">
          <Link to="/" className="text-xl font-bold text-white"><img src={skinowoLogo} alt="Skinowo Logo" className="w-32" /></Link>

          <div className="hidden md:flex space-x-8">
            <div className="relative group">
              <Link 
                to="/" 
                className={`uppercase font-medium text-xxs transition-colors text-[#585858] duration-300 ${isActive('/') ? 'text-[var(--fontColor)]' : 'hover:text-[var(--fontColor)]'}`}
              >
                {t('navHome')}
              </Link>
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-[var(--btnColor)] transform origin-left transition-transform duration-300 ${isActive('/') ? 'scale-x-80' : 'scale-x-0 group-hover:scale-x-80'}`}></div>
            </div>
            <div className="relative group">
              <Link 
                to="/calculator" 
                className={`uppercase font-medium text-xxs transition-colors text-[#585858] duration-300 ${isActive('/calculator') ? 'text-[var(--fontColor)]' : 'hover:text-[var(--fontColor)]'}`}
              >
                {t('calculator')}
              </Link>
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-[var(--btnColor)] transform origin-left transition-transform duration-300 ${isActive('/calculator') ? 'scale-x-80' : 'scale-x-0 group-hover:scale-x-80'}`}></div>
            </div>
            <div className="relative group">
              <Link 
                to="/how-it-works" 
                className={`uppercase font-medium text-xxs transition-colors text-[#585858] duration-300 ${isActive('/how-it-works') ? 'text-[var(--fontColor)]' : 'hover:text-[var(--fontColor)]'}`}
              >
                {t('howItWorks')}
              </Link>
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-[var(--btnColor)] transform origin-left transition-transform duration-300 ${isActive('/how-it-works') ? 'scale-x-80' : 'scale-x-0 group-hover:scale-x-80'}`}></div>
            </div>
            <div className="relative group">
              <Link 
                to="/support" 
                className={`uppercase font-medium text-xxs transition-colors text-[#585858] duration-300 ${isActive('/support') ? 'text-[var(--fontColor)]' : 'hover:text-[var(--fontColor)]'}`}
              >
                {t('support')}
              </Link>
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-[var(--btnColor)] transform origin-left transition-transform duration-300 ${isActive('/support') ? 'scale-x-80' : 'scale-x-0 group-hover:scale-x-80'}`}></div>
            </div>
            {user && (
              <div className="relative group">
                <Link 
                  to="/inventory" 
                  className={`uppercase font-medium text-xxs transition-colors text-[#585858] duration-300 ${isActive('/inventory') ? 'text-[var(--fontColor)]' : 'hover:text-[var(--fontColor)]'}`}
                >
                  {t('inventory')}
                </Link>
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-[var(--btnColor)] transform origin-left transition-transform duration-300 ${isActive('/inventory') ? 'scale-x-80' : 'scale-x-0 group-hover:scale-x-80'}`}></div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Przełącznik języka - wersja desktopowa */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 hover:bg-white/5 rounded-full p-1 px-2 transition-colors cursor-pointer text-sm"
            >
              {language === 'pl' ? (
                <img src="https://flagcdn.com/w20/pl.png" alt="Polish flag" className="w-6 h-4 rounded-sm" />
              ) : (
                <img src="https://flagcdn.com/w20/gb.png" alt="English flag" className="w-6 h-4 rounded-sm" />
              )}
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-[var(--bgColor)] border border-gray-700 rounded-lg shadow-xl z-50">
                <button
                  onClick={() => {
                    setLanguage('pl');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 cursor-pointer transition-colors flex items-center gap-2 ${language === 'pl' ? 'text-[var(--btnColor)]' : ''}`}
                >
                  <img src="https://flagcdn.com/w20/pl.png" alt="English flag" className="w-5 h-4 mr-2" />
                  {t('polish')}
                </button>
                <button
                  onClick={() => {
                    setLanguage('en');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 cursor-pointer transition-colors flex items-center gap-2 ${language === 'en' ? 'text-[var(--btnColor)]' : ''}`}
                >
                  <img src="https://flagcdn.com/w20/gb.png" alt="English flag" className="w-5 h-4 mr-2" />
                  {t('english')}
                </button>
              </div>
            )}
          </div>
          
          <div className="hidden md:block">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:bg-white/5 rounded-full p-1 pr-3 transition-colors cursor-pointer"
                >
                  <img 
                    src={user.avatarUrl} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full border border-[var(--btnColor)]" 
                  />
                  <span className="text-sm font-medium">{user.username}</span>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[var(--bgColor)] border border-gray-700 rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b border-gray-700">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-gray-400">Steam ID: {user.steamId}</p>
                    </div>
                    <Link 
                      to="/inventory"
                      className="block px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {t('myInventory')}
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-[var(--btnColor)] hover:bg-[var(--btnColor)/8] transition-colors flex items-center gap-2 text-[var(--bgColor)] px-4 py-2 uppercase text-xs font-semibold rounded-full cursor-pointer">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="var(--bgColor)"/>
                  <path d="M16.5 13C15.67 13 15 12.33 15 11.5C15 10.67 15.67 10 16.5 10C17.33 10 18 10.67 18 11.5C18 12.33 17.33 13 16.5 13Z" fill="white"/>
                  <path d="M9 16C7.9 16 7 15.1 7 14C7 12.9 7.9 12 9 12C10.1 12 11 12.9 11 14C11 15.1 10.1 16 9 16Z" fill="white"/>
                </svg>
                  Zaloguj na Steam
                </button>
              </Link>
            )}
          </div>
          
          <div className="md:hidden">
            <button
              className="flex justify-center items-center w-10 h-10 rounded-md hover:bg-gray-800 focus:outline-none z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu mobilne"
            >
              <div className="w-7 h-5 relative">
                <span 
                  className={`absolute h-0.5 w-full bg-white rounded-full transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}
                  style={{ top: '0' }}
                />
                <span 
                  className={`absolute h-0.5 w-full bg-white rounded-full transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
                  style={{ top: '50%', marginTop: '-1px' }}
                />
                <span 
                  className={`absolute h-0.5 w-full bg-white rounded-full transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}
                  style={{ bottom: '0' }}
                />
              </div>
            </button>
          </div>
        </div>
        </div>
      </nav>
      
      <div 
        className={`fixed inset-y-0 right-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ top: '64px' }}
      >
        <div className="bg-[var(--bgColor)] h-full max-h-[calc(100vh-64px)] overflow-y-auto pb-12 px-4 shadow-lg border-l border-gray-800">
          {user && (
            <div className="pt-5 pb-4 border-b border-gray-800">
              <div className="flex items-center px-2 py-2">
                <img 
                  src={user.avatarUrl} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full border border-[var(--btnColor)]" 
                />
                <div className="ml-3">
                  <p className="text-base font-medium text-white">{user.username}</p>
                  <p className="text-xs text-gray-400">Steam ID: {user.steamId}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-4 pb-6 space-y-1">
            {/* Przełącznik języka - wersja mobilna */}
            <div className="mb-4 border-b border-gray-800 pb-4">
              <p className="text-xs text-gray-400 mb-2 px-4">{t('selectLanguage')}:</p>
              <div className="flex gap-2 px-4">
                <button
                  onClick={() => setLanguage('pl')}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${language === 'pl' ? 'bg-[var(--btnColor)]/20 text-[var(--btnColor)] border border-[var(--btnColor)]/30' : 'text-white bg-gray-800/50 hover:bg-gray-800'}`}
                >
                  <img src="https://flagcdn.com/w20/pl.png" alt="Polish flag" className="w-5 h-4 mr-2" />
                  {t('polish')}
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${language === 'en' ? 'bg-[var(--btnColor)]/20 text-[var(--btnColor)] border border-[var(--btnColor)]/30' : 'text-white bg-gray-800/50 hover:bg-gray-800'}`}
                >
                  <img src="https://flagcdn.com/w20/gb.png" alt="English flag" className="w-5 h-4 mr-2" />
                  {t('english')}
                </button>
              </div>
            </div>
            
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive('/') ? 'bg-[var(--btnColor)]/20 text-[var(--btnColor)]' : 'text-white hover:bg-gray-800'}`}
            >
              {t('navHome')}
            </Link>
            <Link 
              to="/calculator" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive('/calculator') ? 'bg-[var(--btnColor)]/20 text-[var(--btnColor)]' : 'text-white hover:bg-gray-800'}`}
            >
              {t('calculator')}
            </Link>
            <Link 
              to="/how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive('/how-it-works') ? 'bg-[var(--btnColor)]/20 text-[var(--btnColor)]' : 'text-white hover:bg-gray-800'}`}
            >
              {t('howItWorks')}
            </Link>
            <Link 
              to="/support" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive('/support') ? 'bg-[var(--btnColor)]/20 text-[var(--btnColor)]' : 'text-white hover:bg-gray-800'}`}
            >
              {t('support')}
            </Link>
            {user && (
              <Link 
                to="/inventory" 
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive('/inventory') ? 'bg-[var(--btnColor)]/20 text-[var(--btnColor)]' : 'text-white hover:bg-gray-800'}`}
              >
                {t('inventory')}
              </Link>
            )}
          </div>
          
          {user ? (
            <div className="border-t border-gray-800 pt-4">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-red-500/20 hover:bg-red-500/30 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t('logout')}
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-800 pt-4">
              <Link 
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 text-center px-4 py-3 rounded-lg text-base font-medium bg-[#1b2838] hover:bg-[#2a3f5a] text-white hover:opacity-90"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.979 0C5.678 0 0.584 4.86 0.051 11.062L6.519 13.455C7.127 12.961 7.888 12.673 8.709 12.673C8.766 12.673 8.822 12.674 8.877 12.677L11.871 8.693V8.686C11.871 6.361 13.754 4.478 16.078 4.478C18.402 4.478 20.286 6.361 20.286 8.686C20.286 11.01 18.402 12.894 16.078 12.894C16.001 12.894 15.925 12.891 15.849 12.886L11.956 15.924C11.956 15.975 11.958 16.026 11.958 16.077C11.958 18.084 10.328 19.714 8.321 19.714C6.568 19.714 5.108 18.483 4.775 16.841L0.07 15.051C1.233 20.354 6.145 24.286 11.979 24.286C18.637 24.286 24.036 18.886 24.036 12.229C24.036 5.571 18.637 0.171 11.979 0.171V0ZM7.545 16.459L6.09 15.948C6.326 16.591 6.843 17.128 7.551 17.387C9.09 17.949 10.781 17.077 11.343 15.538C11.615 14.782 11.561 13.964 11.191 13.256C10.82 12.548 10.178 12.017 9.422 11.745C8.676 11.476 7.896 11.512 7.213 11.799L8.707 12.329C9.742 12.713 10.327 13.846 9.943 14.881C9.559 15.916 8.426 16.501 7.391 16.117L7.545 16.459ZM18.689 8.686C18.689 7.243 17.521 6.075 16.078 6.075C14.635 6.075 13.467 7.243 13.467 8.686C13.467 10.129 14.635 11.297 16.078 11.297C17.521 11.297 18.689 10.129 18.689 8.686ZM14.544 8.681C14.544 7.837 15.229 7.151 16.073 7.151C16.918 7.151 17.603 7.837 17.603 8.681C17.603 9.526 16.918 10.211 16.073 10.211C15.229 10.211 14.544 9.526 14.544 8.681Z" />
                </svg>
                {t('loginSteam')}
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30" 
          style={{ top: '64px' }}
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
      <div className="pt-16"></div>
    </>
  );
};

export default Navbar;
