<script setup lang="ts">
import { RouterView } from 'vue-router';
import VerticalSidebarVue from './vertical-sidebar/VerticalSidebar.vue';
import VerticalHeaderVue from './vertical-header/VerticalHeader.vue';
import HorizontalHeader from './horizontal-header/HorizontalHeader.vue';
import HorizontalSidebar from './horizontal-sidebar/HorizontalSidebar.vue';
import Customizer from './customizer/Customizer.vue';
import { useCustomizerStore } from '../../stores/customizer';
import { pl, zhHans } from 'vuetify/locale';
const customizer = useCustomizerStore();
</script>

<template>
  <v-locale-provider>
    <v-app :theme="customizer.actTheme" :class="[
      customizer.actTheme,
      customizer.fontTheme,
      customizer.mini_sidebar ? 'mini-sidebar' : '',
      customizer.setHorizontalLayout ? 'horizontalLayout' : 'verticalLayout',
      customizer.inputBg ? 'inputWithbg' : ''
    ]">
      <Customizer />
      <VerticalSidebarVue v-if="!customizer.setHorizontalLayout" />
      <VerticalHeaderVue v-if="!customizer.setHorizontalLayout" />
      <HorizontalHeader v-if="customizer.setHorizontalLayout" />
      <HorizontalSidebar v-if="customizer.setHorizontalLayout" />

      <v-main>
        <v-container fluid class="page-wrapper">
          <!-- <div :class="customizer.boxed ? 'maxWidth' : ''">-->
          <div>
          
            <RouterView />
          <!--
            <v-btn class="customizer-btn" size="large" icon variant="flat" color="secondary"
              @click.stop="customizer.SET_CUSTOMIZER_DRAWER(!customizer.Customizer_drawer)">
              <SettingsIcon class="icon" />
            </v-btn>-->
          </div>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
