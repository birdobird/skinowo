import tosHeroImgPl from '/src/assets/tos-heros.png';
import tosHeroImgEn from '/src/assets/tos-heros-en.png';
import { useLanguage } from '../../context/LanguageContext';

const Terms = () => {
  const { language } = useLanguage();
  return (
    <div className="bg-[var(--secondaryBgColor)] relative overflow-hidden">
      <div className="container mx-auto px-4 py-22 relative z-10">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Left side - Terms and Privacy Policy content */}
          <div className="w-full md:w-1/2">
            <h1 className="text-2xl font-black mb-6">Regulamin i polityka prywatności</h1>
            
            {/* Content with real scrollbar */}
            <div className="pr-4 max-h-[600px] overflow-y-auto w-full terms-scrollbar">
              {/* Regulamin */}
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-6 text-[var(--btnColor)]">§1 Strony transakcji</h2>
                <p className="mb-6 text-xs text-gray-300 leading-relaxed">
                  These Terms and Conditions (hereinafter referred to as the "Agreement") govern the contractual relationship between the parties, Overpayed K.V. on the one hand (hereinafter referred to as "Overpayed", "We" or "Our") and by you as a user on the other hand (hereinafter referred to as "User", "You" or "Your"), collectively the "Parties".
                  <br /><br />
                  Overpayed is a company registered and incorporated under the laws of Curacao, with registration number 161142 (0) and registered address at Abraham de Veerstraat, Curacao.
                  <br /><br />
                  "User" means the person who agrees to these Terms and Conditions.
                  <br /><br />
                  By accepting this Agreement, the User hereby represents and warrants that he has carefully read this Agreement before using Our Website https://name.com (hereinafter referred to as the "Website" or "Site") and undertakes to comply with and adhere to all conditions defined by the Parties in this Agreement.
                </p>
              </div>
              
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-6 text-[var(--btnColor)]">§1 Strony transakcji</h2>
                <p className="mb-6 text-xs text-gray-300 leading-relaxed">
                  These Terms and Conditions (hereinafter referred to as the "Agreement") govern the contractual relationship between the parties, Overpayed K.V. on the one hand (hereinafter referred to as "Overpayed", "We" or "Our") and by you as a user on the other hand (hereinafter referred to as "User", "You" or "Your"), collectively the "Parties".
                  <br /><br />
                  Overpayed is a company registered and incorporated under the laws of Curacao, with registration number 161142 (0) and registered address at Abraham de Veerstraat, Curacao.
                  <br /><br />
                  "User" means the person who agrees to these Terms and Conditions.
                  <br /><br />
                  By accepting this Agreement, the User hereby represents and warrants that he has carefully read this Agreement before using Our Website https://name.com (hereinafter referred to as the "Website" or "Site") and undertakes to comply with and adhere to all conditions defined by the Parties in this Agreement.
                </p>
              </div>
              
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-6 text-[var(--btnColor)]">§1 Strony transakcji</h2>
                <p className="mb-6 text-xs text-gray-300 leading-relaxed">
                  These Terms and Conditions (hereinafter referred to as the "Agreement") govern the contractual relationship between the parties, Overpayed K.V. on the one hand (hereinafter referred to as "Overpayed", "We" or "Our") and by you as a user on the other hand (hereinafter referred to as "User", "You" or "Your"), collectively the "Parties".
                  <br /><br />
                  Overpayed is a company registered and incorporated under the laws of Curacao, with registration number 161142 (0) and registered address at Abraham de Veerstraat, Curacao.
                  <br /><br />
                  "User" means the person who agrees to these Terms and Conditions.
                  <br /><br />
                  By accepting this Agreement, the User hereby represents and warrants that he has carefully read this Agreement before using Our Website https://name.com (hereinafter referred to as the "Website" or "Site") and undertakes to comply with and adhere to all conditions defined by the Parties in this Agreement.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right side - Image */}
          <div className="w-full md:w-1/2 flex justify-end sticky mt-3">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[25rem] h-[25rem] rounded-full bg-[var(--btnColor)]/25 blur-[80px] z-0"></div>
            <img src={language === 'en' ? tosHeroImgEn : tosHeroImgPl} alt="Terms of Service" className="max-w-full h-auto z-10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
