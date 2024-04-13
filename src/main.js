import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist';

import App from './App.vue'

import router from './router'

import api from './api/axios';
import cUtil from '@/utils/commonUtil';

// create vue instance.
const app = createApp(App)
const pinia = createPinia();

app.config.globalProperties.$api = api;
app.config.globalProperties.$cUtil = cUtil;

pinia.use(piniaPersist);

app.use(router)
  .use(pinia);

app.mount('#app')
