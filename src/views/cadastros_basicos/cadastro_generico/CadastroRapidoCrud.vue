<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';
import UiParentCard from '@/components/shared/UiParentCard.vue';

import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

import 'vue3-easy-data-table/dist/style.css';

const themeColor = ref('rgb(var(--v-theme-secondary))');
import { CadastrosBasicosList, getFastForm } from '@/utils/CadastrosBasicosList';
import { type FastForm } from '@/models/FastForms';
import type { FastFormField } from '@/models/FastFormsFields';
import DetailComponent from './DetailComponent.vue';
import Swal from 'sweetalert2';
import moment from 'moment';

const props = defineProps<{

  controller_name: string
}>();

const headers = ref<Header[]>([]);
const items = ref<Item[]>([]);

const fastForm = ref<FastForm>();

async function getHelperInfo() {
  fastForm.value = getFastForm(props.controller_name);
  console.log(fastForm.value);


}


async function fastFormConstruct() {
  gridLoading.value = true;
  await fetchWrapper.get('cadastros_basicos/configuracao_cadastro_basico/' + props.controller_name + '/artefatos').then((response) => {
    console.log(response);
    fastForm.value = response;
  });
  gridLoading.value = false;
}
function generateHeaders() {
  console.log(fastForm.value?.fields)
  if (fastForm.value && fastForm.value.fields) {
    var headers = fastForm.value.fields.filter((e) => !e.hidden && !e.hidden_index).map((field) => ({
      text: field.label,
      value: field.name,
      type: field.type,
      sortable: true,

    }));
    headers.push({ text: 'Ações', value: 'actions', type: 'text', sortable: false });

    console.log(headers);
    return headers;

  }
  else {
    return [];
  }

  // return [];
}

function getType(value: string) {
  if (fastForm.value && fastForm.value.fields) {
    var headers = fastForm.value.fields.filter((e) => e.name == value).map((field) => (field.type));
    return headers[0] ?? 'text';
  }
}

const gridLoading = ref(false);
async function getList() {
  gridLoading.value = true;

  try {

    await fetchWrapper.get('cadastros_basicos/' + fastForm.value?.endpoint).then((response) => {
      items.value = response;
    });
    gridLoading.value = false;
  } catch (error) {
    console.error(error);

    // Garantir que o erro tenha uma propriedade message
    const message = (error as { message?: string }).message || 'Ocorreu um erro ao salvar a configuração. Por favor, tente novamente.';
    gridLoading.value = false;
    // Exibir alerta de erro
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: message,
    });
  }
}

function edit(id: number) {
  openEdit(id);
}


const dialogRemove = ref(false);

function dialogRemoveOpen(id: number) {
  formEditId.value = id;
  dialogRemove.value = true;
}


const dialogRemoveLoading = ref(false);
async function remove(id: number) {
  dialogRemoveLoading.value = true;
  await fetchWrapper.delete(`cadastros_basicos/${fastForm.value?.endpoint}/${id}`).then((response) => {
    console.log(response);
    getList();
  });
  dialogRemoveLoading.value = false;
  dialogRemove.value = false;
  Swal.fire('Removido', 'Item removido com sucesso', 'success');

}


const search = ref('');

onMounted(async () => {
  await fastFormConstruct();
  headers.value = generateHeaders();
  getList();

  // items.value = props.items;

});
watch(() => props.controller_name, async () => {
  await fastFormConstruct();
  headers.value = generateHeaders();
  getList()
});
const formEdit = ref(false);

const formEditId = ref(0);
function openEdit(id: number) {

  formEditId.value = id;
  formEdit.value = true;

}
function closeEdit() {
  formEdit.value = false;
}


</script>

<template>

  <v-dialog v-model="dialogRemove" max-width="290">
    <v-card>
      <v-card-title>Remover</v-card-title>
      <v-card-text>
        Deseja realmente remover este item?
        <br> Id: {{ formEditId }}
      </v-card-text>
      <v-card-actions>
        <v-btn @click="dialogRemove = false">Cancelar</v-btn>
        <v-btn @click="remove(formEditId)" color="error">Remover</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="formEdit" v-if="fastForm" max-width="80%">
    <DetailComponent @refreshList="getList" @closeDialog="closeEdit" :item_id="formEditId" :controller_form="fastForm">
    </DetailComponent>

  </v-dialog>
  <UiParentCard :title="fastForm?.label">

    <v-row>
      <v-col cols="12" lg="8">
        <v-text-field variant="outlined" v-model="search" label="Buscar" readonly></v-text-field>
      </v-col>
      <v-col cols="12" lg="4">
        <v-btn @click="openEdit(0)" color="primary">Novo</v-btn>
        <v-btn @click="getList()" variant="text" color="primary"><v-icon>mdi-refresh</v-icon> Autualizar</v-btn>
      </v-col>
      <v-col cols="12" lg="12">

        <EasyDataTable :loading="gridLoading" :headers="headers" :items="items">

          <template #item-actions="{ id }">

            <v-icon @click="edit(id)" color="primary">mdi-pencil</v-icon>
            <v-icon @click="dialogRemoveOpen(id)" color="error">mdi-delete</v-icon>
          </template>
          <template #item="{ item, column }">
            <span v-if="getType(column) == 'date'">{{ moment(item[column]).format('DD/MM/YYYY') }}</span>
            <span v-else-if="getType(column) == 'datetime'">{{ moment(item[column]).format('DD/MM/YYYY hh:mm') }}</span>

            <span v-else-if="getType(column) == 'boolean'">{{ item[column] ? 'Sim' : 'Não' }}</span>
            <div v-else-if="getType(column) == 'color'" class="d-flex justfy-center">
              <span> {{ item[column]}}</span>
              <v-sheet :color="item[column]" style="width: 20px; height: 20px; margin-left: 5px; "></v-sheet>
            </div>


            <span v-else>{{ item[column] }}</span>


          </template>
        </EasyDataTable>
      </v-col>
    </v-row>
  </UiParentCard>
</template>