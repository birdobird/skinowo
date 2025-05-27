import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const AdminSidebar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Sprawdzanie, czy urządzenie jest mobilne
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Zamykanie sidebara po zmianie ścieżki na urządzeniach mobilnych
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' && !location.pathname.startsWith('/admin/');
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { path: '/admin', icon: 'fa-solid fa-gauge-high', label: 'Panel główny' },
    { path: '/admin/users', icon: 'fa-solid fa-users', label: 'Użytkownicy' },
    { path: '/admin/transactions', icon: 'fa-solid fa-receipt', label: 'Transakcje' },
    { path: '/admin/tickets', icon: 'fa-solid fa-headset', label: 'Zgłoszenia' },
  ];

  return (
    <>
      {/* Przycisk mobilnego menu */}
      {isMobile && (
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 bg-[var(--btnColor)] text-black p-2 rounded-lg shadow-lg md:hidden"
        >
          <i className={`fa-solid ${isMobileOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      )}
      
      {/* Overlay dla mobilnego menu */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
      
      <aside className={`${isMobile ? 'fixed left-0 top-0 z-50' : 'sticky top-0'} ${isMobile && !isMobileOpen ? '-translate-x-full' : 'translate-x-0'} w-64 bg-[var(--secondaryBgColor)] border-r border-gray-800 h-screen overflow-y-auto transition-all duration-300`}>
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-[var(--btnColor)]">Skinowo Admin</h1>
            <p className="text-xs text-gray-400">Panel Administracyjny</p>
          </div>
          {isMobile && (
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          )}
        </div>
        
        <nav className="mt-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className="mb-1">
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm ${
                    isActive(item.path)
                      ? 'bg-[var(--btnColor)]/10 text-[var(--btnColor)] border-l-4 border-[var(--btnColor)]'
                      : 'text-gray-300 hover:bg-gray-800/50'
                  }`}
                  onClick={() => isMobile && setIsMobileOpen(false)}
                >
                  <i className={`${item.icon} mr-3 text-xl`}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <Link
            to="/"
            className="flex items-center text-sm text-gray-400 hover:text-white"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            <span>Powrót do strony głównej</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
