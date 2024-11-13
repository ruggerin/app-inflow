<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import type { FastForm } from '@/models/FastForms';

import { fastFormConstruct } from '@/models/FastForms';
import DetailComponent from '@/components/cadastro_generico/DetailComponent.vue';

const items = ref<any[]>([]);
const fastForm = ref<FastForm>();
const searchTerm = ref('');
const selectedId = ref<number | null>(null);

const props = defineProps<{ 
    controller_name: string, 
    label: string, 
    subtitle?: string, 
    clearable?: boolean,
    itemId: any, exibir_botao_add?: boolean, density?: 'default' | 'comfortable' | 'compact' }>();

const density = ref<'default' | 'comfortable' | 'compact'>('default');

async function getList() {
    await fetchWrapper.get('cadastros_basicos/' + props.controller_name).then((response) => {
        console.log(props.controller_name);
        console.log('buscou');
        console.log(response);

        items.value = response;
    }).catch((error) => {
        console.error('Error fetching list from server:', error);
    });
}

const emit = defineEmits(['update:itemId']);

watch(selectedId, (newVal) => {
    emit('update:itemId', newVal);
});

onMounted(async () => {
    selectedId.value = props.itemId;
    await getList();
    if (props.density) {
        density.value = props.density;
    }
    fastForm.value = await fastFormConstruct(props.controller_name);
});

watch(() => props.controller_name, async () => {
    await getList();
});

function marcasSarchead() {
    if (searchTerm.value === '') {
        return items.value.slice(0, 30); // Retorna apenas os primeiros 30 itens
    } else {
        return items.value.filter((item) => {
            const searchField = item.descricao ?? item.nome;
            return searchField.toLowerCase().includes(searchTerm.value.toLowerCase());
        }).slice(0, 30); // Retorna apenas os primeiros 30 itens filtrados
    }
}

function itemProps(item: any) {
    let sbtitle = item.id;
    if (props.subtitle) {
        sbtitle = item[props.subtitle];
    }
    return {
        title: item.descricao ?? item.nome,
        subtitle: sbtitle,
    };
}

const formEdit = ref(false);

function closeDialog() {
    formEdit.value = false;
}

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
      <v-select clearable :density="density" v-model="selectedId" :items="marcasSarchead()" item-value="id"
        item-text="descricao" :label="label" :item-props="itemProps" variant="outlined" props>
        <template v-slot:prepend-item>
          <v-list-item>
            <v-text-field variant="outlined" v-model="searchTerm" density="compact" placeholder="Pesquisar"></v-text-field>
          </v-list-item>
          <v-divider class="mt-2"></v-divider>
        </template>
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-title>Nenhum dado disponível</v-list-item-title>
          </v-list-item>
        </template>
      </v-select>
    </v-col>
    <v-col v-if="props.exibir_botao_add !== false" cols="2" style="margin-left: -15px;">
      <v-btn variant="text" icon color="success" size="small" @click="openEdit">
        <v-icon size="small">mdi-plus</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<style scoped>
/* Seus estilos aqui */
</style>