import { useState, useEffect } from 'react';
import bgBlurDots from '/src/assets/bg-blur-dots.png';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

type SupportCategory = 'general' | 'payment' | 'technical' | 'other';

const Support = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<SupportCategory>('general');
  const [message, setMessage] = useState('');
  const [steamId, setSteamId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'faq'>('contact');
  const [steamIdSuggestions, setSteamIdSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Przykładowe sugestie Steam ID dla demonstracji funkcji autocomplete
  const sampleSteamIds = [
    '76561198012345678',
    '76561198087654321',
    '76561198055555555',
    '76561198099999999',
    '76561198076543210',
    '76561198023456789',
    '76561198034567890',
    '76561198045678901',
    '76561198056789012',
    '76561198067890123',
  ];
  
  // Historia ostatnio używanych Steam ID
  const [recentSteamIds, setRecentSteamIds] = useState<string[]>([]);
  
  // Pobierz historię Steam ID z localStorage przy ładowaniu komponentu
  useEffect(() => {
    const storedIds = localStorage.getItem('recentSteamIds');
    if (storedIds) {
      setRecentSteamIds(JSON.parse(storedIds));
    }
  }, []);
  
  // Automatycznie wypełnij Steam ID jeśli użytkownik jest zalogowany
  useEffect(() => {
    if (user && user.steamId) {
      setSteamId(user.steamId);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Dodaj Steam ID do historii ostatnio używanych ID, jeśli nie jest puste
    if (steamId.trim() !== '') {
      if (!recentSteamIds.includes(steamId)) {
        const newRecentIds = [steamId, ...recentSteamIds].slice(0, 5); // Zachowaj maksymalnie 5 ostatnich ID
        setRecentSteamIds(newRecentIds);
        localStorage.setItem('recentSteamIds', JSON.stringify(newRecentIds));
      }
    }
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setName('');
      setEmail('');
      setCategory('general');
      setMessage('');
      setSteamId('');
    }, 1500);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -left-32 top-96 w-[25rem] h-[25rem] rounded-full bg-[var(--btnColor)]/8 blur-[80px] z-0"></div>
      <div className="absolute -right-42 top-84 w-[25rem] h-[25rem] rounded-full bg-[var(--btnColor)]/7 blur-[80px] z-0"></div>
      
      {/* Hero section */}
      <div className="relative w-full overflow-hidden" style={{ backgroundImage: `url(${bgBlurDots})`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '4rem 0' }}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-black mb-4 uppercase tracking-wide">{t('supportTitle')}</h1>
            <p className="text-md mb-6 text-gray-300">
              {t('supportDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto py-12 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex mb-8 border-b border-gray-700">
            <button 
              className={`px-6 py-3 cursor-pointer font-medium text-sm ${activeTab === 'contact' ? 'text-[var(--btnColor)] border-b-2 border-[var(--btnColor)]' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('contact')}
            >
              {t('contactForm')}
            </button>
            <button 
              className={`px-6 py-3 cursor-pointer font-medium text-sm ${activeTab === 'faq' ? 'text-[var(--btnColor)] border-b-2 border-[var(--btnColor)]' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('faq')}
            >
              {t('faqTitle')}
            </button>
          </div>

          {/* Contact Form */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                {isSubmitted ? (
                  <div className="bg-green-900/30 border border-green-700 rounded-xl p-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-bold mb-2">{t('messageSent')}</h3>
                    <p className="text-gray-300 mb-4">
                      {t('thankYou')}
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="bg-[var(--btnColor)] text-black px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      {t('sendNewMessage')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-[var(--bgColor)] rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-6">{t('contactUs')}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">{t('name')}</label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full bg-[var(--secondaryBgColor)] border border-gray-700 rounded-lg p-3 text-sm"
                          placeholder={t('name')}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">{t('email')}</label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full bg-[var(--secondaryBgColor)] border border-gray-700 rounded-lg p-3 text-sm"
                          placeholder="twoj@email.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium mb-2">{t('category')}</label>
                        <select
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value as SupportCategory)}
                          className="w-full bg-[var(--secondaryBgColor)] border border-gray-700 rounded-lg p-3 text-sm"
                        >
                          <option value="general">{t('generalQuestions')}</option>
                          <option value="payment">{t('paymentIssues')}</option>
                          <option value="technical">{t('technicalIssues')}</option>
                          <option value="other">{t('other')}</option>
                        </select>
                      </div>
                      <div className="relative">
                        <label htmlFor="steamId" className="block text-sm font-medium mb-2">{t('steamId')}</label>
                        <div className="relative">
                          <input
                            type="text"
                            id="steamId"
                            value={steamId}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSteamId(value);
                              
                              // Filtrowanie sugestii na podstawie wprowadzonego tekstu
                              if (value.length > 0) {
                                // Łączymy przykładowe ID z historią ostatnio używanych ID
                                const allIds = [...new Set([...sampleSteamIds, ...recentSteamIds])];
                                const filtered = allIds.filter(id => 
                                  id.toLowerCase().includes(value.toLowerCase())
                                );
                                setSteamIdSuggestions(filtered);
                                setShowSuggestions(filtered.length > 0);
                              } else {
                                // Jeśli pole jest puste, pokaż ostatnio używane ID
                                setSteamIdSuggestions(recentSteamIds.length > 0 ? recentSteamIds : sampleSteamIds);
                                setShowSuggestions(recentSteamIds.length > 0 || sampleSteamIds.length > 0);
                              }
                            }}
                            onFocus={() => {
                              // Przy focusie pokaż ostatnio używane ID lub wszystkie przykładowe
                              if (steamId.length > 0) {
                                const allIds = [...new Set([...sampleSteamIds, ...recentSteamIds])];
                                const filtered = allIds.filter(id => 
                                  id.toLowerCase().includes(steamId.toLowerCase())
                                );
                                setSteamIdSuggestions(filtered);
                                setShowSuggestions(filtered.length > 0);
                              } else {
                                setSteamIdSuggestions(recentSteamIds.length > 0 ? recentSteamIds : sampleSteamIds);
                                setShowSuggestions(recentSteamIds.length > 0 || sampleSteamIds.length > 0);
                              }
                            }}
                            onBlur={() => {
                              // Opóźnij ukrycie sugestii, aby można było kliknąć na sugestię
                              setTimeout(() => setShowSuggestions(false), 200);
                            }}
                            className="w-full bg-[var(--secondaryBgColor)] border border-gray-700 rounded-lg p-3 pl-10 text-sm"
                            placeholder="Twój Steam ID"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                            </svg>
                          </div>
                          {user && user.steamId && steamId !== user.steamId && (
                            <button 
                              type="button"
                              onClick={() => setSteamId(user.steamId)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--btnColor)] hover:underline"
                            >
                              {t('useMyId')}
                            </button>
                          )}
                        </div>
                        
                        {/* Lista sugestii */}
                        {showSuggestions && steamIdSuggestions.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full bg-[var(--secondaryBgColor)] border border-gray-700 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                            {recentSteamIds.length > 0 && steamIdSuggestions.some(id => recentSteamIds.includes(id)) && (
                              <div className="p-2 text-xs text-gray-400 bg-gray-800/50">{t('recentlyUsed') || 'Ostatnio używane'}</div>
                            )}
                            {steamIdSuggestions.map((suggestion, index) => {
                              const isRecent = recentSteamIds.includes(suggestion);
                              return (
                                <div 
                                  key={index}
                                  className={`p-3 hover:bg-gray-700 cursor-pointer text-sm flex items-center gap-2 transition-colors duration-150 ${isRecent ? 'border-l-2 border-[var(--btnColor)]' : ''}`}
                                  onClick={() => {
                                    setSteamId(suggestion);
                                    setShowSuggestions(false);
                                    
                                    // Dodaj do historii ostatnio używanych ID
                                    if (!recentSteamIds.includes(suggestion)) {
                                      const newRecentIds = [suggestion, ...recentSteamIds].slice(0, 5); // Zachowaj maksymalnie 5 ostatnich ID
                                      setRecentSteamIds(newRecentIds);
                                      localStorage.setItem('recentSteamIds', JSON.stringify(newRecentIds));
                                    }
                                  }}
                                >
                                  {isRecent ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                    </svg>
                                  )}
                                  <span>{suggestion}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium mb-2">{t('message')}</label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        className="w-full bg-[var(--secondaryBgColor)] border border-gray-700 rounded-lg p-3 text-sm"
                        placeholder={t('describeIssue') || "Opisz swój problem lub pytanie..."}
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[var(--btnColor)] text-black px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black"></span>
                          {t('sending')}
                        </span>
                      ) : (
                        t('sendMessage')
                      )}
                    </button>
                  </form>
                )}
              </div>
              
              <div>
                <div className="bg-[var(--bgColor)] rounded-xl p-6 mb-6">
                  <h3 className="font-bold mb-4">{t('contactDetails') || 'Dane kontaktowe'}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-[var(--btnColor)]/20 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--btnColor)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Email</h4>
                        <p className="text-sm text-gray-400">support@skinowo.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-[var(--btnColor)]/20 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--btnColor)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Discord</h4>
                        <p className="text-sm text-gray-400">discord.gg/skinowo</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-[var(--btnColor)]/20 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--btnColor)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Godziny wsparcia</h4>
                        <p className="text-sm text-gray-400">24/7, przez cały tydzień</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[var(--bgColor)] rounded-xl p-6">
                  <h3 className="font-bold mb-4">Szybkie wsparcie</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Potrzebujesz natychmiastowej pomocy? Dołącz do naszego serwera Discord, gdzie nasz zespół wsparcia jest dostępny 24/7.
                  </p>
                  <a 
                    href="https://discord.gg/FBBsKTUV" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#5865F2] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#4752C4] transition-colors w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
                    </svg>
                    Dołącz do Discord
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {activeTab === 'faq' && (
            <div className="bg-[var(--bgColor)] rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">{t('faqSectionTitle')}</h2>
              
              <div className="space-y-6">
                <div className="border-b border-gray-700 pb-6">
                  <h3 className="font-bold mb-2">{t('faqHowLongSelling')}</h3>
                  <p className="text-gray-400">
                    {t('faqHowLongSellingAnswer')}
                  </p>
                </div>
                
                <div className="border-b border-gray-700 pb-6">
                  <h3 className="font-bold mb-2">{t('faqPaymentMethods')}</h3>
                  <p className="text-gray-400">
                    {t('faqPaymentMethodsAnswer')}
                  </p>
                </div>
                
                <div className="border-b border-gray-700 pb-6">
                  <h3 className="font-bold mb-2">{t('faqTradeBan')}</h3>
                  <p className="text-gray-400">
                    {t('faqTradeBanAnswer')}
                  </p>
                </div>
                
                <div className="border-b border-gray-700 pb-6">
                  <h3 className="font-bold mb-2">{t('faqValueCalculation')}</h3>
                  <p className="text-gray-400">
                    {t('faqValueCalculationAnswer')}
                  </p>
                </div>
                
                <div className="border-b border-gray-700 pb-6">
                  <h3 className="font-bold mb-2">{t('faqTransactionIssue')}</h3>
                  <p className="text-gray-400">
                    {t('faqTransactionIssueAnswer')}
                  </p>
                </div>
                
                <div className="border-b border-gray-700 pb-6">
                  <h3 className="font-bold mb-2">{t('faqRegistrationRequired')}</h3>
                  <p className="text-gray-400">
                    {t('faqRegistrationRequiredAnswer')}
                  </p>
                </div>
                
                <div className="border-b border-gray-700 pb-6">
                  <h3 className="font-bold mb-2">{t('faqCancelTransaction')}</h3>
                  <p className="text-gray-400">
                    {t('faqCancelTransactionAnswer')}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">{t('faqTransactionSecurity')}</h3>
                  <p className="text-gray-400">
                    {t('faqTransactionSecurityAnswer')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
