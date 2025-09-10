import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchTranslations } from '@/services/translationService';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      return storedLanguage;
    }
    const deviceLanguage = navigator.language.split('-')[0];
    return (deviceLanguage === 'hi' || deviceLanguage === 'en') ? deviceLanguage : 'en';
  });
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    localStorage.setItem('language', language);
    const loadTranslations = async () => {
      try {
        const data = await fetchTranslations(language);
        setTranslations(data);
      } catch (error) {
        console.error("Failed to load translations:", error);
        const defaultData = await fetchTranslations('en');
        setTranslations(defaultData);
      }
    };
    loadTranslations();
  }, [language]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let result = translations;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key; // Return the key itself if translation is not found
      }
    }
    return typeof result === 'string' ? result : key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// No longer needed as t is directly available from useLanguage
// export const useTranslation = () => {
//   const { language, translations } = useLanguage();
//   return translations[language] || translations.hi;
// };
