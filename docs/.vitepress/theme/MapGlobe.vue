<script setup lang="ts">
import { onMounted, ref } from 'vue'

const container = ref<HTMLElement>()
let map: any = null

// 标记点：名字 / 经度 / 纬度 / 日期 / 照片URL / 一句话（date/photo/text 可留空，之后补）
const markers = [
  { name: 'Nanjing', lng: 118.80, lat: 32.06, date: '', photo: '', text: '' },
  { name: 'Wuhan', lng: 114.31, lat: 30.59, date: '', photo: '', text: '' },
  { name: 'Changsha', lng: 112.94, lat: 28.23, date: '', photo: '', text: '' },
  { name: 'Nanchang', lng: 115.86, lat: 28.68, date: '', photo: '', text: '' },
  { name: 'Jingdezhen', lng: 117.18, lat: 29.27, date: '', photo: '', text: '' },
  { name: 'Ganzhou', lng: 115.93, lat: 25.83, date: '', photo: '', text: '' }
]

function popupHTML(m) {
  const photo = m.photo
    ? `<div class="map-popup-photo"><img src="${m.photo}" alt="${m.name}" /></div>`
    : ''
  const date = m.date ? `<div class="map-popup-date">${m.date}</div>` : ''
  const text = m.text ? `<p class="map-popup-text">${m.text}</p>` : ''
  return `<div class="map-popup">${photo}<div class="map-popup-head"><strong>${m.name}</strong></div>${date}${text}</div>`
}

onMounted(async () => {
  if (typeof window === 'undefined') return
  const mapboxgl = (await import('mapbox-gl')).default
  await import('mapbox-gl/dist/mapbox-gl.css')
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
    // Inline styles as ultimate fallback so the dot is always visible
    // regardless of CSS scoping / mapbox-gl.css availability
    Object.assign(el.style, {
      position: 'relative',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      background: '#3b82f6',
      border: '2px solid #fff',
      cursor: 'pointer',
      boxShadow: '0 0 14px rgba(59, 130, 246, 1), 0 0 28px rgba(59, 130, 246, 0.5)',
      zIndex: '10'
    })
    const pulse = document.createElement('div')
    pulse.className = 'map-pulse'
    el.appendChild(pulse)
    new mapboxgl.Marker({ element: el })
      .setLngLat([m.lng, m.lat])
      .setPopup(new mapboxgl.Popup({ offset: 24, closeButton: false, maxWidth: '280px' }).setHTML(popupHTML(m)))
      .addTo(map)
  })
})
</script>

<template>
  <div class="map-wrap">
    <div ref="container" class="map-container"></div>
    <div class="map-hint">Drag to rotate · Scroll to zoom · Click a marker</div>
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
  z-index: 3;
  white-space: nowrap;
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
