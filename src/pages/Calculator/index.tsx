import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import bgBlurDots from '/src/assets/bg-blur-dots.png';
import { useLanguage } from '../../context/LanguageContext';
import { getItemPrices } from '../../services/skinportService';
import type { SkinportItem } from '../../services/skinportService';
import SkinImage from '../../components/SkinImage';
import defaultSkin from '../../assets/default-skin.png';
import skinKnife from '../../assets/skin-knife.png';
import skinPistol from '../../assets/skin-pistol.png';
import skinGloves from '../../assets/skin-gloves.png';
import skinSticker from '../../assets/skin-sticker.png';


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
  id: string;
  name: string;
  marketPrice: number;
  ourPrice: number;
  rarity: Rarity;
  image: string;
  weaponType: string;
  wear: string;
  statTrak: boolean;
  souvenir: boolean;
  market_hash_name: string;
  steam_url: string;
}

// Categories for filtering
const categoryIds = ['all', 'knife', 'rifle', 'pistol', 'smg', 'heavy', 'gloves'];

// Wear filters
const wearIds = ['all', 'fn', 'mw', 'ft', 'ww', 'bs'];

// Map wear strings from API to our format
const mapWear = (wear: string): string => {
  const wearMap: Record<string, string> = {
    'factory new': 'Factory New',
    'minimal wear': 'Minimal Wear',
    'field-tested': 'Field-Tested',
    'well-worn': 'Well-Worn',
    'battle-scarred': 'Battle-Scarred'
  };
  return wearMap[wear.toLowerCase()] || 'Field-Tested';
};

// Extract weapon type from market name
const getWeaponType = (name: string): string => {
  const parts = name.split(' | ');
  return parts[0] || 'Unknown';
};

// Determine rarity based on price
const getRarity = (price: number): Rarity => {
  if (price >= 1000) return 'ancient';
  if (price >= 500) return 'legendary';
  if (price >= 100) return 'mythical';
  if (price >= 50) return 'rare';
  if (price >= 10) return 'uncommon';
  return 'common';
};

