<script setup lang="ts">
import { ref } from 'vue';
import { BuildingStoreIcon, SendIcon, MailboxIcon, PhotoIcon, CheckIcon } from 'vue-tabler-icons';

const notificationDD = ref(['Todos os Alertas', 'New', 'Unread', 'Other']);
const selectNotify = ref(['Todos os Alertas']);
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- notifications DD -->
  <!-- ---------------------------------------------- -->
  <div class="pa-4">
    <div class="d-flex align-center justify-space-between mb-3">
      <h6 class="text-subtitle-1">
        Alertas
        <v-chip color="warning" variant="flat" size="small" class="ml-2 text-white">0</v-chip>
      </h6>
      <a href="#" class="text-decoration-underline text-primary text-subtitle-2">Marcar como lidos</a>
    </div>
    <v-select :items="notificationDD" v-model="selectNotify" color="primary" variant="outlined" density="default"
      hide-details></v-select>
  </div>
  <v-divider></v-divider>
  <perfect-scrollbar style=" max-height: 350px">
    <v-list class="py-0" lines="three">
     
  </v-list>

</perfect-scrollbar>
<v-divider></v-divider>
<div class="pa-2 text-center">
  <v-btn color="primary" variant="text">Ver todos</v-btn>
</div></template>
