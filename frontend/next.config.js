/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "https://next-mern-ts-blog-deca06f16114.herokuapp.com/",
      "mern-next-ts-blog.s3.amazonaws.com",
      "mern-next-ts-blog.s3.eu-north-1.amazonaws.com"
    ],
    deviceSizes: [576, 768, 992, 1200, 1400] //bootstrap sizes
  }
};

module.exports = nextConfig;
