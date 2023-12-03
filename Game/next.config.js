/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  env: {
    URL_PADRAO: "https://funcombat.online/api/",
    URL_PADRAO_SOCKET: "wss://funcombat.online/api",
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
