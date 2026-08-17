<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(false)
const src = ref('')
const alt = ref('')

function close() {
  visible.value = false
}

function onDocClick(e: MouseEvent) {
  if (visible.value) return // overlay handles its own clicks while open
  if (e.defaultPrevented || e.button !== 0) return
  const target = e.target as HTMLElement | null
  if (!target) return
  const img = target.closest('img') as HTMLImageElement | null
  if (!img) return
  // Only zoom plain content images: inside .vp-doc and not wrapped in a link
  if (!img.closest('.vp-doc')) return
  if (img.closest('a')) return
  src.value = img.currentSrc || img.src
  alt.value = img.alt || ''
  visible.value = true
}

function onKeydown(e: KeyboardEvent) {
  if (visible.value && e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('click', onDocClick, true)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick, true)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="imgv-fade">
      <div v-if="visible" class="imgv-overlay" @click="close">
        <img :src="src" :alt="alt" class="imgv-image" />
        <button class="imgv-close" aria-label="Close image" @click.stop="close">✕</button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.imgv-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.82);
  padding: 40px 24px;
  cursor: zoom-out;
}
.imgv-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 6px;
  box-shadow: 0 14px 44px rgba(0, 0, 0, 0.55);
}
.imgv-close {
  position: fixed;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.imgv-close:hover {
  background: rgba(255, 255, 255, 0.28);
}
.imgv-fade-enter-active,
.imgv-fade-leave-active {
  transition: opacity 0.2s ease;
}
.imgv-fade-enter-from,
.imgv-fade-leave-to {
  opacity: 0;
}
</style>