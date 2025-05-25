import bgBlurDots from '/src/assets/bg-blur-dots.png';
import { useLanguage } from '../../context/LanguageContext';
import FAQ from '../../components/FAQ';

const HowItWorks = () => {
  const { t } = useLanguage();
  return (
    <div className="relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -left-32 top-96 w-[25rem] h-[25rem] rounded-full bg-[var(--btnColor)]/8 blur-[80px] z-0"></div>
      <div className="absolute -right-42 top-84 w-[25rem] h-[25rem] rounded-full bg-[var(--btnColor)]/7 blur-[80px] z-0"></div>
      
      {/* Hero section */}
      <div className="relative w-full overflow-hidden" style={{ backgroundImage: `url(${bgBlurDots})`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '4rem 0' }}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-black mb-4 uppercase tracking-wide">{t('howItWorksTitle')}</h1>
            <p className="text-md mb-6 text-gray-300">
              {t('howItWorksDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto py-12 px-4 relative z-10">
        {/* Process steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-[var(--bgColor)] rounded-xl p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 border border-blue-500/20">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-blue-500 text-2xl font-bold">{t('step1')}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{t('step1Title')}</h3>
                <p className="text-gray-400 text-sm">
                  {t('step1Desc')}
                </p>
              </div>
            </div>

            <div className="bg-[var(--bgColor)] rounded-xl p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 border border-purple-500/20">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-purple-500 text-2xl font-bold">{t('step2')}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{t('step2Title')}</h3>
                <p className="text-gray-400 text-sm">
                  {t('step2Desc')}
                </p>
              </div>
            </div>

            <div className="bg-[var(--bgColor)] rounded-xl p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 border border-green-500/20">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-green-500 text-2xl font-bold">{t('step3')}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{t('step3Title')}</h3>
                <p className="text-gray-400 text-sm">
                  {t('step3Desc')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-[var(--bgColor)] rounded-xl p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 border border-amber-500/20">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-amber-500 text-2xl font-bold">{t('step4') || '4'}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{t('step4Title') || 'Użyj naszego Trade Link'}</h3>
                <p className="text-gray-400 text-sm">
                  {t('step4Desc') || 'Skopiuj nasz Trade Link, który znajdziesz w formularzu sprzedaży. Będziesz go potrzebował do wysłania nam swoich przedmiotów przez Steam.'}
                </p>
              </div>
            </div>

            <div className="bg-[var(--bgColor)] rounded-xl p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 border border-pink-500/20">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl group-hover:bg-pink-500/20 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-pink-500 text-2xl font-bold">{t('step5') || '5'}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{t('step5Title') || 'Wyślij przedmioty'}</h3>
                <p className="text-gray-400 text-sm">
                  {t('step5Desc') || 'Po zaakceptowaniu oferty, wyślij wybrane przedmioty za pomocą oferty wymiany Steam. Potwierdź wysłanie, zaznaczając odpowiednie pole w formularzu.'}
                </p>
              </div>
            </div>

            <div className="bg-[var(--bgColor)] rounded-xl p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 border border-cyan-500/20">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-cyan-500 text-2xl font-bold">{t('step6') || '6'}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{t('step6Title') || 'Otrzymaj natychmiastową wypłatę'}</h3>
                <p className="text-gray-400 text-sm">
                  {t('step6Desc') || 'Po potwierdzeniu otrzymania przedmiotów, natychmiast wypłacamy środki na wskazane konto. Cały proces trwa zaledwie kilka minut!'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why choose us section */}
        <div className="bg-[var(--bgColor)] rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('whyChooseUs') || 'Dlaczego warto wybrać Skinowo?'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">{t('instantPayouts') || 'Błyskawiczne wypłaty'}</h3>
              <p className="text-sm text-gray-400">{t('instantPayoutsDesc') || 'Otrzymujesz pieniądze w ciągu kilku minut od zaakceptowania oferty.'}</p>
            </div>
            
            <div className="p-4 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">{t('secureTransactions') || 'Bezpieczne transakcje'}</h3>
              <p className="text-sm text-gray-400">{t('secureTransactionsDesc') || 'Gwarantujemy pełne bezpieczeństwo każdej transakcji i ochrona danych osobowych.'}</p>
            </div>
            
            <div className="p-4 text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">{t('competitivePrices') || 'Konkurencyjne ceny'}</h3>
              <p className="text-sm text-gray-400">{t('competitivePricesDesc') || 'Oferujemy 70% wartości rynkowej za Twoje skiny – jedna z najlepszych ofert na rynku.'}</p>
            </div>
            
            <div className="p-4 text-center">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.5 9.5c.96-1.35 2.755-1.772 4.2-.833 1.445.94 1.844 2.834.901 4.267-1.826 2.778-5.101 3.347-5.101 3.347" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">{t('support247') || 'Wsparcie 24/7'}</h3>
              <p className="text-sm text-gray-400">{t('support247Desc') || 'Nasz zespół wsparcia jest dostępny przez całą dobę, aby pomóc Ci w każdej sytuacji.'}</p>
            </div>
          </div>
        </div>

        {/* FAQ section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">{t('howItWorksFaq.title')}</h2>
          </div>
          
          <div className="custom-faq-container">
            <FAQ 
              customFaqItems={[
                {
                  question: t('howItWorksFaq.question1'),
                  answer: t('howItWorksFaq.answer1')
                },
                {
                  question: t('howItWorksFaq.question2'),
                  answer: t('howItWorksFaq.answer2')
                },
                {
                  question: t('howItWorksFaq.question3'),
                  answer: t('howItWorksFaq.answer3')
                },
                {
                  question: t('howItWorksFaq.question4'),
                  answer: t('howItWorksFaq.answer4')
                }
              ]}
              withTitle={false}
              withBackground={false}
            />
          </div>
        </div>

        {/* CTA section */}
        <div className="mt-16 bg-gradient-to-r from-[var(--bgColor)] to-[var(--secondaryBgColor)] rounded-xl p-8 text-center relative overflow-hidden border border-[var(--btnColor)]/20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-10 top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-xl"></div>
            <div className="absolute right-10 top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
            <div className="absolute -right-10 bottom-10 w-40 h-40 bg-green-500/10 rounded-full blur-xl"></div>
            <div className="absolute left-10 bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-xl"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">{t('readyToSell') || 'Gotowy, aby sprzedać swoje skiny?'}</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {t('readyToSellDesc') || 'Dołącz do tysięcy zadowolonych graczy, którzy już skorzystali z naszej platformy. Sprzedaj swoje skiny z CS2 szybko, bezpiecznie i po najlepszych cenach na rynku!'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/login" className="bg-[var(--btnColor)] text-black px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                {t('loginAndSellNow') || 'Zaloguj się i sprzedaj teraz'}
              </a>
              <a href="/calculator" className="bg-[var(--btnColor)] text-black px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                {t('checkSkinsValue') || 'Sprawdź wartość swoich skinów'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
