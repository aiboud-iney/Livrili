const nextConfig = {
  turbopack: {},

  images: {
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: ['**/node_modules.git/**'],

        poll: 1000,
      }
    }
    return config
  },
}

export default nextConfig
