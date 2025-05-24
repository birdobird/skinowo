import { useState } from 'react';

type FAQItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
};

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
  return (
    <div className="border-b border-gray-800 bg-[var(--bgColor)]">
      <button
        className="w-full bg-[var(--bgColor)] cursor-pointer py-5 px-4 text-left flex justify-between items-center focus:outline-none"
        onClick={onClick}
      >
        <span className={`text-sm font-semibold ${isOpen ? 'text-[var(--btnColor)]' : 'text-white'}`}>{question}</span>
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
        <p className="text-sm text-gray-400">{answer}</p>
      </div>
    </div>
  );
};

type FAQProps = {
  withBackground?: boolean;
  withTitle?: boolean;
};

const FAQ = ({ withBackground = false, withTitle = true }: FAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      question: 'W jaki sposób mogę sprzedać swoje skiny?',
      answer: 'Aby sprzedać skiny, musisz przejść przez kilka prostych kroków. Po pierwsze, zaloguj się do swojego konta. Następnie wybierz skiny, które chcesz sprzedać, i dodaj je do koszyka. Po zatwierdzeniu transakcji, środki zostaną przelane na Twoje konto natychmiast po jej zakończeniu. W zależności od metody płatności, transakcje mogą trwać do 24 godzin. Jeśli zauważysz, że trwa to dłużej, skontaktuj się z naszym zespołem wsparcia.'
    },
    {
      question: 'Jakie metody płatności są dostępne?',
      answer: 'Oferujemy szeroki zakres metod płatności, w tym przelewy bankowe, portfele elektroniczne jak PayPal, Skrill, płatności kartą oraz popularne metody lokalne. Wszystkie transakcje są zabezpieczone i szyfrowane, aby zapewnić maksymalne bezpieczeństwo Twoich środków.'
    },
    {
      question: 'Czy mogę sprzedać skiny z innych gier niż CS2?',
      answer: 'Obecnie nasza platforma obsługuje tylko skiny z CS2. Planujemy jednak rozszerzyć naszą ofertę o inne popularne gry w przyszłości. Śledź nasze media społecznościowe, aby być na bieżąco z nowościami.'
    },
    {
      question: 'Ile czasu zajmuje otrzymanie pieniędzy po sprzedaży?',
      answer: 'W większości przypadków środki są przekazywane natychmiast po zakończeniu transakcji. Jednak w zależności od wybranej metody płatności, czas przetwarzania może się różnić. Przelewy bankowe mogą trwać do 24 godzin, podczas gdy płatności elektroniczne są zazwyczaj natychmiastowe.'
    },
    {
      question: 'Czy pobieracie prowizję od sprzedaży?',
      answer: 'Tak, pobieramy niewielką prowizję od każdej transakcji, aby utrzymać naszą platformę i zapewnić najwyższą jakość usług. Dokładna wysokość prowizji jest zawsze wyraźnie widoczna przed finalizacją transakcji, więc nie ma żadnych ukrytych opłat.'
    }
  ];

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
            <h2 className="text-3xl font-black uppercase mb-4">POZNAJ ODPOWIEDZI NA PYTANIA</h2>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Masz wątpliwości? Chcesz dowiedzieć się jak działa system sprzedaży? Wyjaśnimy każdy aspekt transakcji, aby to było przejrzyste i bezpieczne. Jeśli nie znajdziesz odpowiedzi na swoje pytanie, zawsze możesz skontaktować się z naszym zespołem pomocy.
            </p>
          </div>
        )}
        
        <div className="w-full rounded-lg overflow-hidden shadow-xl border border-gray-800 bg-[var(--bgColor)]">
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => toggleFAQ(index)}
            />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Nie znalazłeś odpowiedzi na swoje pytanie? 
            <a href="/support" className="text-[var(--btnColor)] ml-1 hover:underline">
              Skontaktuj się z nami
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
