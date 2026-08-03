<script setup lang="ts">
const avatar = 'https://github.com/DobeShadow.png'
const links = [
  { name: 'GitHub', url: 'https://github.com/DobeShadow' },
  { name: 'Bilibili', url: 'https://space.bilibili.com/500599397' },
  { name: 'Email', url: 'mailto:3064838649@qq.com' },
  { name: 'MINEMC', url: 'http://www.minemc.asia/' },
  { name: '爱发电', url: 'https://ifdian.net/a/dobeshadow' }
]
</script>

<template>
  <div class="profile-card">
    <img class="avatar" :src="avatar" alt="avatar" />
    <h3 class="name">余枫的BLOG</h3>
    <p class="role">Materials &amp; Chemical Engineering<br />Minecraft plugin developer</p>
    <p class="bio">
      Preparing for graduate school, building Minecraft plugins and running the MINEMC
      server in my free time.
    </p>
    <div class="links">
      <a v-for="l in links" :key="l.name" :href="l.url" target="_blank" rel="noopener" class="link">
        <span>{{ l.name }}</span>
        <span class="arrow">↗</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 24px;
  background: var(--vp-c-bg-soft);
}
.avatar {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: block;
  margin: 0 auto 14px;
  border: 1px solid var(--vp-c-divider);
}
.name {
  margin: 0 0 6px;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  color: var(--vp-c-text-1);
}
.role {
  margin: 0 0 14px;
  font-size: 0.82rem;
  line-height: 1.6;
  text-align: center;
  color: var(--vp-c-text-3);
}
.bio {
  margin: 0 0 18px;
  font-size: 0.86rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
.links {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 0.88rem;
  color: var(--vp-c-text-1);
  text-decoration: none !important;
  background: var(--vp-c-bg);
  transition: all 0.2s ease;
}
.link:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.arrow {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  transition: transform 0.2s ease;
}
.link:hover .arrow {
  transform: translate(2px, -2px);
  color: var(--vp-c-brand-1);
}
</style>
