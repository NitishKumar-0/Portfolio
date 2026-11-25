export default {
  optimizeDeps: {
    noDiscovery: true,
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:3001',
    },
  },
}
