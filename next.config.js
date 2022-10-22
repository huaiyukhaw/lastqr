/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: ["grjhlubfwzwxwsmeegoo.supabase.co"],
  },
};

module.exports = nextConfig;
