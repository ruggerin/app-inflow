<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import type { Menu } from '@/models/Menu';
import { VueDraggableNext } from 'vue-draggable-next'
import MenuDetail from '../menu/MenuDetail.vue';


import UiParentCard from '@/components/shared/UiParentCard.vue';

import 'vue3-easy-data-table/dist/style.css';


const items = ref<Menu[]>([]);
const themeColor = ref('rgb(var(--v-theme-secondary))');
const carregarLoading = ref(false);
const treeViewItems = ref({});
const roots = ref<string[]>([]);

async function carregarDados() {
    carregarLoading.value = true;
    items.value = await fetchWrapper.get(`cadastros_basicos/menus-groupedIndex`);
    console.log(items.value);
    carregarLoading.value = false;

    // Chamando a função para construir o treeViewItems após carregar os dados

}

onMounted(async () => {
    await carregarDados();
});

const search = ref('');
function filterItems() {
    const searchTerm = search.value.toLowerCase();
    return items.value.filter((item) => {
        const matchesParent = item.label?.toLowerCase().includes(searchTerm);
        var matchesChildren = false;
        if (item.children) {
             matchesChildren = item.children.some((child) =>
                child.label?.toLowerCase().includes(searchTerm)
            );
        }

        // Retorna true se o pai ou qualquer filho corresponder ao critério de pesquisa
        return matchesParent || matchesChildren;
    });
}



function closeFormDialog() {
    dialogAdd.value = false;
}

function limparFiltro() {
    search.value = '';
    carregarDados();
}

const dialogAdd = ref(false);
const menuEdit = ref<Menu>({
    id: 0,
    nome: '',
    ativo: true,
    created_at: '',
    updated_at: '',
    user_id_created: null,
    user_id_updated: null,
    user_id_deleted: null,
    motivo_alteracao: '',
    menu_pai: null,
    icon: '',
    path_url: '',
    label: '',
    ordem: 0,
    crud_simples: false,
    children: [],
});

const openGroups = ref([]);

function editDialogShow(menu: Menu | null) {
    menuEdit.value = menu ? { ...menu } : {
        id: 0,
        nome: '',
        ativo: true,
        created_at: '',
        updated_at: '',
        user_id_created: null,
        user_id_updated: null,
        user_id_deleted: null,
        motivo_alteracao: '',
        menu_pai: null,
        icon: '',
        path_url: '',
        label: '',
        ordem: 0,
        crud_simples: false,
        children: [],
    };
    dialogAdd.value = true;

}

const dialogDelete = ref(false);
function dialogDeleteShow(item: Menu) {
    console.log('Deletar:', item);
    dialogDelete.value = true;
}
</script>

<template>
    <v-dialog v-model="dialogDelete" max-width="25%">
        <v-card>

            <v-card-text>
                <v-row justify="center">
                    <v-col cols="12" class="text-center">
                        <h3 class="pa-5">Tem certeza que deseja deletar o Menu?</h3>
                        <p>Produto: {{ menuEdit.id }} - {{ menuEdit.nome }}</p>

                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="dialogDelete = false">Cancelar</v-btn>
                <v-btn color="error" @click="dialogDelete = false">Deletar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialogAdd">
        <MenuDetail @refreshList="carregarDados" @closeDialog="closeFormDialog" :id="menuEdit.id" />
        <!--<produtoEditComponent @vincularProdutoId="" @vinculoDialogClose="closeFormDialog" @refreshList="carregarDados"
            :produtoPesquisa="produtoPesquisaEdit" :telaCadastro="true" :marcas="marcas" :catetegorias="categorias"
            :produto="produtoPesquisaEdit" />
        -->
    </v-dialog>
    <v-row>
        <v-col cols="12">
            <UiParentCard title="Cadastro de Menu">
                <v-col cols="12">
                    <v-row>
                        <v-col cols="12" md="5" lg="5" xl="5" xxl="5">
                            <v-text-field variant="outlined" v-model="search" label="Pesquisar"
                                prepend-inner-icon="mdi-magnify">
                            </v-text-field>
                        </v-col>




                        <v-col cols="12" md="6" lg="6" xl="6" xxl="6">
                            <div class="d-flex justify-end pa-5">
                                <v-btn color="primary" variant="text" @click="limparFiltro">
                                    <v-icon icon="mdi-close"></v-icon>
                                    Limpar Filtro
                                </v-btn>
                                <v-btn color="primary" :loading="carregarLoading" variant="text"
                                    @click="carregarDados()">
                                    Atualizar
                                </v-btn>

                                <v-btn color="primary" elevation="0" @click="editDialogShow(null)">
                                    <v-icon icon="mdi-plus"></v-icon>
                                    Novo
                                </v-btn>
                                <v-btn  class="ml-3" disabled primary @click="dialogDeleteShow(menuEdit)">

                                    Aplicar reordenação
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>


                <v-col cols="12" md="12">
                    <h3>Árvore de Menus</h3>
                    <v-list v-model:opened="openGroups">
                        <v-list-group prepend-icon="mdi-folder" v-for="grupo in filterItems()" :key="grupo.id"
                            v-model="grupo.open">
                            <template v-slot:activator="{ props }">
                                <v-list-item v-bind="props">
                                    <v-row class="align-center">
                                        <v-col cols="10">
                                            <v-list-item-title>{{ grupo.label }}</v-list-item-title>
                                        </v-col>
                                        <v-col cols="2" class="text-right">
                                            <v-btn variant="text" size="small" color="primary"
                                                @click="editDialogShow(grupo)">
                                                <v-icon>mdi-pencil</v-icon>
                                                Editar
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-list-item>
                            </template>

                            <!--@change="onChange"-->
                            <VueDraggableNext v-model="grupo.children" :group="grupo">

                                <v-list-item v-for="menu in grupo.children" :key="menu.id">
                                    <v-row class="align-center">
                                        <v-col cols="10">
                                            <v-list-item-title>{{ menu.label }}</v-list-item-title>
                                        </v-col>
                                        <v-col cols="2" class="text-right">
                                            <v-btn variant="text" size="small" color="primary"
                                                @click="editDialogShow(menu)">
                                                <v-icon>mdi-pencil</v-icon>
                                                Editar
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-list-item>
                            </VueDraggableNext>
                        </v-list-group>
                    </v-list>

                    <!-- Debug para verificar estrutura -->
                    <!--  <pre>{{ treeViewItems }}</pre> -->
                </v-col>
            </UiParentCard>
        </v-col>
    </v-row>

</template>
