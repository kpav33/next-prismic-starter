const nextTranslate = require("next-translate");

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.prismic.io"],
  },
};

module.exports = nextTranslate(nextConfig);
