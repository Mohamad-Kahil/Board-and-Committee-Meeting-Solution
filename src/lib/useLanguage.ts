import { useState, useEffect } from "react";
import { translations } from "./translations";

// Language hook for the application
const useLanguage = () => {
  // Get language from localStorage or default to "en"
  const [language, setLanguage] = useState<"en" | "ar">(() => {
    const savedLanguage = localStorage.getItem("language");
    return (savedLanguage === "ar" ? "ar" : "en") as "en" | "ar";
  });

  // Apply RTL/LTR styles and handle language changes
  const applyLanguageStyles = () => {
    try {
      localStorage.setItem("language", language);

      // Force correct RTL/LTR orientation
      if (language === "ar") {
        document.documentElement.dir = "rtl";
        document.documentElement.setAttribute("dir", "rtl");
        document.body.setAttribute("dir", "rtl");
        document.documentElement.classList.add("rtl");
        document.documentElement.classList.remove("ltr");
      } else {
        document.documentElement.dir = "ltr";
        document.documentElement.setAttribute("dir", "ltr");
        document.body.setAttribute("dir", "ltr");
        document.documentElement.classList.add("ltr");
        document.documentElement.classList.remove("rtl");
      }

      document.documentElement.lang = language;

      // Apply RTL-specific styles
      const style =
        document.getElementById("rtl-style") || document.createElement("style");
      if (!document.getElementById("rtl-style")) {
        style.id = "rtl-style";
        document.head.appendChild(style);
      }

      if (language === "ar") {
        style.textContent = `
          html[dir="rtl"], body[dir="rtl"] { direction: rtl !important; }
          html[dir="rtl"] .mr-2, body[dir="rtl"] .mr-2 { margin-right: 0 !important; margin-left: 0.5rem !important; }
          html[dir="rtl"] .ml-2, body[dir="rtl"] .ml-2 { margin-left: 0 !important; margin-right: 0.5rem !important; }
          html[dir="rtl"] .mr-4, body[dir="rtl"] .mr-4 { margin-right: 0 !important; margin-left: 1rem !important; }
          html[dir="rtl"] .ml-4, body[dir="rtl"] .ml-4 { margin-left: 0 !important; margin-right: 1rem !important; }
          html[dir="rtl"] .space-x-2 > :not([hidden]) ~ :not([hidden]), body[dir="rtl"] .space-x-2 > :not([hidden]) ~ :not([hidden]) {
            --tw-space-x-reverse: 1 !important;
            margin-inline-start: calc(0.5rem * var(--tw-space-x-reverse)) !important;
            margin-inline-end: calc(0.5rem * calc(1 - var(--tw-space-x-reverse))) !important;
          }
          html[dir="rtl"] .space-x-4 > :not([hidden]) ~ :not([hidden]), body[dir="rtl"] .space-x-4 > :not([hidden]) ~ :not([hidden]) {
            --tw-space-x-reverse: 1 !important;
            margin-inline-start: calc(1rem * var(--tw-space-x-reverse)) !important;
            margin-inline-end: calc(1rem * calc(1 - var(--tw-space-x-reverse))) !important;
          }
          html[dir="rtl"] .flex-row, body[dir="rtl"] .flex-row { flex-direction: row-reverse !important; }
          html[dir="rtl"] .justify-end, body[dir="rtl"] .justify-end { justify-content: flex-start !important; }
          html[dir="rtl"] .justify-start, body[dir="rtl"] .justify-start { justify-content: flex-end !important; }
          html[dir="rtl"] .text-left, body[dir="rtl"] .text-left { text-align: right !important; }
          html[dir="rtl"] .text-right, body[dir="rtl"] .text-right { text-align: left !important; }
          html[dir="rtl"] .right-0, body[dir="rtl"] .right-0 { right: auto !important; left: 0 !important; }
          html[dir="rtl"] .left-0, body[dir="rtl"] .left-0 { left: auto !important; right: 0 !important; }
          html[dir="rtl"] .right-1, body[dir="rtl"] .right-1 { right: auto !important; left: 0.25rem !important; }
          html[dir="rtl"] .left-1, body[dir="rtl"] .left-1 { left: auto !important; right: 0.25rem !important; }
          html[dir="rtl"] .right-2, body[dir="rtl"] .right-2 { right: auto !important; left: 0.5rem !important; }
          html[dir="rtl"] .left-2, body[dir="rtl"] .left-2 { left: auto !important; right: 0.5rem !important; }
          html[dir="rtl"] .right-3, body[dir="rtl"] .right-3 { right: auto !important; left: 0.75rem !important; }
          html[dir="rtl"] .left-3, body[dir="rtl"] .left-3 { left: auto !important; right: 0.75rem !important; }
          html[dir="rtl"] .right-4, body[dir="rtl"] .right-4 { right: auto !important; left: 1rem !important; }
          html[dir="rtl"] .left-4, body[dir="rtl"] .left-4 { left: auto !important; right: 1rem !important; }
          html[dir="rtl"] .justify-between, body[dir="rtl"] .justify-between { flex-direction: row-reverse !important; }
          html[dir="rtl"] .gap-2, body[dir="rtl"] .gap-2 { gap: 0.5rem !important; }
          html[dir="rtl"] .gap-3, body[dir="rtl"] .gap-3 { gap: 0.75rem !important; }
          html[dir="rtl"] .gap-4, body[dir="rtl"] .gap-4 { gap: 1rem !important; }
          
          /* Fix for dark mode text colors */
          .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 { color: white !important; }
          .dark label { color: #e5e7eb !important; }
          .dark .text-muted-foreground { color: #9ca3af !important; }
          .dark .text-foreground { color: #f3f4f6 !important; }
          .dark .bg-background { background-color: #1f2937 !important; }
        `;
      } else {
        style.textContent = `
          /* Fix for dark mode text colors */
          .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 { color: white !important; }
          .dark label { color: #e5e7eb !important; }
          .dark .text-muted-foreground { color: #9ca3af !important; }
          .dark .text-foreground { color: #f3f4f6 !important; }
          .dark .bg-background { background-color: #1f2937 !important; }
        `;
      }

      // Force reflow to apply RTL/LTR changes
      document.body.style.display = "none";
      setTimeout(() => {
        document.body.style.display = "";
      }, 5);
    } catch (error) {
      console.error("Error applying RTL/LTR styles:", error);
    }
  };

  // Update styles when language changes
  useEffect(() => {
    applyLanguageStyles();
  }, [language]);

  // Listen for language change events
  useEffect(() => {
    const handleLanguageChange = () => {
      applyLanguageStyles();
    };

    window.addEventListener("languagechange", handleLanguageChange);
    return () => {
      window.removeEventListener("languagechange", handleLanguageChange);
    };
  }, [language]);

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return { language, t, toggleLanguage };
};

export default useLanguage;
