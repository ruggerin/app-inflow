<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import type { Menu } from '@/models/Menu';
import type { MenuPermissao } from '@/models/MenuPermissoes';

const emit = defineEmits(['refreshList', 'closeDialog']);
function dialogClose() {
  emit('closeDialog');
}

const menuList = ref<Menu[]>([]);
const formLoading = ref(false);
const props = defineProps<{ id: number }>();
const isRoot = ref(false);
const btnLoading = ref(false);
const menuNew = ref<Menu>({
  id: 0,
  nome: '',
  ativo: false,
  created_at: '',
  updated_at: '',
  user_id_created: null,
  user_id_updated: null,
  user_id_deleted: null,
  motivo_alteracao: '',
  menu_pai: null,
  icon: 'mdi-circle',
  path_url: '',
  label: '',
  ordem: 0,
  crud_simples: false,
  open: false,
  children: [],
  permissoes: [],
});

async function getData() {
  formLoading.value = true;
  await fetchWrapper.get('cadastros_basicos/menus?menu_pai=0').then((data) => {
    menuList.value = data;
  });

  if (props.id == 0) {
    formLoading.value = false;
    return;
  }
  await fetchWrapper.get('cadastros_basicos/menus/' + props.id).then((data) => {
    menuNew.value = data;

    if (menuNew.value.menu_pai == 0 || menuNew.value.menu_pai == null) {
      isRoot.value = true;
    }
  });
  formLoading.value = false;
}

onMounted(() => {
  getData();
});

function getFormData() {
  const { created_at, updated_at, user_id_created, user_id_updated, user_id_deleted, motivo_alteracao, ...formData } = menuNew.value;
  return formData;
}

async function saveProduto() {
  try {
    if (menuNew.value.id > 0) {
      btnLoading.value = true;
      await fetchWrapper.put('cadastros_basicos/menus/' + menuNew.value.id, menuNew.value);
      emit('refreshList', menuNew.value);
      btnLoading.value = false;
      return;
    } else {
      btnLoading.value = true;
      await fetchWrapper.post('cadastros_basicos/menus', getFormData());
      btnLoading.value = false;
      emit('refreshList', menuNew.value);
    }
  } catch (e) {
    btnLoading.value = false;
    alert('Erro ao salvar menu');
    console.error('Erro ao salvar menu:', e);
  }
}

function adicionarPermissao() {
  const novaPermissao: MenuPermissao = {
    id: 0, // Usando timestamp como ID temporário
    menu_id: menuNew.value.id,
    label: '',
    name: '',
    created_at: new Date(),
    updated_at: new Date(),
    user_id_created: null,
    user_id_updated: null,
    user_id_deleted: null
  };
  if (!menuNew.value.permissoes) {
    menuNew.value.permissoes = [];
  }
  menuNew.value.permissoes.push(novaPermissao);
}

function removerPermissao(item: MenuPermissao) {
  if (!menuNew.value.permissoes) {
    return;
  }
  menuNew.value.permissoes = menuNew.value.permissoes.filter((permissao: MenuPermissao) => permissao !== item);
}
</script>

<template>
  <v-card>
    <v-toolbar color="primary" dark>
      <v-toolbar-title v-if="id == 0">Cadastro de Menu</v-toolbar-title>
      <v-toolbar-title v-else>Edição de Menu</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn size="small" :loading="btnLoading" color="white" class="" @click="saveProduto()">
        <v-icon>mdi-content-save</v-icon> SALVAR
      </v-btn>
      <v-btn size="small" color="white" icon @click="dialogClose()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text v-if="formLoading">
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
    </v-card-text>
    <v-card-text v-else class="scrollable-content">
      <v-form>
        <v-row>
          <v-col cols="12">
            <v-text-field density="compact" class="text-uppercase" v-model="menuNew.id" label="Id" disabled variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field density="compact" class="text-uppercase" v-model="menuNew.nome" label="Nome" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-switch v-model="isRoot" color="primary" label="É pasta/Grupo de menu?" />
          </v-col>
          <v-col cols="12" v-if="!isRoot">
            <v-select label="Pasta" density="compact" variant="outlined" v-model="menuNew.menu_pai" :items="menuList" item-title="label" item-value="id"></v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field density="compact" class="text-uppercase" v-model="menuNew.icon" label="Ícone" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field density="compact" class="text-uppercase" v-model="menuNew.path_url" label="URL do Caminho" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field density="compact" class="text-uppercase" v-model="menuNew.label" label="Rótulo" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field density="compact" class="text-uppercase" v-model="menuNew.ordem" label="Ordem" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-checkbox v-model="menuNew.crud_simples" label="CRUD Simples" variant="outlined"></v-checkbox>
          </v-col>
          <v-col cols="12" v-if="!menuNew.crud_simples">
            <v-table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Label</th>
                  <th>Name</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in menuNew.permissoes" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>
                    <v-text-field v-model="item.label"></v-text-field>
                  </td>
                  <td>
                    <v-text-field v-model="item.name"></v-text-field>
                  </td>
                  <td>
                    <v-btn variant="text" small @click="removerPermissao(item)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <v-btn @click="adicionarPermissao">Adicionar Nova Permissão</v-btn>
          </v-col>
          <v-col cols="12">
            <v-text-field density="compact" class="text-uppercase" v-model="menuNew.created_at" label="Criado em" variant="outlined" disabled></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field density="compact" class="text-uppercase" v-model="menuNew.updated_at" label="Atualizado em" variant="outlined" disabled></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.scrollable-content {
  max-height: 500px;
  /* Defina a altura máxima desejada */
  overflow-y: auto;
}
</style>