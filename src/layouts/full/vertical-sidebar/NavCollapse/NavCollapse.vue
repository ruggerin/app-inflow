<script setup>
import NavItem from '../NavItem/index.vue';
import Icon from '../Icon.vue';

const props = defineProps({ item: Object, level: Number });
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!---Item Childern -->
  <!-- ---------------------------------------------- -->
  <v-list-group no-action>
    <!-- ---------------------------------------------- -->
    <!---Dropdown  -->
    <!-- ---------------------------------------------- -->
    <template v-slot:activator="{ props }">
      <v-list-item v-bind="props" :value="item.label" rounded class="mb-1" multi-line active-color="secondary">
        <!---Icon  -->
        <template v-slot:prepend>
        <!--   <Icon :item="item.icon" :level="level" /> -->
           <v-icon :item="item.icon" :level="level" v-if="item.icon" :color="item.iconColor" size="small" class="mr-0">{{ item.icon }}</v-icon>
        </template>
        <!---Title  -->
        <v-list-item-title multi-line v-text="item.label" class="multiline"></v-list-item-title>
        <!---If Caption-->
        <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
          {{ item.subCaption }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
    <!--   {{ item.children }} -->
    <!-- ---------------------------------------------- -->
    <!---Sub Item-->
    <!-- ---------------------------------------------- -->
    <template v-for="(subitem, i) in item.children" :key="i" v-if="item.children">

      <!--   <NavCollapse :item="subitem" v-if="subitem.children" :level="level + 1" /> -->
      <NavItem :item="subitem" :level="level + 1"></NavItem>
    </template>
  </v-list-group>

  <!-- ---------------------------------------------- -->
  <!---End Item Sub Header -->
  <!-- ---------------------------------------------- -->
</template>

<style scoped>
.multiline {
  white-space: normal; /* Permite que o texto quebre em várias linhas */
  word-wrap: break-word; /* Quebra palavras longas */
}
</style>
