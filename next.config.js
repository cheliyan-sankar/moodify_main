/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  reactStrictMode: false,
  webpack: (config) => {
    // Force webpack to use in-memory cache instead of the 'pack' file strategy.
    // This avoids ENOENT rename errors from PackFileCacheStrategy in some dev
    // environments where the packed cache file can't be atomically renamed.
    try {
      config.cache = { type: 'memory' };
    } catch (e) {
      // If anything goes wrong, leave config as-is.
    }
    return config;
  },
};

module.exports = nextConfig;
