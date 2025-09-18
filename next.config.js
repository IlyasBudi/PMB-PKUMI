/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["sequelize"],
    serverActions: true,
    serverActionsBodySizeLimit: "5mb",
  },
}

module.exports = nextConfig
