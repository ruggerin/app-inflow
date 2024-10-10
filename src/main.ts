import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import vuetify from './plugins/vuetify';
import VueApexCharts from 'vue3-apexcharts';
import '@/scss/style.scss';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import VueTablerIcons from 'vue-tabler-icons';
// print
import print from 'vue3-print-nb';


import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
//Mock Api data
 //import './_mockApis';
//import { fakeBackend } from '@/utils/helpers/fake-backend';

import VCalendar from 'v-calendar';

import Maska from 'maska';
// Table
import Vue3EasyDataTable from 'vue3-easy-data-table';
//i18
import { createI18n } from 'vue-i18n';
import messages from '@/utils/locales/messages';





const i18n = createI18n({
  locale: 'en',
  messages: messages,
  silentTranslationWarn: true,
  silentFallbackWarn: true
});

const app = createApp(App);
//fakeBackend();


app.use(VueSweetalert2);
app.use(router);
app.component('EasyDataTable', Vue3EasyDataTable);
app.use(PerfectScrollbar);
app.use(VCalendar, {});
app.use(createPinia());
app.use(VueTablerIcons);
app.use(VueSweetalert2);
app.use(i18n);
app.use(Maska);
app.use(VueApexCharts);
app.use(vuetify).mount('#app');
app.use(print);
