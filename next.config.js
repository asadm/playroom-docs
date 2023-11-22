const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

const godotHeaders = [
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin', // Matched parameters can be used in the value
  },
  {
    key: 'Cross-Origin-Embedder-Policy', // Matched parameters can be used in the key
    value: 'require-corp',
  },
]

module.exports = withNextra({
    async headers() {
      return [
        {
          source: '/demos/godot4/:path',
          headers: godotHeaders,
        },
      ]
    },
})
