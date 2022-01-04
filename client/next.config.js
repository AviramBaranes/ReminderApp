/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    baseURL: process.env.SERVER_URL || 'http://localhost:8082',
  },
  reactStrictMode: true,
};
