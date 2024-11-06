<script setup lang="ts">
import { RouterView } from 'vue-router';
import VerticalSidebarVue from './vertical-sidebar/VerticalSidebar.vue';
import VerticalHeaderVue from './vertical-header/VerticalHeader.vue';
import HorizontalHeader from './horizontal-header/HorizontalHeader.vue';
import HorizontalSidebar from './horizontal-sidebar/HorizontalSidebar.vue';
import Customizer from './customizer/Customizer.vue';
import { useCustomizerStore } from '../../stores/customizer';
import { pl, zhHans } from 'vuetify/locale';
import { useAuthStore } from '@/stores/auth';
import { ref, onMounted, onBeforeUnmount } from 'vue';
const customizer = useCustomizerStore();


//rotina de refrescamento de token
const authStore = useAuthStore();

let refreshInterval: ReturnType<typeof setInterval>;
let inactivityTimeout: ReturnType<typeof setTimeout>;
const isActive = ref(true); // Inicialize como ativo

// Função para iniciar a atualização do token
function startTokenRefresh() {
  refreshInterval = setInterval(async () => {

    if (authStore.user != null) {
      if (isActive.value) {
        try {
          //console.log('Verificando autenticação...');
          const isAuthenticated = await authStore.checkAuthenticationApi();
          //console.log('Usuário autenticado:', isAuthenticated);
          if (isAuthenticated) {
            //console.log('Atualizando token...');
            await authStore.refreshToken();
          } else {
            console.error('Usuário não autenticado');

            await authStore.logout();

            alert('Sua sessão expirou. Por favor, faça login novamente.');
          }
        } catch (error) {
          //console.error('Erro ao atualizar token:', error);
          await authStore.logout();
        }
      }
    }
  }, 5 * 60 * 1000); // Temporização de verificação em minutos 
}

// Função para detectar atividade do usuário
function resetInactivityTimeout() {
  isActive.value = true; // Usuário está ativo
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    isActive.value = false; // Marca o usuário como inativo após 5 minutos de inatividade
  }, 5 * 60 * 1000); // 5 minutos (ajustado conforme o comentário)
}

// Inicia a verificação de atividade
function startActivityMonitoring() {
  window.addEventListener('mousemove', resetInactivityTimeout);
  window.addEventListener('keypress', resetInactivityTimeout);
  window.addEventListener('click', resetInactivityTimeout);

  // Inicializa como ativo e reseta o temporizador de inatividade
  resetInactivityTimeout();
}

function stopActivityMonitoring() {
  window.removeEventListener('mousemove', resetInactivityTimeout);
  window.removeEventListener('keypress', resetInactivityTimeout);
  window.removeEventListener('click', resetInactivityTimeout);

  clearTimeout(inactivityTimeout);
  clearInterval(refreshInterval);
}

onMounted(() => {
  const isAuthenticated = authStore.checkAuthenticationApi();
  startActivityMonitoring();
  startTokenRefresh();
});

onBeforeUnmount(() => {
  stopActivityMonitoring();
}); 
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
