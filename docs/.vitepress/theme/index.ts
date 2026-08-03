import DefaultTheme from 'vitepress/theme'
import PostList from './PostList.vue'
import ProfileCard from './ProfileCard.vue'
import MapGlobe from './MapGlobe.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PostList', PostList)
    app.component('ProfileCard', ProfileCard)
    app.component('MapGlobe', MapGlobe)
  }
}
