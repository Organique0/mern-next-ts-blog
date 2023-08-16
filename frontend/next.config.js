/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"], //allow image loading from localhost
    deviceSizes: [576, 768, 992, 1200, 1400] //bootstrap sizes
  }
};

module.exports = nextConfig;
