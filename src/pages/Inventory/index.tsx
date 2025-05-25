import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importy zdjęć skinów
import ak47AsiimovImg from '/src/assets/karambit.png';
import m4a4NeoNoirImg from '/src/assets/awp.png';
import deagleBlazeImg from '/src/assets/karambit.png';

interface SkinItem {
  id: number;
  name: string;
  marketPrice: number;
  ourPrice: number;
  rarity: Rarity;
  image: string;
  weaponType: string;
  wear: string;
}

type Rarity = 'common' | 'uncommon' | 'rare' | 'mythical' | 'legendary' | 'ancient';

interface SaleHistoryItem {
  id: number;
  skinName: string;
  price: number;
  date: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
}

const rarityColors: Record<Rarity, { bg: string, text: string, border: string }> = {
  common: { bg: '#1a1a1a', text: '#cccccc', border: '#cccccc' },     // Gray
  uncommon: { bg: '#162329', text: '#00aeff', border: '#00aeff' },    // Blue
  rare: { bg: '#1b2b16', text: '#a2ff46', border: '#a2ff46' },        // Green
  mythical: { bg: '#2b1616', text: '#ff4655', border: '#ff4655' },    // Red
  legendary: { bg: '#261626', text: '#c800ff', border: '#c800ff' },   // Purple
  ancient: { bg: '#262616', text: '#ffd700', border: '#ffd700' },     // Gold
};

