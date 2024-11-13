<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const props = defineProps({
  closesearch: {
    type: Function,
    required: false
  }
});

const searchTerm = ref('');
const menuList = ref([]);
const menuVisible = ref(false);

onMounted(async () => {
  try {
    const menus = await fetchWrapper.get(`auth/menus`);
    menuList.value = menus;
    console.log(menuList.value);
  } catch (error) {
    console.error('Erro ao buscar menus:', error);
  }
});

function getFilteredChildren() {
  const filteredItems = [];
  
  menuList.value.forEach(menu => {
    if (menu.children) {
      menu.children.forEach(child => {
        if (child.label.toLowerCase().includes(searchTerm.value.toLowerCase())) {
          filteredItems.push(child);
        }
      });
    }
  });
  
  return filteredItems;
}

// Função para navegar usando URL direta
function navigateTo(path) {
  if (path) {
    console.log('Navegando para:', path);
    window.location.href = path;
  }
}
</script>

<template>
  <div>
    <!-- Campo de busca -->
    <v-text-field
      placeholder="Pesquisar"
      v-model="searchTerm"
      color="primary"
      variant="outlined"
      hide-details
      @focus="menuVisible = true"
      @blur="menuVisible = false"
    >
      <template v-slot:prepend-inner>
        <v-icon stroke-width="1.5" size="17" class="text-lightText">mdi-magnify</v-icon>
      </template>
      <template v-slot:append-inner>
        <v-btn
          color="lighterror"
          icon
          rounded="sm"
          variant="flat"
          size="small"
          class="text-error ml-3 d-block d-lg-none"
         
        >
          <v-icon stroke-width="1.5" size="20">mdi-close</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <!-- Lista de resultados filtrados -->
    <v-card
      v-if="menuVisible && searchTerm"
      class="cardMenu"
      max-width="300"
    >
      <v-list>
        <v-list-item
          v-for="item in getFilteredChildren()"
          :key="item.path_url"
          rounded
          @click="navigateTo(item.path_url)"
          class="mb-1"
          active-color="secondary"
        >
          <v-list-item-title v-text="item.label" class="mr-auto"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<style>
.cardMenu {
  z-index: 9999999 !important;
  position: absolute;
  top: 30px;
}
</style>
