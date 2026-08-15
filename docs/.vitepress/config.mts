import { defineConfig } from 'vitepress'

export default defineConfig({
  // Deployed at the user-page root: https://dobeshadow.github.io/
  base: '/',
  lang: 'en-US',
  title: '余枫的BLOG',
  description: '余枫的BLOG - Materials & Chemical Engineering student, Minecraft plugin developer',
  cleanUrls: true,
  appearance: true,
  head: [
    ['meta', { name: 'theme-color', content: '#18181b' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'stylesheet', href: 'https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css' }]
  ],
  markdown: {
    // IntelliJ IDEA style (Darcula) code highlighting
    theme: 'one-dark-pro'
  },
  themeConfig: {
    logo: { light: '/logo-dark.svg', dark: '/logo-light.svg' },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'Posts', link: '/posts' },
      { text: 'Projects', link: '/projects' },
      { text: 'Map', link: '/map' }
    ],
    footer: {
      message: 'Built with VitePress',
      copyright: '© 2026 DobeShadow'
    },
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3]
    }
  }
})
