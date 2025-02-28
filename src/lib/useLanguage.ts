import { useState } from "react";
import { translations } from "./translations";

// Language hook for the application
const useLanguage = () => {
  const [language, setLanguage] = useState<"en" | "ar">("en");

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return { language, t, toggleLanguage };
};

export default useLanguage;
