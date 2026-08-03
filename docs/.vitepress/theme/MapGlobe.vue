<script setup lang="ts">
import { onMounted, ref } from 'vue'

const container = ref<HTMLElement>()
let map: any = null

// 标记点：名字 / 经度 / 纬度 / 描述（可自行增删修改）
const markers = [
  { name: 'Harbin', lng: 126.63, lat: 45.80, note: 'Sample location · 哈尔滨' },
  { name: 'Changsha', lng: 112.94, lat: 28.23, note: 'Sample location · 长沙' },
  { name: 'Shanghai', lng: 121.47, lat: 31.23, note: 'Sample location · 上海' }
]

onMounted(async () => {
  if (typeof window === 'undefined') return
  const mapboxgl = (await import('mapbox-gl')).default
  const token = (import.meta as any).env.VITE_MAPBOX_TOKEN
  if (!token) {
    container.value!.innerHTML =
      '<div class="map-token-hint">Mapbox token not configured.<br/>Set VITE_MAPBOX_TOKEN in docs/.env.local</div>'
    return
  }
  mapboxgl.accessToken = token
  map = new mapboxgl.Map({
    container: container.value!,
    style: 'mapbox://styles/mapbox/dark-v11',
    projection: 'globe',
    zoom: 1.2,
    center: [105, 30],
    minZoom: 0.4,
    maxZoom: 8,
    pitch: 0,
    attributionControl: false
  })
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
  map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-left')

  map.on('style.load', () => {
    ;(map as any).setFog({
      color: 'rgb(10, 12, 20)',
      'high-color': 'rgb(20, 24, 40)',
      'horizon-blend': 0.3,
      'space-color': 'rgb(5, 6, 12)',
      'star-intensity': 0.8
    })
  })

  markers.forEach((m) => {
    const el = document.createElement('div')
    el.className = 'map-dot'
    el.innerHTML = '<div class="map-pulse"></div>'
    new mapboxgl.Marker({ element: el })
      .setLngLat([m.lng, m.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 20, closeButton: false }).setHTML(
          `<strong>${m.name}</strong><br/><span class="map-note">${m.note}</span>`
        )
      )
      .addTo(map)
  })
})
</script>

<template>
  <div class="map-wrap">
    <div ref="container" class="map-container"></div>
    <div class="map-hint">Drag to rotate · Scroll to zoom</div>
  </div>
</template>

<style scoped>
.map-wrap {
  position: relative;
  height: calc(100vh - var(--vp-nav-height));
}
.map-container {
  width: 100%;
  height: 100%;
}
.map-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3b82f6;
  border: 2px solid #fff;
  cursor: pointer;
}
.map-pulse {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.5);
  animation: map-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes map-ping {
  0% {
    transform: scale(0.8);
    opacity: 0.9;
  }
  70%,
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}
.map-note {
  color: #52525b;
  font-size: 12px;
}
.map-hint {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.55);
  background: rgba(0, 0, 0, 0.35);
  padding: 5px 14px;
  border-radius: 999px;
  backdrop-filter: blur(4px);
  pointer-events: none;
}
.map-token-hint {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
  font-size: 14px;
  text-align: center;
  line-height: 2;
}
</style>
