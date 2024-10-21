<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';;
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import 'vue3-easy-data-table/dist/style.css';




import UiParentCard from '@/components/shared/UiParentCard.vue';

const themeColor = ref('rgb(var(--v-theme-secondary))');



const headers: Header[] = [
    { text: "Código", value: "id" },
    { text: "Nome", value: "nome" },
    { text: "Ações", value: "acoes" },


];


onMounted(async () => {


    //Aplicação de filtro frontent
    await carregarDados()

    //console.log(items.value);


});
const items = ref<Object[]>([]);


async function carregarDados() {
    items.value = await fetchWrapper.get(`cadastros_basicos/perfil`);
    console.log(items.value)
}

</script>

<template>
    <v-row>
        <UiParentCard title="Perfis de acesso">
            <div class="d-flex justify-end" style="width: 100%;"> <v-btn icon variant="text">
                    <FilterIcon size="20" />
                </v-btn>

                <v-btn variant="text" @click="carregarDados">Atualizar</v-btn>
                <v-btn :to="{ path: '/controle-de-acesso/perfil/0/editar' }" variant="text">
                    <v-icon icon="mdi-plus"></v-icon>
                    <span>Novo</span>
                </v-btn>

            </div>
            <v-col cols="12" md="12">

                <EasyDataTable table-class-name="customize-table" :theme-color="themeColor" :headers="headers"
                    :items="items">

                    <template #item-acoes="{ id }">
                        <v-btn :to="{ path: '/controle-de-acesso/perfil/' + id + '/editar' }" icon variant="text">
                            <v-icon icon="mdi-pencil"></v-icon>
                        </v-btn>
                        <v-btn icon variant="text" color="error">
                            <v-icon icon="mdi-delete"></v-icon>
                        </v-btn>

                    </template>
                </EasyDataTable>
            </v-col>
        </UiParentCard>
    </v-row>
</template>
