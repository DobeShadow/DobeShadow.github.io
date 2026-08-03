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
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
  ],
  themeConfig: {
    logo: { light: '/logo-dark.svg', dark: '/logo-light.svg' },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'Posts', link: '/posts' },
      { text: 'Projects', link: '/projects' }
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
