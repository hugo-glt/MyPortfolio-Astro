// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()],
    adapter: node({
    mode: 'standalone'
  }),
  env: {
    schema: {
      GMAIL_USER: envField.string({ context: 'server', access: 'secret' }),
      GMAIL_APP_PASSWORD: envField.string({ context: 'server', access: 'secret' }),
      CONTACT_RECIPIENT: envField.string({ context: 'server', access: 'secret' }),
    }
  }
});