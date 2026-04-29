import DefaultTheme from 'vitepress/theme'
import ReleaseList from './ReleaseList.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('ReleaseList', ReleaseList)
  },
}
