import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  // SWAP this to https://www.drdianaclinic.com once domain is migrated off EasyStore
  site: 'https://www.drdianaclinic.com',
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap(),
    mdx()
  ],
  trailingSlash: 'ignore'
});