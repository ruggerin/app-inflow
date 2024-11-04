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

const props = defineProps<{ controller_name: string, label: string, subtitle?: string, itemId: any, exibir_botao_add?: boolean, density?: string }>();

const density = ref('default');

async function getList() {

    await fetchWrapper.get('cadastros_basicos/' + props.controller_name).then((response) => {
        console.log(props.controller_name)
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
    await getList();
    if (props.density) {
        density.value = props.density;

    }
    fastForm.value = await fastFormConstruct(props.controller_name);
});

watch(() => props.controller_name, async (newValues) => {
    await getList();
});


function marcasSarchead() {
    if (searchTerm.value === '') {
        return items.value;
    } else {
        return items.value.filter((item) =>
            item.descricao.toLowerCase().includes(searchTerm.value.toLowerCase()) || item.nome.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
    }
}


function itemProps(item: any) {
    let sbtitle = item.id;
    if(props.subtitle){
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

                        <v-text-field variant="outlined" v-model="searchTerm" density="compact"
                            placeholder="Pesquisar"></v-text-field>



                    </v-list-item>



                    <v-divider class="mt-2"></v-divider>

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