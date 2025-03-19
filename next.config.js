module.exports = {
  images: {
    domains: ["picsum.photos", "files.edgestore.dev", "loremflickr.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
    rules: {
      '@typescript-eslint/react-hooks/exhaustive-deps': 'off',
    },
  },
};
