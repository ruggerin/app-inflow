<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';

import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import 'vue3-easy-data-table/dist/style.css';
import ImportarArquivo from './importarArquivo.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { SwitchVerticalIcon, TrashIcon } from 'vue-tabler-icons';
import Swal from 'sweetalert2';
//import type User from './usuario_interface.ts'

const themeColor = ref('rgb(var(--v-theme-secondary))');


const error2snackbar = ref(false);



const headers: Header[] = [
    { text: "Id", value: "id" },
    { text: "Descricao", value: "descricao" },
    { text: "Fechamento", value: "fechamento_dt" },
    { text: "Ações", value: "acoes" },


];


onMounted(async () => {

    //Aplicação de filtro frontent
    await carregarDados()
   // Swal.fire('Dados atualizados com sucesso!')


    //console.log(items.value);


});

async function preExcluirLivro(livro_id: string | number) {
    await Swal.fire({
        title: "Você tem certeza?",
        text: "Você está prestes a excluir definitivamente este livro.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, deletar",
        cancelButtonText: 'Não'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await excluirLivro(livro_id);
            await carregarDados();
            Swal.fire({
                title: "Excluído!",
                text: "O livro foi excluído com sucesso.",
                icon: "success"
            });
        }
    });

  
}

async function excluirLivro(livro_id: string | number) {

    await fetchWrapper.delete(`fiscal/livros/${livro_id}/deletar`);

    return null;
}


/*const items: Item[] = [
    { id: '1', descricao: 'set-2023', fechamento: '2023-10-01' }
]*/

const items = ref<Item[]>([]);

const dialog = ref(false);

function abriDialog() {
    // console.log('ação chamada')
    dialog.value = true;
}

function closeDialog() {
    console.log('ação chamada "fechar"')
    dialog.value = false;
}


async function carregarDados() {
    items.value = await fetchWrapper.get(`fiscal/livros`);
    console.log(items.value)
}

</script>

<template>
    <!--

           <v-btn variant="flat" color="error" @click="error2snackbar = true"> error </v-btn>
                <v-btn variant="flat" color="success" class="text-white" @click="success2snackbar = true"> success </v-btn>
    -->

    <v-snackbar color="error" variant="flat" rounded="md" v-model="error2snackbar">
        Erro ao executar rotina
        <template v-slot:actions>
            <v-btn color="white" variant="text" @click="error2snackbar = false">
                <XIcon size="20" stroke-width="1.5" />
            </v-btn>
        </template>
    </v-snackbar>

    <v-row>
        <UiParentCard title="Livros Fiscais">
            <div class="d-flex justify-end" style="width: 100%;"> <v-btn icon variant="text">
                    <FilterIcon size="20" />
                </v-btn>

                <v-btn variant="text" @click="abriDialog">Importar Arquivo</v-btn>

            </div>
            <v-col cols="12" md="12">

                <EasyDataTable table-class-name="customize-table" :theme-color="themeColor" :headers="headers"
                    :items="items">
                    <template #item-descricao="{ mes, ano }">
                        {{ 'Livro fiscal: ' + mes + '/' + ano }}

                    </template>
                    <template #item-acoes="{ id }">
                        <v-btn :to="{ path: '/fiscal/livros/' + id + '/show' }" icon variant="text">
                            <EditIcon size="20" />
                        </v-btn>
                        <v-btn icon color="error" @click="preExcluirLivro(id)" variant="text">
                            <TrashIcon size="20" />
                        </v-btn>





                    </template>
                </EasyDataTable>
            </v-col>


        </UiParentCard>
    </v-row>
    <v-dialog v-model="dialog" temporary location="right" width="500">
        <ImportarArquivo @closeDrawer="closeDialog()"></ImportarArquivo>
    </v-dialog>
</template>
