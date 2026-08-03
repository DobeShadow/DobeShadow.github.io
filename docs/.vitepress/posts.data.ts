import { createContentLoader } from 'vitepress'

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`
}

export default createContentLoader('posts/*.md', {
  excerpt: true,
  transform(raw) {
    return raw
      .filter((p) => p.url !== '/posts/')
      .filter((p) => !p.frontmatter.draft)
      .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
      .map((p) => ({
        title: p.frontmatter.title || p.url,
        date: formatDate(p.frontmatter.date),
        tags: p.frontmatter.tags || [],
        excerpt: p.excerpt || '',
        url: p.url
      }))
  }
})
