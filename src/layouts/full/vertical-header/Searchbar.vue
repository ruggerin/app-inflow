<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { useRouter } from 'vue-router';
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
const router = useRouter();

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
    router.push(path);
    menuVisible.value = false;
    if (props.closesearch) {
      props.closesearch();
    }
  }
}
</script>

<template>
  <div class="">
    <!-- Campo de busca -->
    <v-text-field placeholder="Pesquisar" v-model="searchTerm" color="primary" variant="outlined" hide-details
      @focus="menuVisible = true">
      <template v-slot:prepend-inner>
        <v-icon stroke-width="1.5" size="17" class="text-lightText">mdi-magnify</v-icon>
      </template>
      <template v-slot:append-inner>
        <v-btn color="lighterror" icon rounded="sm" variant="flat" size="small"
          class="text-error ml-3 d-block d-lg-none"  @click="closesearch">
          <v-icon stroke-width="1.5" size="20">mdi-close</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <!-- Lista de resultados filtrados -->
    <v-card elevation="12" v-if="menuVisible && searchTerm" class="cardMenu" max-width="300">
      <div style="height: 50px;"></div>
      <v-list>
        <v-list-item  v-for="item in getFilteredChildren()" :key="item.path_url" rounded
          @click="navigateTo(item.path_url)" class="mb-1" active-color="secondary">
          <v-list-item-title v-text="item.label" class="mr-auto"></v-list-item-title>
        </v-list-item>
        <div v-if ="getFilteredChildren() ==0 " class="text-center pa-5"><i>Rotina não localizada</i></div>
      </v-list>
    </v-card>
  </div>
</template>

<style scoped>

.cardMenu {
  z-index: -1 !important;
  position: fixed !important; /* Fixa na tela, fora do fluxo do container */
  top: 25px; /* Ajuste conforme o necessário */


  max-height: 80vh; /* Limite de altura */
  overflow-y: auto; /* Rolagem caso o conteúdo seja muito grande */
}


</style>