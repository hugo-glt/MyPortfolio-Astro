# MyPortfolio-Astro
Portfolio d'étudiant en BTS SIO (Services Informatiques aux Organisations) option SLAM (Solutions Logicielles et Applications Métiers), promotion 2025-2027. Construit avec Astro, Tailwind CSS, MDX et GSAP. Projets présentés via Content Collections typées avec Zod. Déploiement statique auto-hébergé.

## Stack technique
(Badges)
- Astro 7 (SSR Node) | Tailwind CSS 4 | TypeScript | MDX | GSAP
- Back-end: Node.js + @astrojs/node, Nodemailer, Zod, better-sqlite3

## Sécurité du formulaire de contact
- Validation stricte Zod
- Rate limiting persistant (SQLite) : 3 requêtes / 10 min / IP
- Honeypot anti-bot
- Échappement HTML (prévention XSS)
- Secrets via .env (GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_RECIPIENT)
- CORS / HTTPS via Caddy

## Fonctionnalités
- Design responsive mobile-first (Tailwind v4)
- Thème clair/sombre (toggle sun/moon) + préférence système
- Internationalisation FR/EN (i18n)
- Navbar dynamique (bas → haut au scroll) + barre de progression
- Grid masonry de projets avec cartes cliquables
- Carousel de documentation de projets
- Formulaire de contact sécurisé (API)
- Pages légales (mentions, confidentialité, licences)

# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

## Déploiement (VM Proxmox)
- Astro dist/ servie
- /api proxy → serveur Node
- Caddy reverse proxy + HTTPS

## Licence et crédits

### Contenus originaux

Sauf mention contraire, les textes, images, illustrations, éléments graphiques et codes créés spécifiquement pour ce site sont la propriété de l’éditeur.

Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans autorisation préalable est interdite, sous réserve des exceptions prévues par la loi applicable.

### Icônes

Certaines icônes utilisées sur le site proviennent de [SVG Repo](https://www.svgrepo.com/).

Les icônes utilisées et référencées dans la page **Crédits et Licences** sont indiquées comme étant distribuées sous licence **CC0** sur leurs pages respectives.

La licence **CC0 (Creative Commons Zero)** est un dispositif permettant au titulaire des droits de renoncer, dans la mesure permise par la loi, à ses droits sur une œuvre afin de faciliter sa réutilisation, sa modification et sa redistribution sans obligation générale d’attribution.

Icônes utilisées :

| Icône     | Source                                                                     | Licence |
| --------- | -------------------------------------------------------------------------- | ------- |
| Sun       | [SVG Repo](https://www.svgrepo.com/svg/532889/sun)                         | CC0     |
| Moon      | [SVG Repo](https://www.svgrepo.com/svg/532875/moon)                        | CC0     |
| Gear      | [SVG Repo](https://www.svgrepo.com/svg/488369/settings)                    | CC0     |
| Indicator | [SVG Repo](https://www.svgrepo.com/svg/384750/circle-arrow-indicator-down) | CC0     |
| Arrow     | [SVG Repo](https://www.svgrepo.com/svg/535155/arrow-left)                  | CC0     |
| Profile   | [SVG Repo](https://www.svgrepo.com/svg/491109/profile-circle)              | CC0     |
| LinkedIn  | [SVG Repo](https://www.svgrepo.com/svg/157006/linkedin)                    | CC0     |
| GitHub    | [SVG Repo](https://www.svgrepo.com/svg/378420/github-fill)                 | CC0     |

Source : [SVG Repo — Licensing](https://www.svgrepo.com/page/licensing)

> Les informations de licence correspondent aux informations affichées sur les pages des icônes au moment de la rédaction de la page « Crédits et Licences ».

### Autres ressources

D’autres ressources appartenant à des tiers peuvent être utilisées sur le site. Lorsqu’une licence ou une autorisation particulière l’exige, les informations relatives à leur auteur, leur source et leurs conditions d’utilisation sont indiquées dans la page « Crédits et Licences » ou à proximité du contenu concerné.


## Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
MyPortfolio/
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── astro.config.mjs                  # SSR Node + Tailwind v4 + MDX + env schema
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
│
├── data/
│   └── rate-limit.db                 # SQLite (rate limiting anti-spam)
│
├── public/                           # Assets statiques
│   ├── favicon.ico
│   └── favicon.svg
│
├── src/
│   ├── middleware.ts                 # 🛡 Middleware (sécurité globale)
│   │
│   ├── assets/
│   │   ├── assets_astro/             # SVG du template Astro
│   │   ├── assets_images/            # Images du portfolio
│   │   │   ├── comingsoon.png
│   │   │   ├── GILET_HUGO_CV.pdf / .png
│   │   │   ├── heroimage.jpg
│   │   │   ├── myportfolioastro.png
│   │   │   ├── P2.png / P3.png / P5.png / P6.png
│   │   │   └── placeholder-1.png / placeholder-resume.jpg
│   │   └── assets_portfolio/         # Icônes SVG (menu, soleil, lune, settings...)
│   │
│   ├── components/
│   │   ├── Carousel.astro
│   │   ├── Footer.astro
│   │   ├── NavBar.astro
│   │   ├── ProjectGrid.astro
│   │   └── icons/
│   │       ├── ArrowLeftIcon.astro
│   │       ├── GithubIcon.astro
│   │       ├── IndicatorIcon.astro
│   │       ├── LinkdinIcon.astro
│   │       ├── MoonIcon.astro
│   │       ├── ProfileIcon.astro
│   │       ├── SettingsIcon.astro
│   │       └── SunIcon.astro
│   │
│   ├── i18n/
│   │   ├── applyLanguage.ts
│   │   └── translations.ts           # FR / EN
│   │
│   ├── layouts/
│   │   └── Layout.astro              # Navbar + Footer + theming
│   │
│   ├── pages/
│   │   ├── index.astro               # Accueil (hero, présentation, projets, contacts)
│   │   ├── project-a.astro           # Page projet (Carousel)
│   │   ├── credits-licenses.astro    # Crédits & licences
│   │   ├── legalnotices.astro        # Mentions légales
│   │   ├── privacypolicy.astro       # Politique de confidentialité
│   │   └── api/
│   │       └── contact.ts            # Endpoint API contact (Nodemailer + Zod + SQLite)
│   │
│   └── styles/
│       └── global.css                # @theme (couleurs, polices) + dark mode
│
└── (Fichiers générés à l'exécution)
    ├── .astro/                       # Cache dev (env, types, settings)
    └── dist/                         # Build (généré, non commité)

```



To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
