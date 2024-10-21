<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import treeview from "vue3-treeview";
import "vue3-treeview/dist/style.css";
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import { type Perfil } from '@/models/Perfil';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';

const route = useRoute();
const perfilItem = ref<Perfil>();

const permissoesTeste = ref<any>({});
const roots = ref<string[]>([]);
const carregarLoading = ref(false);

// Função para carregar os dados do servidor
async function carregarDados() {
  carregarLoading.value = true; // Indica que está carregando

  const id = route.params.id;
  console.log(id);

  perfilItem.value = await fetchWrapper.get(`cadastros_basicos/perfil/${id}`);
  console.log(perfilItem.value);

  carregarLoading.value = false; // Termina o carregamento
  construirPermissoesTree();
}
function getPerfilWithoutMenus() {
  if (!perfilItem.value) {
    return null;
  }
  const { menus, ...perfil } = perfilItem.value;
  return perfil;
}
async function submitForm() {

  if (!perfilItem.value) {
    return;
  }

  const perfil = getPerfilWithoutMenus();
  btnSubmitLoading.value = true;

  try {
    if (route.params.id == "0") {
      // Novo registro
      await fetchWrapper.post(`cadastros_basicos/perfil`, { perfil: perfil, permissoes: getSelectedValues() });
    } else {
      // Atualização
      await fetchWrapper.put(`cadastros_basicos/perfil/${perfilItem.value.id}`, { perfil: perfil, permissoes: getSelectedValues() });
    }

    // Exibir alerta de sucesso
    Swal.fire({
      icon: 'success',
      title: 'Sucesso',
      text: 'Operação realizada com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Ocorreu um erro ao salvar o perfil. Por favor, tente novamente.',
    });
  } finally {
    btnSubmitLoading.value = false;
  }
}
onMounted(async () => {
  await carregarDados();
});

// Função construtora para gerar a estrutura de permissões
const construirPermissoesTree = () => {
  const tree: any = {};
  const rootItems: string[] = [];

  if (!perfilItem.value?.menus) {
    console.error("Perfil não possui menus");
    return;
  }

  perfilItem.value.menus.forEach((perm) => {
    const parentId = `id${perm.id}`;
    if (!perm.permissoes) {
      console.error("Permissão sem filhos");
      return;
    }
    const childrenIds = perm.permissoes.map((item) => `sub_id${item.id}`);

    // Adiciona a permissão principal
    tree[parentId] = {
      text: perm.label,
      children: childrenIds, // Aqui os filhos são os IDs
      state: { checked: perm.acesso },
    };

    // Adiciona os nós filhos separadamente com seus detalhes
    perm.permissoes.forEach((item) => {
      const childId = `sub_id${item.id}`;
      tree[childId] = {
        text: item.label,
        state: { checked: item.acesso }, // Adicionando o estado do checkbox
      };
    });

    // Adiciona a permissão principal aos roots
    rootItems.push(parentId);
  });

  permissoesTeste.value = tree;
  roots.value = rootItems;
};


// Gera a configuração dinamicamente após o carregamento
const config = ref({
  roots: roots.value,
  checkboxes: true,
});

// Atualiza o config quando os roots mudam
watch(roots, (newRoots) => {
  config.value = {
    roots: newRoots,
    checkboxes: true,
  };
});



const getSelectedValues = () => {
  const selected: { [key: number]: number[] } = {};

  Object.keys(permissoesTeste.value).forEach((key) => {
    const node = permissoesTeste.value[key];

    // Checa se o item é uma permissão (pai)
    if (node.children && node.state && node.state.checked) {
      const permId = parseInt(key.replace("id", ""), 10);

      // Somente processa IDs válidos
      if (!isNaN(permId)) {
        if (!selected[permId]) {
          selected[permId] = [];
        }

        // Adiciona os itens filhos que estão selecionados
        node.children.forEach((childId: string) => {
          const childNode = permissoesTeste.value[childId]; // Agora, os filhos são IDs, não objetos

          if (childNode && childNode.state && childNode.state.checked) {
            // Remove o 'sub_id' do filho para pegar o número original
            const itemId = parseInt(childId.replace("sub_id", ""), 10);

            // Apenas processa IDs válidos
            if (!isNaN(itemId)) {
              selected[permId].push(itemId);
            }
          }
        });
      }
    }
  });
  return selected;
};

const btnSubmitLoading = ref(false);
</script>

<template>
  <UiParentCard title="Edição de perfil de acesso" v-if="perfilItem">
    <v-text-field v-model="perfilItem.nome" label="Nome do perfil" outlined></v-text-field>
    <v-card elevation="0">
      <v-card-title>Permissões</v-card-title>
      <v-card-text>
        <treeview :nodes="permissoesTeste" :config="config">
          <template v-slot:prepend="{ node }">
            <v-checkbox :label="node.text" :value="node.id" v-model="node.state.checked" />
          </template>
        </treeview>
      </v-card-text>
    </v-card>

    <!-- Exibindo a árvore de permissões para debugging -->


    <div class="d-flex justify-center">
      <div class="pa-1">
        <v-btn @click="submitForm()" :loading="btnSubmitLoading"
          color="primary"><v-icon>mdi-content-save-outline</v-icon>
          Salvar</v-btn>
      </div>
      <div class="pa-1">
      <v-btn  :to="'/controle-de-acesso/perfil'" color="secondary"><v-icon>mdi-close-circle-outline</v-icon>
        Cancelar Edição</v-btn>
    </div>
    </div>

    <!-- Exibindo os valores selecionados -->
    <!--     <pre>Selecionados: {{ getSelectedValues() }}</pre> -->
  </UiParentCard>
  <v-card v-if="carregarLoading" class="justify-center">
    <v-progress-linear indeterminate color="primary"></v-progress-linear>
  </v-card>
</template>
