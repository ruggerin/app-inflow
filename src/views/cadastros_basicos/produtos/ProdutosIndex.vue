<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import 'vue3-easy-data-table/dist/style.css';
import type {Produto} from './produto_interface';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const themeColor = ref('rgb(var(--v-theme-secondary))');


const headers: Header[] = [
    { text: "Id", value: "id" },
    { text: "Código", value: "codigo" },
    { text: "Descrição", value: "descricao" },
    { text: "Ações", value: "acoes" },


];


onMounted(async () => {


//Aplicação de filtro frontent
await carregarDados()

//console.log(items.value);


});
const items = ref<Produto[]>([]);


async function carregarDados() {
    items.value = await fetchWrapper.get(`produtos/`);
    console.log(items.value)
}

</script>

<template>
    <v-row>
        <UiParentCard title="Cadastro de usuarios">
            <div class="d-flex justify-end" style="width: 100%;"> <v-btn icon variant="text">
                    <FilterIcon size="20" />
                </v-btn>

                <v-btn variant="text" @click="carregarDados">Atualizar</v-btn>

            </div>
            <v-col cols="12" md="12">

                <EasyDataTable table-class-name="customize-table" :theme-color="themeColor" :headers="headers" rowsPerPageMessage="Registros por página"
          rowsOfPageSeparatorMessage="de" emptyMessage="Não há registros disponíveis"
                    :items="items">

                    <template #item-acoes="{ id }">
                    
                        <v-btn :to="{ path: '/cadastro/produtos/'+id+'/editar' }" icon variant="text">
                            <EditIcon size="20" />
                        </v-btn>
                        

                    </template>
                </EasyDataTable>
            </v-col>
        </UiParentCard>
    </v-row>
</template>