const Inventory = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [inventory, setInventory] = useState<SkinItem[]>([]);
  const [salesHistory, setSalesHistory] = useState<SaleHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkins, setSelectedSkins] = useState<number[]>([]);
  const [isSelling, setIsSelling] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Symulacja ładowania danych z API
    setTimeout(() => {
      // Przykładowe dane skinów
      const mockInventory: SkinItem[] = [
        {
          id: 1,
          name: 'WATER ELEMENTAL (FT)',
          marketPrice: 356.20,
          ourPrice: 320.50,
          rarity: 'mythical',
          image: ak47AsiimovImg,
          weaponType: 'Karambit',
          wear: 'Field-Tested'
        },
        {
          id: 2,
          name: 'WATER ELEMENTAL (FT)',
          marketPrice: 391.30,
          ourPrice: 350.75,
          rarity: 'uncommon',
          image: m4a4NeoNoirImg,
          weaponType: 'Karambit',
          wear: 'Field-Tested'
        },
        {
          id: 3,
          name: 'WATER ELEMENTAL (FT)',
          marketPrice: 254.50,
          ourPrice: 220.00,
          rarity: 'legendary',
          image: deagleBlazeImg,
          weaponType: 'Karambit',
          wear: 'Field-Tested'
        },
        {
          id: 4,
          name: 'WATER ELEMENTAL (FT)',
          marketPrice: 364.50,
          ourPrice: 330.75,
          rarity: 'uncommon',
          image: m4a4NeoNoirImg,
          weaponType: 'Karambit',
          wear: 'Field-Tested'
        },
        {
          id: 5,
          name: 'WATER ELEMENTAL (FT)',
          marketPrice: 384.50,
          ourPrice: 350.00,
          rarity: 'mythical',
          image: deagleBlazeImg,
          weaponType: 'Karambit',
          wear: 'Field-Tested'
        },
        {
          id: 6,
          name: 'WATER ELEMENTAL (FT)',
          marketPrice: 352.50,
          ourPrice: 320.00,
          rarity: 'ancient',
          image: ak47AsiimovImg,
          weaponType: 'Karambit',
          wear: 'Field-Tested'
        }
      ];

      // Przykładowe dane historii sprzedaży
      const mockSalesHistory: SaleHistoryItem[] = [
        {
          id: 101,
          skinName: 'AWP | Wildfire',
          price: 189.50,
          date: '2023-05-15',
          paymentMethod: 'PayPal',
          status: 'completed'
        },
        {
          id: 102,
          skinName: 'Butterfly Knife | Fade',
          price: 1250.00,
          date: '2023-05-10',
          paymentMethod: 'Bank Transfer',
          status: 'completed'
        }
      ];

      setInventory(mockInventory);
      setSalesHistory(mockSalesHistory);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    // Symulacja odświeżania danych
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const toggleSelectSkin = (skinId: number) => {
    setSelectedSkins(prev => {
      if (prev.includes(skinId)) {
        return prev.filter(id => id !== skinId);
      } else {
        return [...prev, skinId];
      }
    });
  };

  const calculateTotalValue = () => {
    return selectedSkins.reduce((total, skinId) => {
      const skin = inventory.find(s => s.id === skinId);
      return total + (skin ? skin.ourPrice : 0);
    }, 0);
  };

  // Funkcja powiadomień z react-toastify
  const showNotification = (message: string, type: 'success' | 'warning' | 'error') => {
    const toastOptions = {
      position: "top-right" as const,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark" as const,
      style: { background: type === 'success' ? '#0d2f1e' : type === 'warning' ? '#332b0d' : '#2f0d0d' },
    };
    
    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'warning':
        toast.warning(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      default:
        toast(message, toastOptions);
    }
  };

  const handleCopyTradeLink = () => {
    const tradeLink = "https://steamcommunity.com/tradeoffer/new/?partner=123456789&token=abcdef";
    navigator.clipboard.writeText(tradeLink)
      .then(() => {
        setCopySuccess(true);
        showNotification(t('tradeLinkCopied') || 'Link do wymiany skopiowany do schowka!', 'success');
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Nie udało się skopiować linku:', err);
        showNotification(t('copyFailed') || 'Nie udało się skopiować linku', 'error');
      });
  };

  const handleSellSelected = () => {
    if (selectedSkins.length === 0) {
      showNotification(t('selectSkinsToSell') || 'Wybierz skiny do sprzedaży', 'warning');
      return;
    }

    const totalValue = calculateTotalValue();
    if (totalValue < 20) {
      showNotification(t('minimumSellAmount') || 'Minimalna kwota sprzedaży to 20 zł', 'warning');
      return;
    }

    // Pokaż modal potwierdzający sprzedaż
    setShowSellModal(true);
  };
  
  const confirmSell = () => {
    setIsSelling(true);
    setShowSellModal(false);
    
    // Symulacja procesu sprzedaży
    setTimeout(() => {
      // Logika sprzedaży skinów
      console.log(`Sprzedaję skiny o ID: ${selectedSkins.join(', ')} za ${calculateTotalValue().toFixed(2)} zł`);
      showNotification(t('sellSuccess') || 'Skiny zostały sprzedane pomyślnie!', 'success');
      
      // Dodanie do historii sprzedaży
      const soldSkins = selectedSkins.map(id => inventory.find(skin => skin.id === id));
      const currentDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
      
      // Jeśli sprzedajemy jeden skin
      if (selectedSkins.length === 1) {
        const skin = soldSkins[0];
        if (skin) {
          const newHistoryItem: SaleHistoryItem = {
            id: Date.now(), // Unikalny ID bazowany na czasie
            skinName: `${skin.weaponType} | ${skin.name}`,
            price: skin.ourPrice,
            date: currentDate,
            paymentMethod: t('bankTransfer') || 'Przelew bankowy',
            status: 'completed'
          };
          setSalesHistory(prev => [newHistoryItem, ...prev]);
        }
      } 
      // Jeśli sprzedajemy wiele skinów
      else {
        const newHistoryItem: SaleHistoryItem = {
          id: Date.now(), // Unikalny ID bazowany na czasie
          skinName: `${t('multipleItems') || 'Wiele przedmiotów'} (${selectedSkins.length})`,
          price: calculateTotalValue(),
          date: currentDate,
          paymentMethod: t('bankTransfer') || 'Przelew bankowy',
          status: 'completed'
        };
        setSalesHistory(prev => [newHistoryItem, ...prev]);
      }
      
      // Usunięcie sprzedanych skinów z ekwipunku
      setInventory(prev => prev.filter(skin => !selectedSkins.includes(skin.id)));
      setSelectedSkins([]);
      setIsSelling(false);
    }, 1500);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[var(--bgSecondary)] p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t('loginRequired')}</h2>
          <p className="text-gray-300 mb-6">{t('loginToViewInventory')}</p>
          <a href="/login" className="inline-block bg-[var(--btnColor)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--btnHoverColor)] transition-colors">
            {t('login')}
          </a>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
          <p className="mt-4 text-gray-400">{t('loadingInventoryMessage')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative bg-[var(--secondaryBgColor)]">
      {/* System powiadomień z react-toastify */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      {/* Modal sprzedaży przedmiotu */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[var(--secondaryBgColor)] rounded-lg max-w-md w-full mx-4 shadow-xl overflow-hidden">
            {/* Nagłówek modalu */}
            <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-[var(--bgColor)]">
              <h3 className="text-xl font-bold text-white">{t('sellSkin') || 'Sprzedaj przedmiot'}</h3>
              <button 
                onClick={() => setShowSellModal(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Informacje o przedmiocie */}
            <div className="p-4 bg-[var(--bgColor)] my-4 rounded-md mx-4">
              {selectedSkins.length === 1 ? (
                // Pojedynczy przedmiot
                <div className="flex items-center">
                  <div className="bg-[#0f0f0f] p-2 rounded-md mr-4 w-16 h-16 flex items-center justify-center">
                    <img 
                      src={inventory.find(skin => skin.id === selectedSkins[0])?.image} 
                      alt="Skin" 
                      className="w-14 h-14 object-contain" 
                    />
                  </div>
                  <div>
                    <div className="font-bold text-white">
                      {inventory.find(skin => skin.id === selectedSkins[0])?.weaponType} | {inventory.find(skin => skin.id === selectedSkins[0])?.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {inventory.find(skin => skin.id === selectedSkins[0])?.wear}
                    </div>
                    <div className="text-[var(--btnColor)] font-bold mt-1">
                      {inventory.find(skin => skin.id === selectedSkins[0])?.ourPrice.toFixed(2)} zł
                    </div>
                  </div>
                </div>
              ) : (
                // Wiele przedmiotów
                <div>
                  <div className="font-bold text-white mb-3 pb-2 border-b border-gray-800">{t('multipleItems') || 'Wiele przedmiotów'}</div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">{t('selectedItems') || 'Wybrane przedmioty'}:</span>
                    <span className="bg-[#1a1a1a] px-3 py-1 rounded-full text-sm text-white">{selectedSkins.length}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-800 mt-2">
                    <span className="text-gray-400">{t('totalAmount') || 'Kwota łączna'}:</span>
                    <span className="text-[var(--btnColor)] font-bold text-lg">{calculateTotalValue().toFixed(2)} zł</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Metoda płatności */}
            <div className="px-4 mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">{t('paymentMethod') || 'Metoda płatności'}</label>
              <select className="w-full bg-[var(--bgColor)] border border-gray-800 rounded-md p-3 text-white">
                <option>{t('bankTransfer') || 'Przelew bankowy'}</option>
                <option>PayPal</option>
                <option>Skrill</option>
                <option>Bitcoin</option>
              </select>
            </div>
            
            {/* Dane do płatności */}
            <div className="px-4 mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">{t('paymentDetails') || 'Dane do płatności'}</label>
              <textarea 
                className="w-full bg-[var(--bgColor)] border border-gray-800 rounded-md p-3 text-white resize-none"
                rows={3}
                placeholder={t('enterPaymentDetails') || 'Wprowadź dane do płatności...'}
              ></textarea>
            </div>
            
            {/* Trade Link */}
            <div className="px-4 mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">{t('tradeLink') || 'Nasz Trade Link'}</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full bg-[var(--bgColor)] border border-gray-800 rounded-md p-3 pr-12 text-white"
                  value="https://steamcommunity.com/tradeoffer/new/?partner=123456789&token=abcdef"
                  readOnly
                />
                <button 
                  onClick={handleCopyTradeLink} 
                  className={`absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 ${copySuccess ? 'bg-green-600' : 'bg-[var(--btnColor)]'} text-black p-2 rounded-md transition-colors`}
                >
                  {copySuccess ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">{t('useTradeLinkDesc') || 'Użyj tego Trade Link, aby wysłać nam swój przedmiot'}</p>
            </div>
            
            {/* Checkboxy */}
            <div className="px-4 mb-6">
              <div className="flex items-start mb-3">
                <input type="checkbox" className="mt-1 mr-2" id="terms" />
                <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer">
                  {t('acceptTerms') || 'Akceptuję'} <span className="text-[var(--btnColor)]">regulamin</span> {t('serviceAndPrivacy') || 'serwisu oraz politykę prywatności'}. {t('understandNoCancel') || 'Rozumiem, że po sprzedaży przedmiotu nie mogę anulować transakcji.'}
                </label>
              </div>
              <div className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2" id="confirm" />
                <label htmlFor="confirm" className="text-sm text-gray-400 cursor-pointer">
                  {t('confirmSentItem') || 'Potwierdzam, że wysłałem przedmiot na konto Steam za pomocą podanego Trade Link.'}
                </label>
              </div>
            </div>
            
            {/* Przyciski */}
            <div className="flex border-t border-gray-800 p-4 bg-[var(--bgColor)]">
              <button 
                onClick={() => setShowSellModal(false)}
                className="flex-1 py-3 mr-2 cursor-pointer text-white font-medium bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg"
              >
                {t('cancel') || 'Anuluj'}
              </button>
              <button 
                onClick={confirmSell}
                className="flex-1 py-3 ml-2 cursor-pointer bg-[var(--btnColor)] text-black font-medium hover:opacity-90 transition-opacity rounded-lg"
                disabled={isSelling}
              >
                {isSelling ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="relative h-4 w-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-700 border-opacity-30"></div>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-black absolute top-0 left-0"></div>
                    </div>
                    {t('processing') || 'Przetwarzanie...'}
                  </span>
                ) : (
                  t('confirmSellBtn') || 'Potwierdź sprzedaż'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Nagłówek strony */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{t('yourInventory')}</h1>
          <p className="text-gray-400 text-sm max-w-lg">{t('inventoryDesc') || 'Tutaj znajdziesz wszystkie swoje przedmioty gotowe do sprzedaży'}</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center cursor-pointer gap-2 bg-[var(--btnColor)] text-black px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="relative h-5 w-5">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-700 border-opacity-30"></div>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-black absolute top-0 left-0"></div>
              </div>
              {t('refreshing')}
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t('refresh')}
            </>
          )}
        </button>
      </div>

      {/* Ekwipunek */}
      <div className="bg-[var(--bgColor)] rounded-lg shadow-lg mb-8">
        <div className="border-b border-gray-800 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{t('myInventory') || 'Mój ekwipunek'}</h2>
              <p className="text-gray-500 text-sm mt-1">{t('inventoryDesc') || 'CS2'}</p>
            </div>
            
            {selectedSkins.length > 0 && (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                <div className="bg-[var(--bgColor)] px-4 py-2 rounded-lg flex items-center gap-3 w-full md:w-auto">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs">{t('selected') || 'Wybrano'}</span>
                    <span className="text-white font-bold">{selectedSkins.length}</span>
                  </div>
                  <div className="w-px h-8 bg-gray-700"></div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs">{t('total') || 'Suma'}</span>
                    <span className="text-[var(--btnColor)] font-bold">{calculateTotalValue().toFixed(2)} zł</span>
                  </div>
                </div>
                <button 
                  onClick={handleSellSelected}
                  disabled={isSelling || calculateTotalValue() < 20}
                  className={`flex cursor-pointer items-center justify-center gap-2 ${calculateTotalValue() >= 20 ? 'bg-[var(--btnColor)] text-black' : 'bg-gray-800 text-gray-400'} px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto`}
                >
                  {isSelling ? (
                    <>
                      <div className="relative h-4 w-4">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-700 border-opacity-30"></div>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-black absolute top-0 left-0"></div>
                      </div>
                      {t('selling') || 'Sprzedawanie...'}
                    </>
                  ) : (
                    t('sellSelected') || 'Sprzedaj wybrane'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {inventory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-[#1a1a1a] p-8 rounded-2xl mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-gray-300 text-xl font-medium mb-2">{t('emptyInventory') || 'Twój ekwipunek jest pusty'}</h3>
            <p className="text-gray-500 text-sm max-w-md text-center">{t('emptyInventoryDesc') || 'Nie masz jeszcze żadnych przedmiotów w swoim ekwipunku. Dodaj przedmioty do swojego konta Steam, aby móc je sprzedać.'}</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {inventory.map((skin) => {
                const isSelected = selectedSkins.includes(skin.id);
                const colors = rarityColors[skin.rarity];
                
                return (
                  <div 
                    key={skin.id} 
                    onClick={() => toggleSelectSkin(skin.id)}
                    className={`relative overflow-hidden rounded-xl group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isSelected ? 'ring-2 ring-[var(--btnColor)]' : ''}`}
                    style={{ 
                      border: `1px solid ${colors.border}55`, 
                      boxShadow: `0 0 0 rgba(0,0,0,0)`, 
                      '--hover-shadow-color': `${colors.border}30` 
                    } as React.CSSProperties}
                  >
                    {/* Checkbox dla zaznaczenia */}
                    <div className="absolute top-2 right-2 z-10">
                      <div className={`w-5 h-5 rounded-full border ${isSelected ? 'bg-[var(--btnColor)] border-[var(--btnColor)]' : 'bg-gray-800/50 border-gray-600'} flex items-center justify-center`}>
                        {isSelected && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    <div 
                      style={{ 
                        background: `linear-gradient(to top, ${colors.bg}, var(--bgColor))` 
                      }} 
                      className="p-4 pb-8 h-full relative"
                    >
                      <div className="absolute top-2 left-2 text-xs font-medium text-white">{skin.marketPrice.toFixed(2)} zł</div>
                      
                      <div className="flex justify-center items-center h-32 mt-4 py-20">
                        <img 
                          src={skin.image} 
                          alt={skin.weaponType} 
                          className="h-26 object-contain transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3" 
                        />
                      </div>
                    </div>
                    
                    <div 
                      className="absolute bottom-0 left-0 right-0 py-1 px-2 transition-all duration-300" 
                      style={{ borderBottom: `4px solid ${colors.border}` }}
                    >
                      <div className="flex flex-col justify-center">
                        <div className="text-[10px] font-medium text-white">{skin.weaponType}</div>
                        <div style={{ color: colors.text }} className="text-xs font-semibold group-hover:text-white transition-colors duration-300">{skin.name}</div>
                      </div>
                    </div>
                    
                    {/* Overlay efekt przy hover */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ backgroundImage: `linear-gradient(to top, ${colors.border}30, transparent)` }}
                    ></div>
                    
                    {/* Przycisk sprzedaży */}
                    <div className={`absolute bottom-0 left-0 right-0 bg-[var(--btnColor)] text-black text-center py-1 px-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${isSelected ? 'translate-y-0' : ''}`}>
                      <div className="text-xs font-bold uppercase">
                        {t('sellFor')} {skin.ourPrice.toFixed(2)} zł
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Historia sprzedaży */}
      <div className="bg-[var(--bgColor)] rounded-lg shadow-lg">
        <div className="border-b border-gray-800 p-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{t('salesHistory') || 'Historia sprzedaży'}</h2>
            <p className="text-gray-500 text-sm mt-1">{t('salesHistoryDesc')}</p>
          </div>
        </div>
        
        {salesHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-[var(--bgColor)] p-8 rounded-2xl mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-gray-300 text-xl font-medium mb-2">{t('noSalesHistory') || 'Nie masz jeszcze historii sprzedaży'}</h3>
            <p className="text-gray-500 text-sm max-w-md text-center">{t('noSalesHistoryDesc') || 'Twoja historia sprzedaży pojawi się tutaj po sprzedaniu pierwszego przedmiotu.'}</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Widok tabeli na desktopie */}
            <div className="hidden md:block overflow-x-auto rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--bgColor)] text-left">
                    <th className="px-4 py-3 text-sm font-medium rounded-tl-lg">{t('item') || 'Przedmiot'}</th>
                    <th className="px-4 py-3 text-sm font-medium">{t('price') || 'Cena'}</th>
                    <th className="px-4 py-3 text-sm font-medium">{t('date') || 'Data'}</th>
                    <th className="px-4 py-3 text-sm font-medium">{t('paymentMethod') || 'Metoda płatności'}</th>
                    <th className="px-4 py-3 text-sm font-medium rounded-tr-lg">{t('status') || 'Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {salesHistory.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-[var(--bgColor)]/70 transition-colors ${index === salesHistory.length - 1 ? 'border-b-0' : 'border-b border-gray-800'}`}
                    >
                      <td className="px-4 py-4">{item.skinName}</td>
                      <td className="px-4 py-4 font-medium">{item.price.toFixed(2)} zł</td>
                      <td className="px-4 py-4 text-gray-400">{item.date}</td>
                      <td className="px-4 py-4">{item.paymentMethod}</td>
                      <td className="px-4 py-4">
                        <span 
                          className={`px-3 py-1 text-xs rounded-full ${item.status === 'completed' ? 'bg-green-900/30 text-green-400' : item.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-red-900/30 text-red-400'}`}
                        >
                          {t(item.status) || (item.status === 'completed' ? 'Zakończona' : item.status === 'pending' ? 'Oczekująca' : 'Anulowana')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Widok kart na urządzeniach mobilnych */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {salesHistory.map((item) => (
                <div key={item.id} className="bg-[var(--bgColor)] p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-3 pb-2 border-b border-gray-800">
                    <div className="font-medium text-white">{item.skinName}</div>
                    <span 
                      className={`px-3 py-1 text-xs rounded-full ${item.status === 'completed' ? 'bg-green-900/30 text-green-400' : item.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-red-900/30 text-red-400'}`}
                    >
                      {t(item.status) || (item.status === 'completed' ? 'Zakończona' : item.status === 'pending' ? 'Oczekująca' : 'Anulowana')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-400">{t('price') || 'Cena'}:</div>
                    <div className="text-[var(--btnColor)] font-medium text-right">{item.price.toFixed(2)} zł</div>
                    
                    <div className="text-gray-400">{t('date') || 'Data'}:</div>
                    <div className="text-gray-300 text-right">{item.date}</div>
                    
                    <div className="text-gray-400">{t('paymentMethod') || 'Metoda płatności'}:</div>
                    <div className="text-gray-300 text-right">{item.paymentMethod}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
