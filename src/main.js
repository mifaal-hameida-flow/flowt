import { createApp } from 'vue'
import './assets/style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css';

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(FloatingVue)
app.mount('#app')
