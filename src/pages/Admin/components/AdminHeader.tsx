import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-[var(--secondaryBgColor)] border-b border-gray-800 py-4 px-4 md:px-8 flex justify-between items-center sticky top-0 z-10">
      <div className="ml-12 md:ml-0">
        <h2 className="text-lg font-semibold">Panel Administracyjny</h2>
        <p className="text-xs text-gray-400">{new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Flaga Polski */}
        <div className="relative">
          <div className="p-2 rounded-full">
            <img src="https://flagcdn.com/w20/pl.png" alt="Flaga Polski" className="w-5 h-4" />
          </div>
        </div>
        
        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 hover:bg-gray-700 rounded-full p-1 transition-colors cursor-pointer"
          >
            <img
              src={user?.avatarUrl || 'https://via.placeholder.com/32'}
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-gray-600"
            />
            <span className="material-symbols-outlined text-lg"><i className="fa-solid fa-chevron-down"></i></span>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--bgColor)] border border-gray-700 rounded-lg shadow-xl z-50">
              <div className="p-3 border-b border-gray-700">
                <p className="font-medium">{user?.username || 'Admin'}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-800/50 transition-colors flex items-center"
              >
                <i className="fa-solid fa-right-from-bracket mr-2 text-lg"></i>
                <span>Wyloguj</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