const Calculator = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWear, setSelectedWear] = useState('all');
  const [selectedRarity] = useState<Rarity | 'all'>('all'); // Will be used in future updates
  const [isLoading, setIsLoading] = useState(true);
  const [allSkins, setAllSkins] = useState<SkinItem[]>([]);
  const [filteredSkins, setFilteredSkins] = useState<SkinItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [hasMore, setHasMore] = useState(false);



  // Add a header message about logging in to see images
  const [showLoginMessage, setShowLoginMessage] = useState(true);

  // Process skin items from API response
  const processSkinItems = useCallback((items: SkinportItem[]): SkinItem[] => {
    if (!items || !Array.isArray(items)) return [];
    return items
      .filter(item => {
        const marketPrice = item.suggested_price;
        const ourPrice = marketPrice * 0.7; // 70% of market price
        return ourPrice >= 20 && marketPrice < 500; // Minimum 20 PLN sale price (our price)
      })
      .map((item, index) => {
        const nameParts = item.market_hash_name.split(' (');
        const baseName = nameParts[0];
        const wear = nameParts.length > 1 ? nameParts[1].replace(')', '') : 'Field-Tested';
        
        const isStatTrak = baseName.includes('StatTrak™');
        const isSouvenir = baseName.includes('Souvenir');
        
        const cleanName = baseName
          .replace('StatTrak™ ', '')
          .replace('Souvenir ', '')
          .replace('★ ', '');
        
        const weaponType = getWeaponType(cleanName);
        const marketPrice = parseFloat(item.suggested_price.toFixed(2));
        const ourPrice = parseFloat((marketPrice * 0.7).toFixed(2));
        
        // Generate Steam market URL
        const getSteamMarketUrl = (hashName: string) => {
          const encodedName = encodeURIComponent(hashName);
          return `https://steamcommunity.com/market/listings/730/${encodedName}`;
        };
        
        // Determine the appropriate image based on weapon name
        let skinImage = defaultSkin; // Default image
        
        // Check for knives and melee weapons
        if (cleanName.includes('Knife') || cleanName.includes('Karambit') || cleanName.includes('Bayonet') ||
            cleanName.includes('Butterfly') || cleanName.includes('Huntsman') || cleanName.includes('Falchion') ||
            cleanName.includes('Shadow Daggers') || cleanName.includes('Navaja') || cleanName.includes('Stiletto') ||
            cleanName.includes('Talon') || cleanName.includes('Ursus') || cleanName.includes('Classic Knife') ||
            cleanName.includes('Nomad Knife') || cleanName.includes('Skeleton Knife') || cleanName.includes('Survival Knife') ||
            cleanName.includes('Paracord Knife') || cleanName.includes('★')) {
          skinImage = skinKnife;
        } 
        // Check for pistols
        else if (cleanName.includes('USP') || cleanName.includes('Glock') || cleanName.includes('P2000') ||
                 cleanName.includes('P250') || cleanName.includes('Five-SeveN') || cleanName.includes('Tec-9') ||
                 cleanName.includes('CZ75') || cleanName.includes('Desert Eagle') || cleanName.includes('Dual') ||
                 cleanName.includes('R8')) {
          skinImage = skinPistol;
        }
        // Check for gloves
        else if (cleanName.includes('Gloves') || cleanName.includes('Hand Wraps') || cleanName.includes('Moto Gloves') ||
                 cleanName.includes('Specialist Gloves') || cleanName.includes('Sport Gloves') ||
                 cleanName.includes('Bloodhound') || cleanName.includes('Hydra') || cleanName.includes('Driver')) {
          skinImage = skinGloves;
        }
        // Check for stickers
        else if (cleanName.includes('Sticker') || cleanName.includes('Sticker | ')) {
          skinImage = skinSticker;
        }
        const imageUrl = skinImage;
        
        return {
          id: item.id ? item.id.toString() : `item-${index}-${Date.now()}`,
          name: cleanName,
          marketPrice,
          ourPrice,
          rarity: getRarity(marketPrice),
          image: imageUrl,
          weaponType,
          wear: mapWear(wear),
          statTrak: isStatTrak,
          souvenir: isSouvenir,
          market_hash_name: item.market_hash_name,
          steam_url: getSteamMarketUrl(item.market_hash_name)
        };
      });
  }, []);

  // Initial fetch with cleanup
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchSkinData = async () => {
      try {
        setIsLoading(true);
        const data = await getItemPrices(730, 'PLN', controller.signal);
        const skinportItems = data;
        
        // Process the items
        const processedSkins = processSkinItems(skinportItems);
        
        // Sort by price
        const sortedSkins = [...processedSkins].sort((a, b) => a.marketPrice - b.marketPrice);
        
        // Update state
        if (isMounted) {
          setAllSkins(sortedSkins);
          setFilteredSkins(sortedSkins.slice(0, 50));
        }
      } catch (error) {
        console.error('Error fetching skins:', error);
        if (isMounted) {
          setAllSkins([]);
          setFilteredSkins([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSkinData();
    
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [processSkinItems]);

  // Memoize the filter function to prevent unnecessary re-renders
  const filterSkins = useCallback(() => {
    if (allSkins.length === 0) return [];

    const query = searchQuery.toLowerCase().trim();
    
    // Use a single filter pass for better performance
    return allSkins.filter(skin => {
      // Apply price filter first (cheapest operation)
      if (skin.marketPrice >= 500) return false;
      
      // Apply search query filter
      if (searchQuery) {
        const matchesQuery = 
          skin.weaponType?.toLowerCase().includes(query) || 
          skin.name?.toLowerCase().includes(query) ||
          skin.market_hash_name?.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }
      
      // Define weapon categories and their corresponding weapon types
      const weaponCategories = {
        knife: ['Karambit', 'Knife', 'Bayonet', 'Butterfly', 'Huntsman', 'Falchion', 'Shadow Daggers', 'Navaja', 'Stiletto', 'Talon', 'Ursus', 'Classic Knife', 'Nomad Knife', 'Skeleton Knife', 'Survival Knife', 'Paracord Knife'],
        rifle: ['AWP', 'AK-47', 'M4A4', 'M4A1-S', 'FAMAS', 'Galil AR', 'SG 553', 'AUG', 'SSG 08', 'SCAR-20', 'G3SG1'],
        pistol: ['USP-S', 'Glock-18', 'P2000', 'P250', 'Five-SeveN', 'Tec-9', 'CZ75-Auto', 'Desert Eagle', 'Dual Berettas', 'R8 Revolver'],
        smg: ['MAC-10', 'MP5-SD', 'MP7', 'MP9', 'PP-Bizon', 'P90', 'UMP-45'],
        heavy: ['Nova', 'XM1014', 'Sawed-Off', 'MAG-7', 'M249', 'Negev'],
        gloves: ['Gloves', 'Hand Wraps', 'Moto Gloves', 'Specialist Gloves', 'Sport Gloves', 'Bloodhound Gloves', 'Hydra Gloves', 'Driver Gloves'],
        sticker: ['Sticker', 'Sticker Capsule', 'Sticker | '],
        other: []
      };

      // Apply category filter if not 'all'
      if (selectedCategory !== 'all') {
        const categoryWeapons = weaponCategories[selectedCategory as keyof typeof weaponCategories] || [];
        
        // Special case for stickers which might be part of the name
        if (selectedCategory === 'sticker') {
          if (!categoryWeapons.some(weapon => 
            skin.name?.includes(weapon) || skin.market_hash_name?.includes(weapon)
          )) {
            return false;
          }
        } 
        // For other categories, check weapon type
        else if (!categoryWeapons.some(weapon => 
          skin.weaponType?.includes(weapon)
        )) {
          return false;
        }
      }
      
      // Apply wear filter
      if (selectedWear !== 'all') {
        const wearMap: Record<string, string> = {
          'fn': 'Factory New',
          'mw': 'Minimal Wear',
          'ft': 'Field-Tested',
          'ww': 'Well-Worn',
          'bs': 'Battle-Scarred'
        };
        if (skin.wear !== wearMap[selectedWear]) return false;
      }
      
      // Apply rarity filter
      if (selectedRarity !== 'all' && skin.rarity !== selectedRarity) {
        return false;
      }
      
      return true;
    });
  }, [allSkins, searchQuery, selectedCategory, selectedWear, selectedRarity]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [searchQuery, selectedCategory, selectedWear, selectedRarity]);

  // Memoize the filtered skins to prevent unnecessary recalculations
  const memoizedFilteredSkins = useMemo(() => {
    return filterSkins();
  }, [allSkins, searchQuery, selectedCategory, selectedWear, selectedRarity]);

  // Update visible skins when filters or visible count changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const visibleSkins = memoizedFilteredSkins.slice(0, visibleCount);
      setFilteredSkins(visibleSkins);
      setHasMore(memoizedFilteredSkins.length > visibleCount);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [memoizedFilteredSkins, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 20);
  };

  // Usunięto pełnoekranowe ładowanie, aby strona ładowała się od razu

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
        {showLoginMessage && (
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6 relative">
            <button 
              onClick={() => setShowLoginMessage(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>
            <h3 className="font-bold text-blue-300 mb-2">ℹ️ {t('importantInfo')}</h3>
            <p className="text-sm text-gray-300">
              {t('calculatorImageInfo')} <br />
              {t('loginToSeeImages')}
            </p>
          </div>
        )}
        <div className="bg-[var(--bgColor)] rounded-xl p-6">
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
                className="bg-[var(--secondaryBgColor)] border border-gray-700 rounded-lg p-2 text-sm flex-1 cursor-pointer"
              >
                {categoryIds.map(categoryId => (
                  <option key={categoryId} value={categoryId}>
                    {t(categoryId === 'all' ? 'allCategories' : categoryId)}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedWear}
                onChange={(e) => setSelectedWear(e.target.value)}
                className="bg-[var(--secondaryBgColor)] border border-gray-700 rounded-lg p-2 text-sm flex-1 cursor-pointer"
              >
                {wearIds.map(wearId => (
                  <option key={wearId} value={wearId}>
                    {t(wearId === 'all' ? 'allWear' : wearId === 'fn' ? 'factoryNew' : wearId === 'mw' ? 'minimalWear' : wearId === 'ft' ? 'fieldTested' : wearId === 'ww' ? 'wellWorn' : 'battleScarred')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results grid */}
          <div className="mt-8 relative min-h-[300px]">
            {isLoading && (
              <div className="absolute inset-0 bg-[var(--bgColor)]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--btnColor)] mb-4"></div>
                <p className="text-gray-200">{t('loadingSkins') || 'Ładowanie przedmiotów...'}</p>
                <p className="text-gray-400 text-sm mt-2">{t('pleaseWait') || 'Proszę czekać, to może chwilę potrwać...'}</p>
              </div>
            )}
            {filteredSkins.length === 0 && !isLoading ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">
                  {t('noSkinsFound') || 'Nie znaleziono przedmiotów'}
                </div>
                <p className="text-gray-500 text-sm">
                  {t('tryDifferentFilters') || 'Spróbuj zmienić filtry wyszukiwania'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSkins.map((skin) => (
                  <div key={skin.id} className="relative group">
                    <SkinItem 
                      skin={skin} 
                      colors={rarityColors[skin.rarity] || rarityColors.common} 
                    />
                    {skin.steam_url && (
                      <a 
                        href={skin.steam_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute inset-0 z-10"
                        aria-label={`View ${skin.name} on Steam`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="bg-[var(--btnColor)] text-black px-6 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Załaduj więcej
                </button>
              </div>
            )}
          </div>

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
    </div>
  );
};

interface SkinItemProps {
  skin: SkinItem;
  colors: {
    bg: string;
    text: string;
    border: string;
  };
}

// Memoized SkinItem component to prevent unnecessary re-renders
const SkinItem = memo(({ skin, colors }: SkinItemProps) => {
  return (
    <div 
      className="relative bg-[var(--secondaryBgColor)] rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
      style={{
        border: `1px solid ${colors.border}20`,
        background: `linear-gradient(145deg, ${colors.bg}30, ${colors.bg}10)`
      }}
    >
      <div className="h-32 flex items-center justify-center p-2">
        <SkinImage 
          src={skin.image}
          alt={skin.name || 'CS:GO Skin'}
          className="h-full w-auto group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
        />
      </div>
      
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-md rounded-full w-32 h-32 mx-auto mt-16"
        style={{ background: `${colors.border}/10` }}
      />
      
      {(skin.statTrak || skin.souvenir) && (
        <div className="absolute top-2 right-2 flex flex-col gap-1">
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
        <div className="text-sm font-medium mb-1 group-hover:text-white transition-colors duration-300">
          {skin.name}
        </div>
        <div className="text-sm text-gray-400 mb-2">{skin.weaponType}</div>
        <div className="text-lg font-bold group-hover:scale-110 transition-transform duration-300" style={{ color: colors.border }}>
          {skin.ourPrice.toFixed(2)} PLN
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Rynkowa: {skin.marketPrice.toFixed(2)} PLN
        </div>
      </div>
    </div>
  );
}, (prevProps: SkinItemProps, nextProps: SkinItemProps) => {
  // Only re-render if skin or colors have changed
  return (
    prevProps.skin.id === nextProps.skin.id &&
    prevProps.skin.image === nextProps.skin.image &&
    prevProps.colors.bg === nextProps.colors.bg &&
    prevProps.colors.text === nextProps.colors.text &&
    prevProps.colors.border === nextProps.colors.border
  );
});

export default Calculator;
