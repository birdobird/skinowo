import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { pl } from '../translations/pl';
import { en } from '../translations/en';

// Typ dla języków
type Language = 'pl' | 'en';

// Typ dla tłumaczeń
type TranslationValue = string | string[] | { [key: string]: TranslationValue };
type Translations = Record<string, TranslationValue>;

// Typ dla kontekstu językowego
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string | string[];
  translations: Translations;
}

// Tłumaczenia
const translations: Record<Language, Translations> = {
  pl,
  en
};

// Funkcja pomocnicza do głębokiego wyszukiwania w obiektach tłumaczeń
const getNestedTranslation = (obj: any, key: string): TranslationValue | undefined => {
  return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
};

// Domyślne wartości kontekstu
const defaultLanguageContext: LanguageContextType = {
  language: 'pl',
  setLanguage: () => {},
  t: (key: string) => {
    const value = getNestedTranslation(pl, key);
    if (typeof value === 'string' || Array.isArray(value)) {
      return value;
    }
    return key;
  },
  translations: pl
};

// Tworzenie kontekstu
const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext);

// Hook do używania kontekstu
export const useLanguage = () => useContext(LanguageContext);

// Provider kontekstu
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Sprawdzenie, czy istnieje zapisany język w localStorage
  const getSavedLanguage = (): Language => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'pl';
  };

  const [language, setLanguageState] = useState<Language>(getSavedLanguage());
  const [currentTranslations, setCurrentTranslations] = useState(translations[language]);

  // Funkcja do zmiany języka
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
    setCurrentTranslations(translations[newLanguage]);
  };

  // Funkcja tłumacząca
  const t = (key: string): string | string[] => {
    const value = getNestedTranslation(currentTranslations, key);
    
    if (typeof value === 'string' || Array.isArray(value)) {
      return value;
    }
    
    // Jeśli nie znaleziono tłumaczenia, zwróć klucz
    return key;
  };

  // Efekt do inicjalizacji języka
  useEffect(() => {
    const savedLanguage = getSavedLanguage();
    setLanguageState(savedLanguage);
    setCurrentTranslations(translations[savedLanguage]);
    
    // Dodanie klasy do body dla stylów specyficznych dla języka
    document.documentElement.lang = savedLanguage;
    document.documentElement.setAttribute('data-language', savedLanguage);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations: currentTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};
