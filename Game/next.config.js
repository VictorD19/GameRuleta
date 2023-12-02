/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  env: {
    URL_PADRAO: "http://localhost:8000/",
    URL_PADRAO_SOCKET: "ws://localhost:8000",
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
