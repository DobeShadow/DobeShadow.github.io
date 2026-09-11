<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const password = ref('')
const plaintext = ref('')
const error = ref('')
const unlocked = ref(false)
const busy = ref(false)

const payload = computed(() => String(page.value.frontmatter.encrypted || ''))
const title = computed(() => String(page.value.frontmatter.title || '私密文章'))

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
    'deriveBits',
    'deriveKey'
  ])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  )
}

async function decrypt() {
  error.value = ''
  busy.value = true
  try {
    const parts = payload.value.split('.')
    if (parts.length !== 4) throw new Error('payload 格式错误')
    const [saltB64, ivB64, tagB64, ctB64] = parts
    const salt = b64ToBytes(saltB64)
    const iv = b64ToBytes(ivB64)
    const tag = b64ToBytes(tagB64)
    const ct = b64ToBytes(ctB64)
    const combined = new Uint8Array(ct.length + tag.length)
    combined.set(ct, 0)
    combined.set(tag, ct.length)
    const key = await deriveKey(password.value, salt)
    const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, combined)
    plaintext.value = new TextDecoder().decode(plainBuf)
    unlocked.value = true
    try {
      sessionStorage.setItem('vp-private-pass', password.value)
    } catch {
      /* ignore */
    }
  } catch {
    error.value = '密码错误或内容损坏'
    unlocked.value = false
  } finally {
    busy.value = false
  }
}

// Owner convenience: try remembered password once
const remembered = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('vp-private-pass') : ''
if (remembered) {
  password.value = remembered
  decrypt()
}
</script>

<template>
  <div class="private-gate">
    <template v-if="!unlocked">
      <div class="gate-card">
        <p class="gate-badge">私密</p>
        <h2 class="gate-title">{{ title }}</h2>
        <p class="gate-desc">
          这篇文章仅作者可见。列表中他人只能看到标题，正文已加密存储在仓库中，需输入阅读密码才能解密。
        </p>
        <form class="gate-form" @submit.prevent="decrypt">
          <input
            v-model="password"
            class="gate-input"
            type="password"
            placeholder="阅读密码"
            autocomplete="current-password"
          />
          <button class="gate-btn" type="submit" :disabled="busy || !password">
            {{ busy ? '解密中…' : '解锁' }}
          </button>
        </form>
        <p v-if="error" class="gate-error">{{ error }}</p>
      </div>
    </template>
    <article v-else class="private-body" v-html="plaintext"></article>
  </div>
</template>

<style scoped>
.private-gate {
  margin: 12px 0 32px;
}
.gate-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 28px 24px;
  background: var(--vp-c-bg-soft);
}
.gate-badge {
  display: inline-block;
  margin: 0 0 8px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
}
.gate-title {
  margin: 0 0 8px;
  font-size: 1.25rem;
  border: none;
  padding: 0;
}
.gate-desc {
  margin: 0 0 16px;
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
  line-height: 1.6;
}
.gate-form {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.gate-input {
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.gate-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: var(--vp-c-brand-1);
  color: white;
  cursor: pointer;
}
.gate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.gate-error {
  margin-top: 10px;
  color: var(--vp-c-danger-1, #f66);
  font-size: 0.88rem;
}
.private-body :deep(h2) {
  margin-top: 2rem;
}
</style>
