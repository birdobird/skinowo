import { Link, useLocation } from 'react-router-dom';
import skinowoLogo from '/src/assets/skinowologo.png';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-[var(--bgColor)] text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-12">
          <Link to="/" className="text-xl font-bold text-white"><img src={skinowoLogo} alt="Skinowo Logo" className="w-32" /></Link>
          
          <div className="flex space-x-8">
            <div className="relative group">
              <Link 
                to="/" 
                className={`uppercase font-medium text-xxs transition-colors text-[#585858] duration-300 ${isActive('/') ? 'text-[var(--fontColor)]' : 'hover:text-[var(--fontColor)]'}`}
              >
                Sprzedaj swoje skiny z CS2
              </Link>
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-[var(--btnColor)] transform origin-left transition-transform duration-300 ${isActive('/') ? 'scale-x-80' : 'scale-x-0 group-hover:scale-x-80'}`}></div>
            </div>
            <div className="relative group">
              <Link 
                to="/calculator" 
                className={`uppercase font-medium text-xxs transition-colors text-[#585858] duration-300 ${isActive('/calculator') ? 'text-[var(--fontColor)]' : 'hover:text-[var(--fontColor)]'}`}
              >
                Oblicz ile otrzymasz pieniędzy
              </Link>
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-[var(--btnColor)] transform origin-left transition-transform duration-300 ${isActive('/calculator') ? 'scale-x-80' : 'scale-x-0 group-hover:scale-x-80'}`}></div>
            </div>
            <div className="relative group">
              <Link 
                to="/how-it-works" 
                className={`uppercase font-medium text-xxs transition-colors text-[#585858] duration-300 ${isActive('/how-it-works') ? 'text-[var(--fontColor)]' : 'hover:text-[var(--fontColor)]'}`}
              >
                Jak to działa?
              </Link>
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-[var(--btnColor)] transform origin-left transition-transform duration-300 ${isActive('/how-it-works') ? 'scale-x-80' : 'scale-x-0 group-hover:scale-x-80'}`}></div>
            </div>
            <div className="relative group">
              <Link 
                to="/support" 
                className={`uppercase font-medium text-xxs transition-colors text-[#585858] duration-300 ${isActive('/support') ? 'text-[var(--fontColor)]' : 'hover:text-[var(--fontColor)]'}`}
              >
                Pomoc techniczna
              </Link>
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-[var(--btnColor)] transform origin-left transition-transform duration-300 ${isActive('/support') ? 'scale-x-80' : 'scale-x-0 group-hover:scale-x-80'}`}></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <Link to="https://discord.gg/FBBsKTUV" target="_blank">
          <button className="bg-[var(--btnColor)] hover:opacity-90 transition-opacity text-black font-semibold text-shadow-lg/10 px-4 py-2 uppercase text-xs rounded-full cursor-pointer">
            Przejdź na nasz Discord 
          </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
