import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

type FAQItemProps = FAQItem & {
  isOpen: boolean;
  onClick: () => void;
  isLast?: boolean;
};

const FAQItem = ({ question, answer, isOpen, onClick, isLast = false }: FAQItemProps) => {
  // Helper function to render content that could be string or string array
  const renderContent = (content: string | string[]) => {
    if (Array.isArray(content)) {
      return content.map((item, i) => (
        <p key={i} className="text-sm text-gray-400">{item}</p>
      ));
    }
    return <p className="text-sm text-gray-400">{content}</p>;
  };

  return (
    <div className={`${isLast ? '' : 'border-b border-gray-800'} bg-[var(--bgColor)]`}>
      <button
        className="w-full bg-[var(--bgColor)] cursor-pointer py-5 px-4 text-left flex justify-between items-center focus:outline-none"
        onClick={onClick}
      >
        <span className={`text-sm font-semibold ${isOpen ? 'text-[var(--btnColor)]' : 'text-white'}`}>
          {Array.isArray(question) ? question[0] : question}
        </span>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--btnColor)]' : 'text-gray-400'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden bg-[var(--bgColor)] transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 pb-5 px-4' : 'max-h-0 opacity-0'
        }`}
      >
        {renderContent(answer)}
      </div>
    </div>
  );
};

type FAQItem = {
  question: string | string[];
  answer: string | string[];
};

type FAQProps = {
  withBackground?: boolean;
  withTitle?: boolean;
  customFaqItems?: FAQItem[];
};

const FAQ = ({ withBackground = false, withTitle = true, customFaqItems }: FAQProps) => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultFaqItems = [
    {
      question: t('faq.question1'),
      answer: t('faq.answer1')
    },
    {
      question: t('faq.question2'),
      answer: t('faq.answer2')
    },
    {
      question: t('faq.question3'),
      answer: t('faq.answer3')
    },
    {
      question: t('faq.question4'),
      answer: t('faq.answer4')
    },
    {
      question: t('faq.question5'),
      answer: t('faq.answer5')
    }
  ];
  
  // Użyj niestandardowych elementów FAQ, jeśli zostały dostarczone, w przeciwnym razie użyj domyślnych
  const faqItems = customFaqItems || defaultFaqItems;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`${withBackground ? 'bg-[var(--secondaryBgColor)]' : ''} py-16 relative overflow-hidden`}>
      {withBackground && (
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full bg-[var(--btnColor)]/5 blur-[100px] z-0"></div>
      )}
      
      <div className="container mx-auto relative z-10">
        {withTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase mb-4">{t('homePage.faq.title')}</h2>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              {t('homePage.faq.description')}
            </p>
          </div>
        )}
        
        <div className="w-full rounded-lg overflow-hidden shadow-xl border border-gray-800 bg-[var(--bgColor)]">
          {faqItems.map((item: FAQItem, index: number) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => toggleFAQ(index)}
              isLast={index === faqItems.length - 1}
            />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
          {t('homePage.faq.noanswer')}
            <a href="/support" className="text-[var(--btnColor)] ml-1 hover:underline">
              {t('homePage.faq.contactUs')}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
