import { useLanguageStore } from '../stores/language.store';

export function useTranslation() {
  const { language, setLanguage, t } = useLanguageStore();

  return {
    language,
    setLanguage,
    t,
  };
}
