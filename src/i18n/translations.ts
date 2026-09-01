export type Lang = 'fr' | 'en';

export const translations = {
    fr: {
        'nav.presentation': 'PRÉSENTATION',
        'nav.projects': 'PROJETS',
        'nav.contacts': 'CONTACTS',
    },
    en: {
        'nav.presentation': 'PRESENTATION',
        'nav.projects': 'PROJECTS',
        'nav.contacts': 'CONTACTS',
    },
} as const;

export type TranslationKey = keyof typeof translations['fr'];