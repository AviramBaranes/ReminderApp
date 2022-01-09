/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    baseURL: process.env.SERVER_URL || 'http://localhost:8081',
  },
  reactStrictMode: true,
  optimizeFonts: false,
};
