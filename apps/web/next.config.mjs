import i18nConfig from './next-i18next.config.js';

const { i18n } = i18nConfig;

/** @type {import('next').NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n,
  reactStrictMode: true,
  transpilePackages: ['@movies/shared'],
};

export default config;
