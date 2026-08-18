import { useState, useEffect } from 'react';

export type Language = 'id' | 'en';

export function useLanguage() {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('cozqta_lang') as Language) || 'id';
    }
    return 'id';
  });

  const setLanguage = (newLang: Language) => {
    localStorage.setItem('cozqta_lang', newLang);
    setLangState(newLang);
    
    // Update the googtrans cookie for Google Translate
    const cookieValue = newLang === 'en' ? '/id/en' : '/id/id';
    document.cookie = "googtrans=" + cookieValue + "; path=/;";
    document.cookie = "googtrans=" + cookieValue + "; path=/; domain=" + window.location.hostname;
    document.cookie = "googtrans=" + cookieValue + "; path=/; domain=." + window.location.hostname;
    
    // Dispatch event and reload the page to apply Google Translate
    window.dispatchEvent(new Event('cozqta_lang_changed'));
    window.location.reload();
  };

  useEffect(() => {
    const handleLangChange = () => {
      const currentLang = (localStorage.getItem('cozqta_lang') as Language) || 'id';
      setLangState(currentLang);
    };
    window.addEventListener('cozqta_lang_changed', handleLangChange);
    return () => {
      window.removeEventListener('cozqta_lang_changed', handleLangChange);
    };
  }, []);

  return { lang, setLanguage };
}
