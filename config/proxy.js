module.exports = {
    '/': {
      target: 'http://localhost:3001/',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api': ''
      // }
    },
    '/user': {
      target: 'http://localhost:3001/user',
      changeOrigin: true,
      pathRewrite: {
          '^/user': '/myuser'
        }
    },
}