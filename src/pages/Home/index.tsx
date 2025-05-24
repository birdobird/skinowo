// Import images
import karambitmImg from '/src/assets/karambit.png';
import iksImg from '/src/assets/iks.png';
import awpImg from '/src/assets/awp.png';
import bgBlurDots from '/src/assets/bg-blur-dots.png';
import heroSkins from '/src/assets/hero-skins.png';
import isItSoEasyImg from '/src/assets/is-it-soeasy.png';
import nowIKnowImg from '/src/assets/now-iknow.png';
import leftSkinsImg from '/src/assets/left-skins.png';
import rightSkinsImg from '/src/assets/right-skins.png';
// import curvedArrowImg from '/src/assets/curved-arrow.png';
import { useEffect, useState, useRef } from 'react';
import FAQ from '../../components/FAQ';

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

type SkinItem = {
  id: number;
  name: string;
  price: string;
  minutes: number;
  rarity: Rarity;
  image: string;
  weaponType: string;
};

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  const recentItems: SkinItem[] = [
    { id: 1, name: 'WATER ELEMENTAL (FT)', price: '$3.562', minutes: 5, rarity: 'mythical', image: karambitmImg, weaponType: 'Karambit' },
    { id: 2, name: 'WATER ELEMENTAL (FT)', price: '$3.913', minutes: 5, rarity: 'uncommon', image: karambitmImg, weaponType: 'Karambit' },
    { id: 3, name: 'WATER ELEMENTAL (FT)', price: '$2.545', minutes: 5, rarity: 'legendary', image: karambitmImg, weaponType: 'Karambit' },
    { id: 4, name: 'WATER ELEMENTAL (FT)', price: '$3.645', minutes: 5, rarity: 'uncommon', image: karambitmImg, weaponType: 'Karambit' },
    { id: 5, name: 'WATER ELEMENTAL (FT)', price: '$3.845', minutes: 5, rarity: 'mythical', image: karambitmImg, weaponType: 'Karambit' },
    { id: 6, name: 'WATER ELEMENTAL (FT)', price: '$3.525', minutes: 5, rarity: 'ancient', image: karambitmImg, weaponType: 'Karambit' },
  ];

  return (
    <div className="bg-[var(--secondaryBgColor)] relative overflow-hidden">
      <div className="absolute -left-32 top-96 w-[25rem] h-[25rem] rounded-full bg-[var(--btnColor)]/8 blur-[80px] z-0"></div>
      <div className="absolute -right-42 top-84 w-[25rem] h-[25rem] rounded-full bg-[var(--btnColor)]/7 blur-[80px] z-0"></div>      

      <div ref={heroRef} className="relative w-full overflow-hidden" style={{ backgroundImage: `url(${bgBlurDots})`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '6rem 0' }}>
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: `url(${heroSkins})`, 
            backgroundSize: 'cover', 
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
            transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="w-full mx-auto text-center">
            <h1 className="w-full text-4xl font-black mb-4 uppercase tracking-wide">Sprzedaj skiny z CS2 w sekundę!</h1>
            <p className="text-md mb-2 font-semibold">Szybko, bezpiecznie i bez czekania!</p>
            
            <p className="mb-10 text-sm opacity-90">
              Zamień swoje skiny z CS2 na prawdziwe pieniądze w zaledwie kilka kliknięć.<br />
              Nasza platforma oferuje natychmiastową wycenę i błyskawiczne wypłaty - sprzedawaj smart, bez przerwy i czekania!
            </p>
            
            <div className="flex justify-center items-center mt-8">
              <a href="#" className="bg-[var(--btnColor)] text-black px-12 py-3 uppercase font-medium text-sm rounded-br-3xl rounded-tl-3xl hover:opacity-90 transition-opacity">
                Sprzedaj przedmioty teraz
              </a>
              
              <div className="flex items-center mx-4">
                <img src={iksImg} alt="Arrow Right" className="w-12 h-12" />
              </div>
              
              <a href="#" className="bg-white text-black px-12 py-3 uppercase font-medium text-sm rounded-tr-3xl hover:opacity-90 transition-opacity">
                Oblicz ile otrzymam pieniędzy
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-16 px-24 relative z-10">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h3 className="text-xs font-semibold uppercase text-white mb-1">ZAMIENIAMY TWOJE SKINY</h3>
          </div>
          
          <div className="flex-1 flex justify-center">
            <img src={awpImg} alt="AWP Skin" className="h-36 object-contain" />
          </div>
          
          <div className="text-right">
            <h3 className="text-xs font-semibold uppercase text-white mb-1">NA CZYSTE PIENIĄDZE</h3>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 relative z-10">
        <h3 className="text-xs uppercase text-white font-semibold mb-6">OSTATNIE WYMIENIONE PRZEDMIOTY:</h3>
        
        <div className="grid grid-cols-6 gap-4">
          {recentItems.map(item => {
            const colors = rarityColors[item.rarity];
            
            return (
              <div key={item.id} className="relative overflow-hidden rounded-xl" style={{ border: `1px solid ${colors.border}55` }}>
                <div 
                  style={{ 
                    background: `linear-gradient(to top, ${colors.bg}, var(--bgColor))` 
                  }} 
                  className="p-4 pb-8 h-full relative"
                >
                  <div className="absolute top-2 left-2 text-xs font-medium text-white">{item.price}</div>
                  <div className="absolute top-2 right-2 text-[10px] text-white/60">{item.minutes} minut temu</div>
                  
                  <div className="flex justify-center items-center h-32 mt-4 py-20">
                    <img src={item.image} alt={item.weaponType} className="h-26 object-contain" />
                  </div>
                </div>
                
                <div 
                  className="absolute bottom-0 left-0 right-0 py-1 px-2" 
                  style={{ borderBottom: `4px solid ${colors.border}` }}
                >
                  <div className="flex flex-col justify-center">
                    <div className="text-[10px] font-medium text-white">{item.weaponType}</div>
                    <div style={{ color: colors.text }} className="text-[8px] font-semibold">{item.name}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="container mx-auto py-28 px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-black uppercase mb-6">JAK SPRZEDAĆ SWOJE SKINY?</h2>
            <p className="text-sm text-gray-300 mb-8">
              Zastanawiasz się, jak zamienić swoje skiny na prawdziwe pieniądze? To prostsze niż myślisz! Wystarczy kilka kroków, by sprzedać przedmioty z ekwipunku i otrzymać wypłatę bez czekania. Wybierz skiny, określ preferowaną metodę płatności i ciesz się gotówką na swoim koncie.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-[var(--btnColor)]/20 p-4 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--btnColor)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold uppercase text-white mb-1">WYBIERZ SWOJE SKINY</h3>
                  <p className="text-xs text-gray-400">
                    Zaloguj się do ekwipunku i wybierz skiny, które chcesz sprzedać. Możesz zaznaczać dowolną liczbę przedmiotów — od popularnych po te najbardziej unikalne.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="border-1 border-neutral-600 p-4 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold uppercase text-white mb-1">METODA WYPŁATY</h3>
                  <p className="text-xs text-gray-400">
                    Następnie zdecyduj, w jaki sposób chcesz otrzymać pieniądze. Oferujemy szeroki wybór metod wypłaty — od tradycyjnego przelewu bankowego po nowoczesne portfele cyfrowe.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="border-1 border-neutral-600 p-4 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold uppercase text-white mb-1">CIESZ SIĘ PIENIĘDZMI</h3>
                  <p className="text-xs text-gray-400">
                    Po kilku minutach zamówione pieniądze powinny być już na Twoim koncie. Szybko, bezpiecznie i bez zbędnych formalności.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[25rem] h-[25rem] rounded-full bg-[var(--fontColor)]/10 blur-[80px] z-0"></div>   
            <img src={isItSoEasyImg} alt="Jak sprzedać skiny" className="max-w-full h-auto rounded-lg z-10" />
          </div>
        </div>
      </div>

      {/* Animated CTA Section */}
      <div className="relative py-12 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-[var(--btnColor)] rounded-[60px] py-8 px-4 md:px-12 relative overflow-hidden">
            <div className="flex items-center justify-between">
              {/* Left skins image with animation */}
              <div className="hidden md:block w-1/4 relative">
                <img 
                  src={leftSkinsImg} 
                  alt="CS2 Skins" 
                  className="max-w-full h-auto" 
                  style={{
                    animation: 'float 6s ease-in-out infinite',
                    transform: 'translateY(0px)'
                  }}
                />
              </div>
              
              {/* Center content */}
              <div className="w-full md:w-2/4 text-center relative">
                <h2 className="text-2xl md:text-3xl font-black text-black uppercase mb-6">Wymień swój ekwipunek<br />i odbierz pieniądze już dziś!</h2>
                
                <div className="relative inline-block">
                  {/* <img 
                    src={curvedArrowImg} 
                    alt="Arrow" 
                    className="absolute -left-24 -top-12 w-24 h-auto hidden md:block" 
                  /> */}
                  
                  <a 
                    href="#" 
                    className="inline-block bg-[#222] hover:bg-[#333] text-white font-medium py-3 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Sprzedaj swój ekwipunek
                  </a>
                </div>
              </div>
              
              {/* Right skins image with animation */}
              <div className="hidden md:block w-1/4 relative">
                <img 
                  src={rightSkinsImg} 
                  alt="CS2 Skins" 
                  className="max-w-full h-auto" 
                  style={{
                    animation: 'float 6s ease-in-out infinite reverse',
                    transform: 'translateY(0px)',
                    animationDelay: '1s'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-4 px-4 relative z-10">
      <div className="absolute left-16 -top-16 w-[25rem] h-[25rem] rounded-full bg-[var(--btnColor)]/10 blur-[80px] z-0"></div>
        <img src={nowIKnowImg} alt="Jak sprzedać skiny" className="h-20 rounded-lg z-10 absolute right-0 top-20" />
        <h2 className="text-3xl font-black uppercase mb-4">POZNAJ ODPOWIEDZI NA PYTANIA</h2>
        <p className="text-sm text-gray-400 max-w-2xl">
          Masz wątpliwości? Chcesz dowiedzieć się jak działa system sprzedaży? Wyjaśnimy każdy aspekt transakcji, aby to było przejrzyste i bezpieczne. Jeśli nie znajdziesz odpowiedzi na swoje pytanie, zawsze możesz skontaktować się z naszym zespołem pomocy.
        </p>
        <FAQ withBackground={false} withTitle={false} />
      </div>
    </div>
  );
};

export default Home;
