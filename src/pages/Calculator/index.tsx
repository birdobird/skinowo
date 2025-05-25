import { useState, useEffect } from 'react';
import karambitmImg from '/src/assets/karambit.png';
import awpImg from '/src/assets/awp.png';
import bgBlurDots from '/src/assets/bg-blur-dots.png';
import { useLanguage } from '../../context/LanguageContext';

// Define rarity types and their associated colors
type Rarity = 'common' | 'uncommon' | 'rare' | 'mythical' | 'legendary' | 'ancient';

// Define color scheme for each rarity
const rarityColors: Record<Rarity, { bg: string, text: string, border: string }> = {
  common: { bg: '#1a1a1a', text: '#cccccc', border: '#cccccc' },     // Gray
  uncommon: { bg: '#162329', text: '#00aeff', border: '#00aeff' },    // Blue
  rare: { bg: '#1b2b16', text: '#a2ff46', border: '#a2ff46' },        // Green
  mythical: { bg: '#2b1616', text: '#ff4655', border: '#ff4655' },    // Red
  legendary: { bg: '#261626', text: '#c800ff', border: '#c800ff' },   // Purple
  ancient: { bg: '#262616', text: '#ffd700', border: '#ffd700' },     // Gold
};

interface SkinItem {
  id: number;
  name: string;
  marketPrice: number;
  ourPrice: number;
  rarity: Rarity;
  image: string;
  weaponType: string;
  wear: string;
  statTrak?: boolean;
  souvenir?: boolean;
}

// Mock categories for filtering - will be translated dynamically
const categoryIds = ['all', 'knife', 'rifle', 'pistol', 'smg', 'heavy', 'gloves'];

// Mock wear filters - will be translated dynamically
const wearIds = ['all', 'fn', 'mw', 'ft', 'ww', 'bs'];

