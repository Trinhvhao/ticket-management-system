import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, translations } from '../i18n/translations';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Helper function to get nested translation value
const getNestedTranslation = (obj: any, path: string): string => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path; // Return key if translation not found
    }
  }
  
  return typeof result === 'string' ? result : path;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'vi', // Default to Vietnamese
      
      setLanguage: (language: Language) => {
        set({ language });
      },
      
      t: (key: string): string => {
        const { language } = get();
        const translation = translations[language];
        return getNestedTranslation(translation, key);
      },
    }),
    {
      name: 'language-storage',
    }
  )
);
