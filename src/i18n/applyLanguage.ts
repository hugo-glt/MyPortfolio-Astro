import { translations, type Lang, type TranslationKey } from './translations';

const LANG_KEY = 'lang';
const DEFAULT_LANG: Lang = 'fr';
const ATTR_MAP: Record<string, string> = {
    placeholder: 'data-i18n-placeholder',
    title: 'data-i18n-title',
    'aria-label': 'data-i18n-aria-label',
};

export function getStoredLang(): Lang {
    if (typeof localStorage === 'undefined') return DEFAULT_LANG;
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === 'fr' || stored === 'en') return stored;
    return DEFAULT_LANG;
}

function updateTexts(lang: Lang): void {
    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n as TranslationKey;
        const text = translations[lang][key as keyof typeof translations[typeof lang]];
        if (text) el.textContent = text;
    });

    // Placeholders (inputs, textarea)
    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]').forEach((el) => {
        const key = el.dataset.i18nPlaceholder as TranslationKey;
        const text = translations[lang][key as keyof typeof translations[typeof lang]];
        if (text) el.placeholder = text;
    });

    document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18nHtml as TranslationKey;
    const text = translations[lang][key as keyof typeof translations[typeof lang]];
    if (text) el.innerHTML = text;
});
}

export function applyLanguage(lang: Lang): void {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem(LANG_KEY, lang);
    updateTexts(lang);

    window.dispatchEvent(new CustomEvent('lang-change', {
        detail: { lang }
    }));
}

export function initLanguage(): void {
    applyLanguage(getStoredLang());
}