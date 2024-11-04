<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Transportadora } from '@/models/Transportadora';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import type { FastForm } from '@/models/FastForms';

import { fastFormConstruct } from '@/models/FastForms';
import DetailComponent from '@/views/cadastros_basicos/cadastro_generico/DetailComponent.vue';
const props = defineProps<{ transportadoras: Transportadora[], itemId: number | null | undefined, exibir_botao_add?: boolean }>();

const items = ref<Transportadora[]>([]);
const searchTerm = ref('');
const fastForm = ref<FastForm>();

const emit = defineEmits(['update:itemId']);
const selectedId = ref<number | null>(props.itemId ?? null);
onMounted(async() => {
  items.value = props.transportadoras;
  selectedId.value = props.itemId ?? null;
  fastForm.value = await fastFormConstruct('transportadora');


});

watch(selectedId, (newVal) => {
  emit('update:itemId', newVal);
});

watch(() => props.transportadoras, (newValues) => {
  if (newValues.length > 0) {

    items.value = newValues;

  }
});

function marcasSarchead() {
  if (searchTerm.value === '') {
    return items.value;
  } else {
    return items.value.filter((item) =>
      item.nome.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }
}
function itemProps(item: any) {
  return {
    title: item.nome,
    subtitle: item.cnpj,
  };
}

const dialogAdd = ref(false);


const newDescription = ref('');
const marcaAddBtnLoading = ref(false);


async function getList() {

  await fetchWrapper.get('cadastros_basicos/transportadora')
    .then((response) => {
      console.log(response);

      items.value = response;
    });
}
function closeDialog() {
  formEdit.value = false;
}
async function registroStore() {
  marcaAddBtnLoading.value = true;
  await fetchWrapper.post('cadastros_basicos/transportadora', { descricao: newDescription.value })
    .then(async (response) => {
      console.log(response);
      selectedId.value = response.id;
      await getList();



    }).catch((error) => {
      alert('Erro inesperado ao adicionar');
      console.log(error);
    });
  marcaAddBtnLoading.value = false;
}

const formEdit = ref(false);

function openEdit() {

  console.log('openEdit');

  formEdit.value = true;

}

</script>

<template>
  <v-dialog v-model="formEdit" v-if="fastForm" max-width="80%">
    <DetailComponent @refreshList="getList" @closeDialog="closeDialog" :item_id="0" :controller_form="fastForm">
    </DetailComponent>

  </v-dialog>
  <v-row>
    <v-col cols="10">
      <v-select density="compact" v-model="selectedId" :items="marcasSarchead()" item-value="id" item-text="descricao"
        label="Transportadora" :item-props="itemProps" variant="outlined" props>
        <template v-slot:prepend-item>
          <v-list-item>
            <v-list-item-content>
              <v-text-field variant="outlined" v-model="searchTerm" density="compact"
                placeholder="Pesquisar"></v-text-field>

            </v-list-item-content>

          </v-list-item>



          <v-divider class="mt-2"></v-divider>

        </template>
      </v-select>
    </v-col>
    <v-col v-if="props.exibir_botao_add !== false" cols="2" style="margin-left: -15px;">
      <v-btn icon color="success" size="small" @click="openEdit">
        <v-icon size="small">mdi-plus</v-icon>
      </v-btn>
    </v-col>
  </v-row>

</template>

<style scoped></style>