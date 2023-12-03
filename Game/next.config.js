/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  env: {
    URL_PADRAO: "http://funcombat.online/api/",
    URL_PADRAO_SOCKET: "ws://funcombat.online/api",
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
