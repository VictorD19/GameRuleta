/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  env: {
    URL_PADRAO: "https://funcombat.online/api/",
    URL_PADRAO_SOCKET: "wss://funcombat.online/api",
    // URL_PADRAO: "http://localhost:8000/api/",
    // URL_PADRAO_SOCKET: "ws://localhost:8000/api",
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
