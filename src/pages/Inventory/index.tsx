import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { inventoryAPI, tradeHistoryAPI } from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import { useLanguage } from '../../context/LanguageContext';

import 'react-toastify/dist/ReactToastify.css';

// Define types
interface SkinItem {
  id: string;
  assetId: string;
  name: string;
  marketPrice: number | null;
  ourPrice: number | null;
  rarity: string;
  image?: string;
  weaponType?: string;
  wear?: string;
  statTrak?: boolean;
  souvenir?: boolean;
  tradable?: boolean;
  marketable?: boolean;
}

interface RarityColor {
  bg: string;
  text: string;
  border: string;
}

// Rarity colors mapping
const rarityColors: Record<string, RarityColor> = {
  Common: { bg: '#1a1a1a', text: '#cccccc', border: '#cccccc' },
  Uncommon: { bg: '#162329', text: '#00aeff', border: '#00aeff' },
  Rare: { bg: '#1b2b16', text: '#a2ff46', border: '#a2ff46' },
  Mythical: { bg: '#2b1616', text: '#ff4655', border: '#ff4655' },
  Legendary: { bg: '#261626', text: '#c800ff', border: '#c800ff' },
  Ancient: { bg: '#262616', text: '#ffd700', border: '#ffd700' },
  Default: { bg: '#1a1a1a', text: '#cccccc', border: '#cccccc' }
};

