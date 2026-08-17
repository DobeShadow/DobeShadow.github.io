import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import PostList from './PostList.vue'
import ProfileCard from './ProfileCard.vue'
import MapGlobe from './MapGlobe.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('PostList', PostList)
    app.component('ProfileCard', ProfileCard)
    app.component('MapGlobe', MapGlobe)
  }
}