const Calculator = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWear, setSelectedWear] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [allSkins, setAllSkins] = useState<SkinItem[]>([]);
  const [filteredSkins, setFilteredSkins] = useState<SkinItem[]>([]);

  // Generate mock skin data
  useEffect(() => {
    // Simulate API call to get skins data
    setTimeout(() => {
      const mockSkins: SkinItem[] = [
        // Knives
        { 
          id: 1, 
          name: 'FADE (FN)', 
          marketPrice: 1250.75, 
          ourPrice: 875.53, 
          rarity: 'ancient', 
          image: karambitmImg, 
          weaponType: 'Karambit',
          wear: 'Factory New',
          statTrak: true
        },
        { 
          id: 2, 
          name: 'DOPPLER (FN)', 
          marketPrice: 950.25, 
          ourPrice: 665.18, 
          rarity: 'legendary', 
          image: karambitmImg, 
          weaponType: 'Karambit',
          wear: 'Factory New'
        },
        { 
          id: 3, 
          name: 'SLAUGHTER (MW)', 
          marketPrice: 725.50, 
          ourPrice: 507.85, 
          rarity: 'mythical', 
          image: karambitmImg, 
          weaponType: 'Karambit',
          wear: 'Minimal Wear'
        },
        { 
          id: 4, 
          name: 'CRIMSON WEB (FT)', 
          marketPrice: 520.30, 
          ourPrice: 364.21, 
          rarity: 'rare', 
          image: karambitmImg, 
          weaponType: 'Karambit',
          wear: 'Field-Tested'
        },
        { 
          id: 5, 
          name: 'NIGHT (FT)', 
          marketPrice: 320.15, 
          ourPrice: 224.11, 
          rarity: 'uncommon', 
          image: karambitmImg, 
          weaponType: 'Karambit',
          wear: 'Field-Tested'
        },
        { 
          id: 6, 
          name: 'SAFARI MESH (BS)', 
          marketPrice: 180.45, 
          ourPrice: 126.32, 
          rarity: 'common', 
          image: karambitmImg, 
          weaponType: 'Karambit',
          wear: 'Battle-Scarred'
        },
        // Rifles
        { 
          id: 7, 
          name: 'ASIIMOV (FT)', 
          marketPrice: 85.50, 
          ourPrice: 59.85, 
          rarity: 'mythical', 
          image: awpImg, 
          weaponType: 'AWP',
          wear: 'Field-Tested'
        },
        { 
          id: 8, 
          name: 'DRAGON LORE (FN)', 
          marketPrice: 10500.00, 
          ourPrice: 7350.00, 
          rarity: 'ancient', 
          image: awpImg, 
          weaponType: 'AWP',
          wear: 'Factory New',
          souvenir: true
        },
        { 
          id: 9, 
          name: 'HYPER BEAST (MW)', 
          marketPrice: 45.75, 
          ourPrice: 32.03, 
          rarity: 'legendary', 
          image: awpImg, 
          weaponType: 'AWP',
          wear: 'Minimal Wear',
          statTrak: true
        },
        { 
          id: 10, 
          name: 'BOOM (MW)', 
          marketPrice: 35.25, 
          ourPrice: 24.68, 
          rarity: 'rare', 
          image: awpImg, 
          weaponType: 'AWP',
          wear: 'Minimal Wear'
        },
        { 
          id: 11, 
          name: 'ELECTRIC HIVE (FN)', 
          marketPrice: 25.80, 
          ourPrice: 18.06, 
          rarity: 'uncommon', 
          image: awpImg, 
          weaponType: 'AWP',
          wear: 'Factory New'
        },
        { 
          id: 12, 
          name: 'SAFARI MESH (BS)', 
          marketPrice: 10.45, 
          ourPrice: 7.32, 
          rarity: 'common', 
          image: awpImg, 
          weaponType: 'AWP',
          wear: 'Battle-Scarred'
        },
      ];
      
      setAllSkins(mockSkins);
      setFilteredSkins(mockSkins);
      setIsLoading(false);
    }, 1500);
  }, []);

  // Filter skins based on search query and filters
  useEffect(() => {
    if (allSkins.length === 0) return;

    let filtered = [...allSkins];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(skin => 
        skin.weaponType.toLowerCase().includes(query) || 
        skin.name.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'knife') {
        filtered = filtered.filter(skin => 
          skin.weaponType === 'Karambit' || 
          skin.weaponType.includes('Knife') || 
          skin.weaponType.includes('Bayonet')
        );
      } else if (selectedCategory === 'rifle') {
        filtered = filtered.filter(skin => 
          skin.weaponType === 'AWP' || 
          skin.weaponType === 'AK-47' || 
          skin.weaponType === 'M4A4' || 
          skin.weaponType === 'M4A1-S'
        );
      }
      // Add more category filters as needed
    }

    // Filter by wear
    if (selectedWear !== 'all') {
      const wearMap: Record<string, string> = {
        'fn': 'Factory New',
        'mw': 'Minimal Wear',
        'ft': 'Field-Tested',
        'ww': 'Well-Worn',
        'bs': 'Battle-Scarred'
      };
      
      filtered = filtered.filter(skin => skin.wear === wearMap[selectedWear]);
    }

    setFilteredSkins(filtered);
  }, [searchQuery, selectedCategory, selectedWear, allSkins]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
          <p className="mt-4 text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -left-32 top-96 w-[25rem] h-[25rem] rounded-full bg-[var(--btnColor)]/8 blur-[80px] z-0"></div>
      <div className="absolute -right-42 top-84 w-[25rem] h-[25rem] rounded-full bg-[var(--btnColor)]/7 blur-[80px] z-0"></div>
      
      <div className="relative w-full overflow-hidden" style={{ backgroundImage: `url(${bgBlurDots})`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '4rem 0' }}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-black mb-4 uppercase tracking-wide">{t('calculatorTitle')}</h1>
            <p className="text-md mb-6 text-gray-300">
              {t('calculatorDesc')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 relative z-10">
        <div className="bg-[var(--bgColor)] rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('searchSkins')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--secondaryBgColor)] border border-gray-700 rounded-lg p-3 pl-10 text-sm"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex-1 flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[var(--secondaryBgColor)] border border-gray-700 rounded-lg p-2 text-sm flex-1"
              >
                {categoryIds.map(categoryId => (
                  <option key={categoryId} value={categoryId}>
                    {t(categoryId === 'all' ? 'allCategories' : categoryId + 's')}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedWear}
                onChange={(e) => setSelectedWear(e.target.value)}
                className="bg-[var(--secondaryBgColor)] border border-gray-700 rounded-lg p-2 text-sm flex-1"
              >
                {wearIds.map(wearId => (
                  <option key={wearId} value={wearId}>
                    {t(wearId === 'all' ? 'allWear' : wearId === 'fn' ? 'factoryNew' : wearId === 'mw' ? 'minimalWear' : wearId === 'ft' ? 'fieldTested' : wearId === 'ww' ? 'wellWorn' : 'battleScarred')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {/* Usunięto filtry StatTrak i Souvenir */}
          </div>
        </div>
        
        {filteredSkins.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-400">{t('noSkinsFound')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredSkins.map(skin => {
              const colors = rarityColors[skin.rarity];
              
              return (
                <div 
                  key={skin.id} 
                  className="relative overflow-hidden rounded-xl group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" 
                  style={{ border: `1px solid ${colors.border}55`, boxShadow: `0 0 0 rgba(0,0,0,0)`, '--hover-shadow-color': `${colors.border}30` } as React.CSSProperties}
                >
                  <div 
                    style={{ 
                      background: `linear-gradient(to top, ${colors.bg}, var(--bgColor))` 
                    }} 
                    className="p-4 pb-8 h-full relative"
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-xs font-medium text-white transition-all duration-300 group-hover:text-white group-hover:font-bold">{skin.marketPrice.toFixed(2)} zł</div>
                      <div className="text-[10px] text-white/60">{t(skin.wear)}</div>
                    </div>
                    
                    <div className="flex justify-center items-center h-32 mt-4 py-20 relative z-10">
                      <img 
                        src={skin.image} 
                        alt={skin.weaponType} 
                        className="h-26 object-contain transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3" 
                      />
                    </div>
                    
                    {/* Efekt świecenia przy hover */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-md rounded-full w-32 h-32 mx-auto mt-16"
                      style={{ background: `${colors.border}/10` }}
                    ></div>
                    
                    {(skin.statTrak || skin.souvenir) && (
                      <div className="absolute top-8 right-2 flex flex-col gap-1">
                        {skin.statTrak && (
                          <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-sm font-medium">
                            StatTrak™
                          </span>
                        )}
                        {skin.souvenir && (
                          <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-sm font-medium">
                            Souvenir
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="mb-6 text-center">
                      <div className="text-sm font-medium mb-1 group-hover:text-white transition-colors duration-300">{t('youWillReceive')}</div>
                      <div className="text-xl font-bold group-hover:scale-110 transition-transform duration-300" style={{ color: colors.border }}>{skin.ourPrice.toFixed(2)} zł</div>
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
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-8 bg-[var(--bgColor)] rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">{t('howWeCalculated')}</h3>
          <p className="text-gray-300 mb-4">
            {t('calculatorDesc2')}
          </p>
          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <div className="bg-[var(--secondaryBgColor)] p-4 rounded-lg w-1/3">
              <h3 className="text-lg font-bold mb-2">{t('marketValue')}</h3>
              <p className="text-sm text-gray-400">{t('marketValueDesc')}</p>
            </div>
            <div className="bg-[var(--secondaryBgColor)] p-4 rounded-lg w-1/3">
              <h4 className="font-bold mb-2">{t('ourOffer')}</h4>
              <p className="text-sm text-gray-400">{t('ourOfferDesc')}</p>
            </div>
            <div className="bg-[var(--secondaryBgColor)] p-4 rounded-lg w-1/3">
              <h4 className="font-bold mb-2">{t('instantPayment')}</h4>
              <p className="text-sm text-gray-400">{t('instantPaymentDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
