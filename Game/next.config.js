/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  }, env: {
    URL_SERVER: 'http://localhost:8000',
  },
};

module.exports = nextConfig;
