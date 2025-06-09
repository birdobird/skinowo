import tosHeroImgPl from '/src/assets/tos-heros.png';
import tosHeroImgEn from '/src/assets/tos-heros-en.png';
import { useLanguage } from '../../context/LanguageContext';

const Terms = () => {
  const { t, language } = useLanguage();
  
  // Helper function to render content with line breaks
  const renderContent = (content: string | string[]) => {
    // Convert string to array if it's a single string
    const contentArray = Array.isArray(content) ? content : [content];
    
    return contentArray.map((paragraph, index) => {
      // Skip if paragraph is not a string
      if (typeof paragraph !== 'string') return null;
      
      // Check if the line starts with a letter followed by a dot (like a., b., etc.)
      const isList = /^[a-z]\.\s/.test(paragraph.trim());
      const isSubList = /^\s{2,}[a-z]\.\s/.test(paragraph);
      
      if (isList || isSubList) {
        return (
          <div key={index} className={`${isSubList ? 'ml-6' : ''} text-xs text-gray-300 leading-relaxed`}>
            {paragraph}
          </div>
        );
      }
      
      return (
        <p key={index} className="mb-4 text-xs text-gray-300 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="bg-[var(--secondaryBgColor)] relative overflow-hidden">
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Left side - Terms and Privacy Policy content */}
          <div className="w-full md:w-1/2">
            <h1 className="text-2xl font-black mb-6">
              {t('termsTitle')}
            </h1>
            
            {/* Content with real scrollbar */}
            <div className="pr-4 max-h-[600px] overflow-y-auto w-full terms-scrollbar">
              {/* Terms of Service Header */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-2 text-[var(--btnColor)]">
                  {t('termsTitle')}
                </h2>
                <p className="text-xs text-gray-300 mb-6">
                  {t('termsEffectiveDate')}
                </p>
              </div>

              {/* General Provisions */}
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 text-[var(--btnColor)]">
                  {t('termsGeneralProvisions')}
                </h2>
                {renderContent(t('termsGeneralProvisionsContent') as string | string[])}
              </div>

              {/* Scope of Services */}
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 text-[var(--btnColor)]">
                  {t('termsScopeOfServices')}
                </h2>
                {renderContent(t('termsScopeOfServicesContent') as string | string[])}
              </div>

              {/* Login and User Access */}
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 text-[var(--btnColor)]">
                  {t('termsLoginAndUserAccess')}
                </h2>
                {renderContent(t('termsLoginAndUserAccessContent') as string | string[])}
              </div>

              {/* Payout Methods */}
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 text-[var(--btnColor)]">
                  {t('termsPayoutMethods')}
                </h2>
                {renderContent(t('termsPayoutMethodsContent') as string | string[])}
              </div>

              {/* Availability and Restrictions */}
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 text-[var(--btnColor)]">
                  {t('termsAvailabilityAndRestrictions')}
                </h2>
                {renderContent(t('termsAvailabilityAndRestrictionsContent') as string | string[])}
              </div>

              {/* Customer Support and Complaints */}
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 text-[var(--btnColor)]">
                  {t('termsCustomerSupport')}
                </h2>
                {renderContent(t('termsCustomerSupportContent') as string | string[])}
              </div>

              {/* Privacy Policy and Data Protection (GDPR) */}
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 text-[var(--btnColor)]">
                  {t('termsPrivacyPolicy')}
                </h2>
                {renderContent(t('termsPrivacyPolicyContent') as string | string[])}
              </div>

              {/* Cookies and Tracking Technologies */}
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 text-[var(--btnColor)]">
                  {t('termsCookies')}
                </h2>
                {renderContent(t('termsCookiesContent') as string | string[])}
              </div>

              {/* Final Provisions */}
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 text-[var(--btnColor)]">
                  {t('termsFinalProvisions')}
                </h2>
                {renderContent(t('termsFinalProvisionsContent') as string | string[])}
              </div>
            </div>
          </div>
          
          {/* Right side - Image */}
          <div className="w-full md:w-1/2 flex justify-end sticky mt-3">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[25rem] h-[25rem] rounded-full bg-[var(--btnColor)]/25 blur-[80px] z-0"></div>
            <img 
              src={language === 'en' ? tosHeroImgEn : tosHeroImgPl} 
              alt={t('termsTitle') as string} 
              className="max-w-full h-auto z-10" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
