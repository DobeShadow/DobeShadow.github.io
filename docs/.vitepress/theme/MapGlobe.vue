<script setup lang="ts">
import { onMounted, ref } from 'vue'

const container = ref<HTMLElement>()
let map: any = null

// 城市：英文名 / 边界数据文件（docs/public/geo/）/ 日期 / 照片URL / 一句话（date/photo/text 可留空）
const cities = [
  { name: 'Nanjing', file: 'Nanjing', date: '', photo: '', text: '' },
  { name: 'Wuhan', file: 'Wuhan', date: '', photo: '', text: '' },
  { name: 'Changsha', file: 'Changsha', date: '', photo: '', text: '' },
  { name: 'Nanchang', file: 'Nanchang', date: '', photo: '', text: '' },
  { name: 'Jiujiang', file: 'Jiujiang', date: '', photo: '', text: '' },
  { name: 'Jingdezhen', file: 'Jingdezhen', date: '', photo: '', text: '' },
  { name: 'Ganzhou', file: 'Ganzhou', date: '', photo: '', text: '' }
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
    zoom: 2.8,
    center: [114.5, 29.5],
    minZoom: 1,
    maxZoom: 10,
    pitch: 0,
    attributionControl: false
  })
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
  map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-left')

  map.on('style.load', async () => {
    ;(map as any).setFog({
      color: 'rgb(10, 12, 20)',
      'high-color': 'rgb(20, 24, 40)',
      'horizon-blend': 0.3,
      'space-color': 'rgb(5, 6, 12)',
      'star-intensity': 0.8
    })

    // 加载城市行政边界 GeoJSON（阿里 DataV，docs/public/geo/）
    let features = []
    try {
      const results = await Promise.all(
        cities.map((c) => fetch(`/geo/${c.file}.json`).then((r) => r.json()))
      )
      features = results.flatMap((fc, i) =>
        fc.features.map((f) => ({
          ...f,
          properties: { ...f.properties, cityKey: cities[i].name }
        }))
      )
    } catch (e) {
      console.error('Failed to load city boundaries', e)
    }

    map.addSource('city-zones', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features }
    })

    // 区域填充（半透明蓝，按真实行政区划）
    map.addLayer({
      id: 'city-fill',
      type: 'fill',
      source: 'city-zones',
      paint: {
        'fill-color': '#3b82f6',
        'fill-opacity': 0.25
      }
    })
    // 区域描边（城市规划线）
    map.addLayer({
      id: 'city-line',
      type: 'line',
      source: 'city-zones',
      paint: {
        'line-color': '#60a5fa',
        'line-width': 1.2,
        'line-opacity': 0.9
      }
    })
    // 城市名
    map.addLayer({
      id: 'city-label',
      type: 'symbol',
      source: 'city-zones',
      layout: {
        'text-field': ['get', 'cityKey'],
        'text-size': 12,
        'text-letter-spacing': 0.05
      },
      paint: {
        'text-color': '#dbeafe',
        'text-halo-color': '#0e0e12',
        'text-halo-width': 1.5
      }
    })

    // 点击区域弹窗
    map.on('click', 'city-fill', (e) => {
      if (!e.features || !e.features.length) return
      const f = e.features[0]
      const city = cities.find((c) => c.name === f.properties.cityKey)
      if (!city) return
      const center = f.properties.center || f.properties.centroid || [city.lng, city.lat]
      new mapboxgl.Popup({ closeButton: false, maxWidth: '280px' })
        .setLngLat(center)
        .setHTML(popupHTML(city))
        .addTo(map)
    })
    map.on('mouseenter', 'city-fill', () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', 'city-fill', () => {
      map.getCanvas().style.cursor = ''
    })
  })
})
</script>

<template>
  <div class="map-wrap">
    <div ref="container" class="map-container"></div>
    <div class="map-hint">Drag to rotate · Scroll to zoom · Click a highlighted region</div>
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
