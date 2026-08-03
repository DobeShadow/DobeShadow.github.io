<script setup lang="ts">
const socials = [
  { name: 'GitHub', url: 'https://github.com/DobeShadow' },
  { name: 'Bilibili', url: 'https://space.bilibili.com/500599397' },
  { name: 'Email', url: 'mailto:3064838649@qq.com' },
  { name: 'MINEMC', url: 'http://www.minemc.asia/' },
  { name: '爱发电', url: 'https://ifdian.net/a/dobeshadow' }
]
</script>

<template>
  <div class="hero">
    <h1 class="hero-name">DobeShadow</h1>
    <p class="hero-tagline">
      Materials &amp; Chemical Engineering student · Minecraft plugin developer
    </p>
    <p class="hero-desc">
      I write code that lives in virtual worlds, and I study the science of real materials.
      Currently preparing for graduate school, building Minecraft plugins in my free time.
    </p>
    <div class="hero-socials">
      <a v-for="s in socials" :key="s.name" :href="s.url" target="_blank" rel="noopener" class="social-link">
        {{ s.name }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.hero {
  max-width: 640px;
  margin: 0 auto;
  padding: 72px 24px 48px;
  text-align: center;
}
.hero-name {
  font-size: 3.2rem;
  font-weight: 500;
  letter-spacing: -0.03em;
  margin: 0 0 16px;
  color: var(--vp-c-text-1);
}
.hero-tagline {
  font-size: 1.15rem;
  color: var(--vp-c-text-2);
  margin: 0 0 20px;
  line-height: 1.6;
}
.hero-desc {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  margin: 0 0 32px;
  line-height: 1.8;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}
.hero-socials {
  display: flex;
  justify-content: center;
  gap: 22px;
  flex-wrap: wrap;
}
.social-link {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  text-decoration: none !important;
  transition: color 0.2s ease;
  border-bottom: 1px solid transparent;
  padding-bottom: 2px;
}
.social-link:hover {
  color: var(--vp-c-text-1);
  border-bottom-color: var(--vp-c-text-1);
}
</style>
