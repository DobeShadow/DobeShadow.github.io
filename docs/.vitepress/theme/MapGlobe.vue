<script setup lang="ts">
import { onMounted, ref } from 'vue'

const container = ref<HTMLElement>()
let map: any = null

// 城市区域：名字 / 经度 / 纬度 / 高亮半径(km) / 日期 / 照片URL / 一句话（date/photo/text 可留空）
const cities = [
  { name: 'Nanjing', lng: 118.80, lat: 32.06, radius: 40, date: '', photo: '', text: '' },
  { name: 'Wuhan', lng: 114.31, lat: 30.59, radius: 45, date: '', photo: '', text: '' },
  { name: 'Changsha', lng: 112.94, lat: 28.23, radius: 40, date: '', photo: '', text: '' },
  { name: 'Nanchang', lng: 115.86, lat: 28.68, radius: 40, date: '', photo: '', text: '' },
  { name: 'Jiujiang', lng: 115.97, lat: 29.71, radius: 35, date: '', photo: '', text: '' },
  { name: 'Jingdezhen', lng: 117.18, lat: 29.27, radius: 35, date: '', photo: '', text: '' },
  { name: 'Ganzhou', lng: 115.93, lat: 25.83, radius: 40, date: '', photo: '', text: '' }
]

// 以城市为中心生成近圆形多边形（每边约 1.1 倍经度/纬度换算）
function circlePolygon(lng, lat, radiusKm, points = 36) {
  const dLat = radiusKm / 110.574
  const dLng = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180))
  const coords = []
  for (let i = 0; i < points; i++) {
    const a = (i / points) * 2 * Math.PI
    coords.push([lng + dLng * Math.cos(a), lat + dLat * Math.sin(a)])
  }
  coords.push(coords[0]) // 闭合
  return coords
}

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
    zoom: 2.6,
    center: [114.5, 29.5],
    minZoom: 1,
    maxZoom: 9,
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

    // GeoJSON：每个城市一个高亮区域
    const geojson = {
      type: 'FeatureCollection',
      features: cities.map((c) => ({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [circlePolygon(c.lng, c.lat, c.radius)]
        },
        properties: { name: c.name, lng: c.lng, lat: c.lat }
      }))
    }

    map.addSource('city-zones', { type: 'geojson', data: geojson })

    // 区域填充（半透明蓝）
    map.addLayer({
      id: 'city-fill',
      type: 'fill',
      source: 'city-zones',
      paint: {
        'fill-color': '#3b82f6',
        'fill-opacity': 0.22
      }
    })
    // 区域描边
    map.addLayer({
      id: 'city-line',
      type: 'line',
      source: 'city-zones',
      paint: {
        'line-color': '#60a5fa',
        'line-width': 1.5,
        'line-opacity': 0.9
      }
    })
    // 城市名
    map.addLayer({
      id: 'city-label',
      type: 'symbol',
      source: 'city-zones',
      layout: {
        'text-field': ['get', 'name'],
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
      const city = cities.find((c) => c.name === f.properties.name)
      if (!city) return
      new mapboxgl.Popup({ closeButton: false, maxWidth: '280px' })
        .setLngLat([city.lng, city.lat])
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
