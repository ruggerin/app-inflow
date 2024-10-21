<script setup>
import Icon from '../Icon.vue';

const props = defineProps({ item: Object, level: Number });
</script>

<template>
  <!---Single Item-->
  <v-list-item
    :to="item.path_url"
    rounded
    class="mb-1"
    active-color="secondary"
    :disabled="item.disabled"
    :target="item.type === 'external' ? '_blank' : ''"
  >
    <!---If icon-->
    <template v-slot:prepend>
      <!-- <Icon :item="item.icon" :level="level" /> -->
       <v-icon v-if="item.icon" :color="item.iconColor" size="small"  class="mr-2">{{ item.icon }}</v-icon>
    </template>
    <v-list-item-title>{{ $t(item.label) }}</v-list-item-title>
    <!---If Caption-->
    <v-list-item-subtitle v-if="item.label" class="text-caption mt-n1 hide-menu">
      {{ item.subCaption }}
    </v-list-item-subtitle>
    <!---If any chip or label-->
 
  </v-list-item>
</template>
