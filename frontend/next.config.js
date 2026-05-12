const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@mobile'] = path.resolve(__dirname, '../mobile');
    return config;
  },
};

module.exports = nextConfig;
