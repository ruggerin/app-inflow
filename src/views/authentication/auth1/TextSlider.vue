<script setup lang="ts">
import { ref } from 'vue';

type slideType = {
  title: string;
  description: string;
};

const slides = ref<slideType[]>([
  {
    title: 'Análise inteligente',
    description: 'Gestão de produtividade da industria.'
  }
]);
</script>
<template>
  <v-carousel cycle height="190" hide-delimiter-background class="custom-delimiter" :show-arrows="false">
    <!-- <template v-slot:delimiter-icon>
      <v-icon class="text-8">mdi-circle</v-icon>
    </template> -->
    <v-carousel-item v-for="(slide, i) in slides" :key="i" class="text-center">
      <h1 class="text-h1">{{ slide.title }}</h1>
      <p class="text-medium-emphasis text-subtitle-1">{{ slide.description }}</p>
    </v-carousel-item>
  </v-carousel>
</template>

<style lang="scss">
.custom-delimiter {
  .v-btn {
    font-size: 5px;
  }
}
</style>