const Inventory: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [inventory, setInventory] = useState<SkinItem[]>([]);
  const [soldItems, setSoldItems] = useState<Set<string>>(new Set());
  const [selectedSkins, setSelectedSkins] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [salesHistory, setSalesHistory] = useState<any[]>([]);
  const [isCalculatorLoading, setIsCalculatorLoading] = useState(true);
  
  // Calculate total value of selected skins
  const totalValue = selectedSkins.reduce((sum, assetId) => {
    const skin = inventory.find(s => s.assetId === assetId);
    return sum + (skin?.ourPrice ?? 0);
  }, 0);
  
  // Fetch sales history
  const fetchSalesHistory = useCallback(async () => {
    try {
      setIsHistoryLoading(true);
      const response = await tradeHistoryAPI.getTradeHistory(50, 0);
      
      console.log('Sales history:', response);
      setSalesHistory(response);
      
      // Extract sold item IDs from history
      const soldItemIds = new Set<string>();
      response.forEach((tx: any) => {
        try {
          const details = typeof tx.details === 'string' ? JSON.parse(tx.details) : tx.details;
          if (details && Array.isArray(details.items)) {
            details.items.forEach((item: any) => {
              if (item.assetId) {
                soldItemIds.add(item.assetId);
              }
            });
          }
        } catch (e) {
          console.error('Error parsing transaction details:', e);
        }
      });
      setSoldItems(soldItemIds);
    } catch (error) {
      console.error('Error fetching sales history:', error);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  // Fetch inventory from the backend
  const fetchInventory = useCallback(async () => {
    if (!user?.steamId) return;
    
    try {
      setIsCalculatorLoading(true);
      setIsLoading(true);
      setError(null);
      
      // Get current language from the language context
      const lang = localStorage.getItem('i18nextLng') || 'pl';
      const response = await inventoryAPI.getUserInventory(lang);
      
      if (response.success && response.inventory) {
        setInventory(response.inventory);
      } else {
        throw new Error('Failed to load inventory');
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Nie udało się załadować ekwipunku. Spróbuj odświeżyć stronę.');
      toast.error('Nie udało się załadować ekwipunku');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsCalculatorLoading(false);
    }
  }, [user?.steamId]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      await fetchInventory();
      await fetchSalesHistory();
    };
    loadData();
  }, [fetchInventory, fetchSalesHistory]);

  // Toggle skin selection
  const toggleSkinSelection = (assetId: string) => {
    // Don't allow selection of sold items
    if (soldItems.has(assetId)) return;
    
    setSelectedSkins(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
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

  // Handle copy trade link
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

  // Handle sell selected
  const handleSellSelected = () => {
    if (selectedSkins.length === 0) return;
    setShowSellModal(true);
  };

  // Handle confirm sell
  const handleConfirmSell = async () => {
    if (selectedSkins.length === 0) return;
    
    try {
      setIsSelling(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/inventory/sell`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: selectedSkins.map(assetId => ({
            assetId,
            name: inventory.find(skin => skin.assetId === assetId)?.name || 'Unknown Item'
          }))
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to sell items');
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Przedmioty zostały wystawione na sprzedaż');
        setSelectedSkins([]);
        await fetchInventory(); // Refresh the inventory
        await fetchSalesHistory(); // Refresh sales history
      } else {
        throw new Error(data.message || 'Failed to sell items');
      }
    } catch (err) {
      console.error('Error selling items:', err);
      toast.error('Wystąpił błąd podczas sprzedaży przedmiotów');
    } finally {
      setIsSelling(false);
      setShowSellModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
      </div>
    );
  }

  if (!user || !user.steamId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[var(--bgSecondary)] p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t('loginRequired') || 'Wymagane logowanie'}</h2>
          <p className="text-gray-300 mb-6">{t('loginToViewInventory') || 'Zaloguj się, aby zobaczyć swój ekwipunek'}</p>
          <a href="/login" className="inline-block bg-[var(--btnColor)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--btnHoverColor)] transition-colors">
            {t('login') || 'Zaloguj się'}
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={fetchInventory}
          className="mt-4 bg-[var(--btnColor)] text-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Ładowanie...' : 'Spróbuj ponownie'}
        </button>
      </div>
    );
  }

  const salesHistoryData = isHistoryLoading ? (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--btnColor)]"></div>
    </div>
  ) : salesHistory.length > 0 ? (
    <div className="space-y-4">
      {salesHistory.map((sale) => {
        let details;
        try {
          details = typeof sale.details === 'string' ? JSON.parse(sale.details) : sale.details;
        } catch (e) {
          console.error('Error parsing sale details:', e);
          details = { items: [] };
        }
        
        return (
          <div key={sale.id} className="bg-[var(--secondaryBgColor)] p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-xs text-gray-400">ID: {sale.id}</p>
                <p className="text-xs text-gray-500">{new Date(sale.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[var(--btnColor)]">{parseFloat(sale.amount).toFixed(2)} zł</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  sale.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                  sale.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-red-900/30 text-red-400'
                }`}>
                  {sale.status === 'completed' ? 'Zakończono' :
                   sale.status === 'pending' ? 'W toku' : 'Anulowano'}
                </span>
              </div>
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-800">
              {Array.isArray(details?.items) && details.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#0f0f0f] rounded flex items-center justify-center">
                      <img 
                        src={inventory.find(skin => skin.assetId === item.assetId)?.image || '/placeholder-skin.png'} 
                        alt={item.name} 
                        className="w-6 h-6 object-contain" 
                      />
                    </div>
                    <span className="text-sm text-gray-300">{item.name || 'Unknown Item'}</span>
                  </div>
                  <span className="text-sm font-medium">{parseFloat(item.ourPrice || 0).toFixed(2)} zł</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="text-center py-12">
      <p className="text-gray-500">Brak historii transakcji</p>
    </div>
  );

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
                      src={inventory.find(skin => skin.assetId === selectedSkins[0])?.image} 
                      alt="Skin" 
                      className="w-14 h-14 object-contain" 
                    />
                  </div>
                  <div>
                    <div className="font-bold text-white">
                      {inventory.find(skin => skin.assetId === selectedSkins[0])?.weaponType} | {inventory.find(skin => skin.assetId === selectedSkins[0])?.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {inventory.find(skin => skin.assetId === selectedSkins[0])?.wear}
                    </div>
                    <div className="text-[var(--btnColor)] font-bold mt-1">
                      {(inventory.find(skin => skin.assetId === selectedSkins[0])?.ourPrice ?? 0).toFixed(2)} zł
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
                    <span className="text-[var(--btnColor)] font-bold">{totalValue.toFixed(2)} zł</span>
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
                onClick={handleConfirmSell}
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
          onClick={fetchInventory}
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
                <div className="bg-[var(--bgColor)] px-4 py-2 rounded-lg flex items-center gap-3 w-full md:w-auto min-w-[200px]">
                  {isCalculatorLoading ? (
                    <div className="flex items-center justify-center w-full py-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">{t('selected') || 'Wybrano'}</span>
                        <span className="text-white font-bold">{selectedSkins.length}</span>
                      </div>
                      <div className="w-px h-8 bg-gray-700"></div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">{t('total') || 'Suma'}</span>
                        <span className="text-[var(--btnColor)] font-bold">{totalValue.toFixed(2)} zł</span>
                      </div>
                    </>
                  )}
                </div>
                <button 
                  onClick={handleSellSelected}
                  disabled={isSelling || totalValue < 0}
                  className={`flex cursor-pointer items-center justify-center gap-2 ${totalValue >= 0 ? 'bg-[var(--btnColor)] text-black' : 'bg-gray-800 text-gray-400'} px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto`}
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
                const isSelected = selectedSkins.includes(skin.assetId);
                const colors = rarityColors[skin.rarity];
                
                return (
                  <div 
                    key={skin.id} 
                    onClick={() => toggleSkinSelection(skin.assetId)}
                    className={`relative overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-[var(--btnColor)]' : ''
                    } ${
                      soldItems.has(skin.assetId) 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:shadow-[0_0_15px_var(--hover-shadow-color)]'
                    }`}
                    style={{ 
                      border: `1px solid ${colors.border}55`, 
                      boxShadow: `0 0 0 rgba(0,0,0,0)`, 
                      '--hover-shadow-color': `${colors.border}30` 
                    } as React.CSSProperties}
                  >
                    {/* Sold overlay */}
                    {soldItems.has(skin.assetId) && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                        <span className="bg-red-900/80 text-white text-xs font-bold px-2 py-1 rounded">
                          Sprzedano
                        </span>
                      </div>
                    )}
                    
                    {/* Checkbox dla zaznaczenia */}
                    {!soldItems.has(skin.assetId) && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className={`w-5 h-5 rounded-full border ${
                          isSelected ? 'bg-[var(--btnColor)] border-[var(--btnColor)]' : 'bg-gray-800/50 border-gray-600'
                        } flex items-center justify-center`}>
                          {isSelected && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div 
                      style={{ 
                        background: `linear-gradient(to top, ${colors.bg}, var(--bgColor))` 
                      }} 
                      className="p-4 pb-8 h-full relative"
                    >
                      <div className="absolute top-2 left-2 text-xs font-medium text-white">{skin.marketPrice ? skin.marketPrice.toFixed(2) : '0.00'} zł</div>
                      
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
                        {t('sellFor')} {skin.ourPrice ? skin.ourPrice.toFixed(2) : '0.00'} zł
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sales History */}
      <div className="bg-[var(--bgColor)] rounded-lg shadow-lg mt-8">
        <div className="border-b border-gray-800 p-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{t('salesHistory') || 'Historia sprzedaży'}</h2>
            <p className="text-gray-500 text-sm mt-1">{t('salesHistoryDesc') || 'Historia Twoich transakcji'}</p>
          </div>
        </div>
        <div className="p-6">
          {salesHistoryData}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
