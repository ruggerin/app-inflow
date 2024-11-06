<script setup lang="ts">
import { ref } from 'vue';
import { SettingsIcon, LogoutIcon, UserIcon } from 'vue-tabler-icons';
import { useAuthStore } from '@/stores/auth';

const swt1 = ref(true);
const swt2 = ref(false);
const authStore = useAuthStore();
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- profile DD -->
  <!-- ---------------------------------------------- -->
  <div class="pa-4">
    <h4 v-if="authStore.user.user_info.nome != undefined" class="mb-n1">Bem vindo, <span
        class="font-weight-regular"></span>{{ authStore.user.user_info.nome ?? 'Usuário Indefinido' }}</h4>
    <span class="text-subtitle-2 text-medium-emphasis">Plastape</span>




    <perfect-scrollbar style="height: calc(100vh - 300px); max-height: 200px">
      <v-divider></v-divider>

      <v-list class="mt-3">
        <v-list-item to="/profie" active-color="secondary" rounded="md">
          <template v-slot:prepend>
            <UserIcon size="20" class="mr-2" />
          </template>

          <v-list-item-title class="text-subtitle-2">Perfil do usuário</v-list-item-title>
        </v-list-item>

       

        <v-list-item @click="authStore.logout()" active-color="secondary" rounded="md">
          <template v-slot:prepend>
            <LogoutIcon size="20" class="mr-2" />
          </template>

          <v-list-item-title class="text-subtitle-2">Sair</v-list-item-title>
        </v-list-item>
      </v-list>
    </perfect-scrollbar>
  </div>
</template>
