import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/*.md', {
  excerpt: true,
  transform(raw) {
    return raw
      .filter((p) => p.url !== '/posts/')
      .filter((p) => !p.frontmatter.draft)
      .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
      .map((p) => ({
        title: p.frontmatter.title || p.url,
        date: p.frontmatter.date || '',
        tags: p.frontmatter.tags || [],
        excerpt: p.excerpt || '',
        url: p.url
      }))
  }
})
