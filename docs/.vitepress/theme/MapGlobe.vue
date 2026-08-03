<script setup lang="ts">
import { onMounted, ref } from 'vue'

const container = ref<HTMLElement>()
let map: any = null

// 城市：英文名 / 边界数据文件 / 日期 / 照片 / 一段话（date/photo/text 可留空）
const cities = [
  { name: 'Nanjing', file: 'Nanjing', date: '', photo: '', text: '' },
  { name: 'Wuhan', file: 'Wuhan', date: '', photo: '', text: '' },
  { name: 'Changsha', file: 'Changsha', date: '', photo: '', text: '' },
  { name: 'Nanchang', file: 'Nanchang', date: '', photo: '', text: '' },
  { name: 'Jiujiang', file: 'Jiujiang', date: '', photo: '', text: '' },
  { name: 'Jingdezhen', file: 'Jingdezhen', date: '', photo: '', text: '' },
  { name: 'Ganzhou', file: 'Ganzhou', date: '', photo: '', text: '' }
]

// 精确景点：英文名 / 中文名 / 经度 / 纬度 / 日期 / 照片URL / 地址 / 编码 / 关联城市
const spots = [
  {
    name: 'Jiyang Tower',
    cn: '洎阳楼',
    lng: 117.129,
    lat: 28.961,
    date: '2026-08-02',
    photo: '/photos/01-lp-jyyang-tower.jpg',
    addr: 'Leping, Jingdezhen area, Jiangxi, China',
    code: '360281',
    city: 'Jingdezhen'
  },
  {
    name: 'Jiangxi Provincial Art Museum',
    cn: '江西省美术馆',
    lng: 115.882,
    lat: 28.685,
    date: '2023-05-13',
    photo: '/photos/02-nanchang-art-museum.jpg',
    addr: 'Honggutan, Nanchang, Jiangxi, China',
    code: '360100',
    city: 'Nanchang'
  },
  {
    name: 'Librairie Avant-Garde',
    cn: '先锋书店 (五台山店)',
    lng: 118.760,
    lat: 32.040,
    date: '2025-02-21',
    photo: '/photos/03-nanjing-xianfeng-bookstore.jpg',
    addr: 'Gulou District, Nanjing, Jiangsu, China',
    code: '320106',
    city: 'Nanjing'
  },
  {
    name: 'Orange Isle',
    cn: '橘子洲头',
    lng: 112.961,
    lat: 28.196,
    date: '2023-07-21',
    photo: '/photos/04-changsha-juzizhou.jpg',
    addr: 'Yuelu District, Changsha, Hunan, China',
    code: '430104',
    city: 'Changsha'
  },
  {
    name: 'Wugong Mountain',
    cn: '萍乡武功山',
    lng: 113.974,
    lat: 27.462,
    date: '2023-07-21',
    photo: '/photos/05-pingxiang-wugong-mountain.jpg',
    addr: 'Luxi County, Pingxiang, Jiangxi, China',
    code: '360323',
    city: 'Pingxiang'
  },
  {
    name: 'Yellow Crane Tower',
    cn: '黄鹤楼',
    lng: 114.305,
    lat: 30.547,
    date: '2023-10-20',
    photo: '/photos/06-wuhan-yellow-crane-tower.jpg',
    addr: 'Wuchang District, Wuhan, Hubei, China',
    code: '420106',
    city: 'Wuhan'
  },
  {
    name: 'Yugu Pavilion',
    cn: '郁孤台',
    lng: 114.939,
    lat: 25.839,
    date: '2024-01-27',
    photo: '/photos/07-ganzhou-yugu-tower.jpg',
    addr: 'Zhanggong District, Ganzhou, Jiangxi, China',
    code: '360702',
    city: 'Ganzhou'
  },
  {
    name: 'Dehua Tower',
    cn: '德化楼',
    lng: 116.001,
    lat: 29.706,
    date: '2022-10-15',
    photo: '/photos/08-jiujiang-dehua-tower.jpg',
    addr: 'Xunyang District, Jiujiang, Jiangxi, China',
    code: '360403',
    city: 'Jiujiang'
  }
]

// 蓝色定位针 SVG
const PIN_SVG = `
<svg viewBox="0 0 24 32" width="28" height="36" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 0 C5.4 0 0 5.4 0 12 C0 22 12 32 12 32 C12 32 24 22 24 12 C24 5.4 18.6 0 12 0 Z"
    fill="#3b82f6" stroke="#fff" stroke-width="1.5"/>
  <circle cx="12" cy="12" r="4" fill="#fff"/>
</svg>`

function cityPopupHTML(m) {
  const photo = m.photo
    ? `<div class="map-popup-photo"><img src="${m.photo}" alt="${m.name}" /></div>`
    : ''
  const date = m.date ? `<div class="map-popup-date">${m.date}</div>` : ''
  const text = m.text ? `<p class="map-popup-text">${m.text}</p>` : ''
  return `<div class="map-popup">${photo}<div class="map-popup-head"><strong>${m.name}</strong></div>${date}${text}</div>`
}

function spotPopupHTML(s) {
  const photo = s.photo
    ? `<div class="spot-photo"><img src="${s.photo}" alt="${s.cn || s.name}" /></div>`
    : `<div class="spot-photo spot-photo-empty"></div>`
  const date = s.date ? `<div class="spot-date">${s.date}</div>` : ''
  const addr = s.addr ? `<div class="spot-addr">${s.addr}</div>` : ''
  const code = s.code ? `<div class="spot-code">编码: ${s.code}</div>` : ''
  return `<div class="spot-card">${photo}<div class="spot-body"><div class="spot-title">${s.cn || s.name}</div>${date}${addr}${code}</div></div>`
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
    maxZoom: 18,
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

    // 行政边界高亮
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
    map.addLayer({
      id: 'city-fill',
      type: 'fill',
      source: 'city-zones',
      paint: { 'fill-color': '#3b82f6', 'fill-opacity': 0.22 }
    })
    map.addLayer({
      id: 'city-line',
      type: 'line',
      source: 'city-zones',
      paint: { 'line-color': '#60a5fa', 'line-width': 1.2, 'line-opacity': 0.9 }
    })
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

    // 精确景点蓝色大头针
    spots.forEach((s) => {
      const el = document.createElement('div')
      el.className = 'map-pin'
      el.innerHTML = PIN_SVG
      new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([s.lng, s.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 32, closeButton: false, maxWidth: '320px' }).setHTML(spotPopupHTML(s))
        )
        .addTo(map)
    })

    // 点击行政区域弹窗
    map.on('click', 'city-fill', (e) => {
      if (!e.features || !e.features.length) return
      const f = e.features[0]
      const city = cities.find((c) => c.name === f.properties.cityKey)
      if (!city) return
      const center = f.properties.center || f.properties.centroid || [0, 0]
      new mapboxgl.Popup({ closeButton: false, maxWidth: '280px' })
        .setLngLat(center)
        .setHTML(cityPopupHTML(city))
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
    <div class="map-hint">Drag to rotate · Scroll to zoom · Click a pin for details</div>
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