import { createApp } from 'vue'
import './assets/style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)

// ✅ Create Pinia instance first
const pinia = createPinia()

// ✅ Use persisted state plugin
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

app.use(FloatingVue, {
  popperOptions: {
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['top', 'bottom', 'left', 'right'],
        },
      },
    ],
  },
})
app.mount('#app')
