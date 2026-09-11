#!/usr/bin/env node
/**
 * Encrypt a markdown post body for private VitePress posts.
 *
 * Usage:
 *   node scripts/encrypt-post.mjs <input.md> <output.md> [password]
 *
 * Default password: change-me-private
 * Output keeps title/date/tags frontmatter, sets private: true,
 * and stores AES-256-GCM payload in frontmatter.encrypted.
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const DEFAULT_PASSWORD = 'change-me-private'

function encrypt(text, password) {
  const salt = crypto.randomBytes(16)
  const iv = crypto.randomBytes(12)
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256')
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const ct = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [salt, iv, tag, ct].map((b) => b.toString('base64')).join('.')
}

function parseFrontmatter(raw) {
  // Normalize CRLF so frontmatter regexes work on Windows checkouts
  raw = raw.replace(/\r\n/g, '\n')
  if (!raw.startsWith('---')) return { data: {}, body: raw }
  const end = raw.indexOf('\n---', 3)
  if (end === -1) return { data: {}, body: raw }
  const fmBlock = raw.slice(3, end).trim()
  const body = raw.slice(end + 4).replace(/^\n/, '')
  const data = {}
  let currentListKey = null
  for (const line of fmBlock.split('\n')) {
    const listMatch = line.match(/^-\s+(.*)$/)
    if (currentListKey && listMatch) {
      data[currentListKey].push(listMatch[1].replace(/^["']|["']$/g, ''))
      continue
    }
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!kv) continue
    const key = kv[1]
    let value = kv[2].trim()
    if (value === '') {
      currentListKey = key
      data[key] = []
      continue
    }
    currentListKey = null
    if (/^\[.*\]$/.test(value)) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else {
      data[key] = value.replace(/^["']|["']$/g, '')
    }
  }
  return { data, body }
}

function buildFrontmatter(data, encrypted) {
  const lines = ['---']
  lines.push(`title: "${String(data.title).replace(/"/g, '\\"')}"`)
  if (data.date) lines.push(`date: ${data.date}`)
  if (data.tags) {
    if (Array.isArray(data.tags)) {
      lines.push(`tags: [${data.tags.join(', ')}]`)
    } else {
      lines.push(`tags: ${data.tags}`)
    }
  }
  lines.push('private: true')
  lines.push(`encrypted: "${encrypted}"`)
  lines.push('---')
  return lines.join('\n')
}

const input = process.argv[2]
const output = process.argv[3]
const password = process.argv[4] || DEFAULT_PASSWORD

if (!input || !output) {
  console.error('Usage: node scripts/encrypt-post.mjs <input.md> <output.md> [password]')
  process.exit(2)
}

const raw = fs.readFileSync(input, 'utf8')
const { data, body } = parseFrontmatter(raw)
if (!data.title) {
  console.error('Input must have frontmatter title')
  process.exit(2)
}

// Encrypt the readable body (not frontmatter)
const encrypted = encrypt(body, password)
const out = `${buildFrontmatter(data, encrypted)}\n\n<EncryptedContent />\n`
fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, out, 'utf8')
console.log(`Wrote ${output}`)
console.log(`Password: ${password === DEFAULT_PASSWORD ? DEFAULT_PASSWORD : '(from argv)'}`)
