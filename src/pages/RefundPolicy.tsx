import { Link } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

// Helper function to safely get translation value
const getTranslation = (t: (key: string) => any, key: string, defaultValue: string = '') => {
  const value = t(key);
  return value && typeof value === 'string' ? value : defaultValue;
};

// Helper function to safely get translation array
const getTranslationArray = (t: (key: string) => any, key: string): string[] => {
  const value = t(key);
  return Array.isArray(value) ? value : [];
};

const RefundPolicy = () => {
  const { t } = useLanguage();
  
  // Pobierz tłumaczenia
  const itemsList = getTranslationArray(t, 'nonRefundableItemsList');
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link 
          to="/" 
          className="flex items-center text-[var(--btnColor)] hover:underline mb-4"
        >
          <FaArrowLeft className="mr-2" /> {t('backToHome')}
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">
          {getTranslation(t, 'refundPolicyTitle', 'Refund Policy')}
        </h1>
        <p className="text-gray-400">
          {getTranslation(t, 'effectiveDate', 'Effective Date: N/A')}
        </p>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-6 text-gray-300">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {getTranslation(t, 'generalRefundPolicy', '1. General Refund Policy')}
          </h2>
          <p className="mb-4 text-gray-300">
            {getTranslation(t, 'generalRefundText', 'All transactions are final and non-refundable.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {getTranslation(t, 'nonRefundableItems', '2. Non-Refundable Items')}
          </h2>
          <p className="mb-2 text-gray-300">
            {getTranslation(t, 'nonRefundableItemsDescription', 'The following items are non-refundable:')}
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {itemsList.length > 0 ? (
              itemsList.map((item: string, index: number) => (
                <li key={index} className="text-gray-300">{item}</li>
              ))
            ) : (
              <li className="text-gray-300">No items listed</li>
            )}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {getTranslation(t, 'billingDiscrepancies', '3. Billing Discrepancies')}
          </h2>
          <p className="text-gray-300">
            {getTranslation(t, 'billingDiscrepanciesText', 'If you believe there is an error in your billing, please contact support.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {getTranslation(t, 'chargebacks', '4. Chargebacks')}
          </h2>
          <p className="text-gray-300">
            {getTranslation(t, 'chargebacksText', 'Unauthorized chargebacks may result in account suspension.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {getTranslation(t, 'finalDecision', '5. Final Decision')}
          </h2>
          <p className="text-gray-300">
            {getTranslation(t, 'finalDecisionText', 'All decisions regarding refunds are final.')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            {getTranslation(t, 'contactUs', '6. Contact Us')}
          </h2>
          <p className="text-gray-300">
            {getTranslation(t, 'contactUsText', 'If you have any questions, please contact our support team:')}
          </p>
          <p className="mt-4">
            <a 
              href="mailto:support@skinowo.com" 
              className="text-[var(--btnColor)] hover:underline flex items-center text-lg"
            >
              <FaEnvelope className="mr-2" /> support@skinowo.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy;
