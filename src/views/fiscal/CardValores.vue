<template>
    <v-card   v-on:mouseover="isHovered = true" v-on:mouseleave="isHovered = false" :class="{ 'highlight': isHovered }" variant="outlined">
      <v-card-item class="py-0">
        <v-card-text>
          <v-row justify="space-between">

            <div>{{ props.title }}</div>
            <div><i v-if=" props.helper && props.helper?.length > 0 ">{{ props.helper }}</i>{{props.value  }}</div>
          </v-row>
        </v-card-text>

      </v-card-item>
      <v-divider></v-divider>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { defineProps , ref} from 'vue';
  
  const props = defineProps({
    title: String,
    value: String,
    helper: String
  });

  const isHovered = ref(false);
  </script>
  <style scoped>
  .highlight {
    border: 2px solid #070aa3; /* ou qualquer outra cor que desejar */
  }
  </style>