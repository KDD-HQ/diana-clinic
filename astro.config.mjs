import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  // SWAP this to https://www.drdianaclinic.com once domain is migrated off EasyStore
  site: 'https://drdianaclinic.vercel.app',
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap()
  ],
  trailingSlash: 'ignore'
});