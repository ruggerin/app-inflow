<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import { type FastForm } from '@/models/FastForms';
import type { Header, Item } from 'vue3-easy-data-table';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import 'vue3-easy-data-table/dist/style.css';
import { VueDraggableNext } from 'vue-draggable-next'
import Swal from 'sweetalert2';


const headers = ref<Header[]>([
    { text: 'Tabela', value: 'TABLE_NAME', sortable: true },
    { text: 'Nome Controle', value: 'controle_nome', sortable: true },
    { text: 'Ações', value: 'actions', sortable: true },
]);
const formularios = ref<FormularioCadastro[]>([]);

function listItems() {

    var list = formularios.value;
    if (search.value.length >= 1) {
        list = list.filter((e) => {
            if (
                e.TABLE_NAME?.toLowerCase().includes(search.value.toLowerCase()) ||
                e.controle_nome?.toLowerCase().includes(search.value.toLowerCase()) ||
                e.id?.toString().includes(search.value)
            ) {
                return e;
            }
        }
        );
    }
    return list.sort((a, b) => b.id! - a.id!);
}
const search = ref('');
interface FormularioCadastro {
    TABLE_NAME: string,
    label: string | null,
    controle_nome: string | null,
    id: number | null,
    columns: columns[]
}

interface columns {
    'order': number,

    'COLUMN_NAME': string,
    'DATA_TYPE': string,
    'IS_NULLABLE': string,
    'cadastro_basico_id': number | null,
    'colecao_helper': string | null,
    'hidden': boolean | null,
    'hidden_index': boolean | null,
    'id': number | null,
    'label': string | null,
    'motivo_alteração': string | null,
    'name': string | null,
    'readonly': boolean | null,
    'required': boolean | null,
    'type': string | null,
}


function getData() {
    fetchWrapper.get('cadastros_basicos/configuracao_cadastro_basico').then((response) => {
        console.log(response);
        formularios.value = response;
    });
}
async function edit(TABLE_NAME: string) {
    formEditDialogLoading.value = true;
    await fetchWrapper.get('cadastros_basicos/configuracao_cadastro_basico/' + TABLE_NAME + '/detail').then((response) => {
        console.log(response);
        editForm.value = response;
    });
    editForm.value?.columns.sort((a, b) => a.order - b.order);

    formEditDialogLoading.value = false;
    formEditDialog.value = true;

}
function configRemove(TABLE_NAME: string) {

}
onMounted(() => {
    getData();

});

function handleItemClick(TABLE_NAME: string) {
    edit(TABLE_NAME)
}

const esconderLista = ref(false);
function setVisualizateForm(){
    esconderLista.value = !esconderLista.value;
}

const formEditDialog = ref(false);
const formEditDialogLoading = ref(false);

const editForm = ref<FormularioCadastro>();

const tiposDados = [
    { value: 'text', text: 'Texto' },
    { value: 'number', text: 'Número' },
    { value: 'date', text: 'Data' },
    { value: 'time', text: 'Hora' },
    { value: 'datetime', text: 'Data e Hora' },
    { value: 'select', text: 'Seleção' },
    { value: 'boolean', text: 'Verdadeiro/Falso' },

    { value: 'textarea', text: 'Textarea' },
    { value: 'radio', text: 'Radio' },
    { value: 'file', text: 'Arquivo' },
    { value: 'image', text: 'Imagem' },
    { value: 'password', text: 'Senha' },
    { value: 'email', text: 'Email' },
    { value: 'url', text: 'URL' },
    { value: 'tel', text: 'Telefone' },
    { value: 'cpf', text: 'CPF' },
    { value: 'cnpj', text: 'CNPJ' },
    { value: 'cep', text: 'CEP' },
    { value: 'money', text: 'Dinheiro' },
    { value: 'percent', text: 'Porcentagem' },
    { value: 'color', text: 'Cor' },

    { value: 'markdown', text: 'Markdown' }
];

const submitButtonLoading = ref(false);



async function submitForm() {
    try {

        submitButtonLoading.value = true;

        editForm.value?.columns.forEach((column, index) => {
            column.order = index + 1;
        });
        
        const response = await fetchWrapper.post('cadastros_basicos/configuracao_cadastro_basico/' + editForm.value?.TABLE_NAME + '/update', editForm.value);
        console.log(response);

        // Exibir alerta de sucesso
        Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Operação realizada com sucesso!',
        });
        submitButtonLoading.value = false;
    } catch (error) {
        console.error('Erro ao salvar configuração:', error);
        const message = (error as { message?: string }).message || 'Ocorreu um erro ao salvar a configuração. Por favor, tente novamente.';
        // Exibir alerta de erro
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: message,
        });
        submitButtonLoading.value = false;
    }
}

</script>
<template>

    <v-row>
        <v-col cols="12">
            <UiParentCard title="Configuração Cadastro Básico">
                <v-row>

                    <v-col v-if="!esconderLista" cols="3">

                        <!--   <EasyDataTable :headers="headers" :items="listItems()" :loading="false" class="elevation-1">
                            <template #item-actions="{ TABLE_NAME }">
                                <v-btn @click="edit(TABLE_NAME)" variant="text"><v-icon>mdi-cog</v-icon></v-btn>
                                <v-btn @click="configRemove(TABLE_NAME)" color="error"
                                    variant="text"><v-icon>mdi-delete</v-icon></v-btn>
                            </template>
</EasyDataTable> -->

                        <v-col cols="12">
                            <v-text-field variant="outlined" v-model="search" label="Buscar"
                                prepend-inner-icon="mdi-magnify"></v-text-field>
                        </v-col>
                        <div class="scrollable-container">
                            <v-list>
                                <v-list-item v-for="(item, i) in listItems()" @click="handleItemClick(item.TABLE_NAME)"
                                    clickable :key="item.TABLE_NAME" :value="item">


                                    <v-list-item-title v-if="item.id == null">
                                        <small style="font-style: italic;"> {{ item.TABLE_NAME }}</small>

                                    </v-list-item-title>

                                    <v-list-item-title v-else>
                                        <v-icon size="small" v-if="item.id" color="primary"> mdi-check-circle</v-icon>
                                        <span class="text-primary">
                                            {{ item.TABLE_NAME }}
                                        </span>
                                    </v-list-item-title>

                                </v-list-item>
                            </v-list>
                        </div>
                    </v-col>
                  
                    <v-col :cols="esconderLista ? 12 : 9" class="parent-container">

                        <v-card v-if="formEditDialogLoading">
                            <v-card-text class="d-flex justify-center align-center" style="height: 100vh;">
                                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                            </v-card-text>
                        </v-card>
                        <v-card elevation="0" v-if="formEditDialog && !formEditDialogLoading">
                            <v-card-title>
                                <v-toolbar color="primary" dark>
                                    <v-toolbar-title>{{ editForm?.TABLE_NAME }}</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-btn :loading="submitButtonLoading" variant="text"
                                        @click="submitForm">Salvar</v-btn>
                                    <v-btn icon @click="formEditDialog = false">
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                </v-toolbar>
                            </v-card-title>
                            <v-card-text>
                                <v-row v-if="editForm" class="pa-2">
                                    <v-col cols="12">
                                        <v-text-field variant="outlined" v-model="editForm.controle_nome"
                                            label="Endpoint - Api Resource" hide-details></v-text-field>
                                    </v-col>
                                    <v-col cols="12">

                                        <v-text-field variant="outlined" v-model="editForm.label"
                                            label="Label - Texto apresentação" hide-details></v-text-field>
                                    </v-col>


                                </v-row>
                            </v-card-text>
                            <v-card-text>
                                <div class="scrollable-horizontal" v-if="editForm">
                                    <v-table style="min-width: 1600px !important;">
                                        <template v-slot:default>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Seq</th>
                                                    <th>COLUMN_NAME</th>
                                                    <th>DATA_TYPE</th>
                                                    <th>IS_NULLABLE</th>
                                                    <th width="400">Label</th>
                                                    <th width="400">Tipo Apresentação</th>

                                                    <th width="400">Coleção Apoio</th>
                                                    <th>Esconder Form.</th>
                                                    <th>Esconder Lista</th>
                                                    <th>Somente Leitura</th>
                                                    <th>Obrigatório</th>

                                                </tr>
                                            </thead>

                                            <VueDraggableNext v-model="editForm.columns" tag="tbody">
                                                <tr v-for="(row, index) in editForm.columns"
                                                    :key="row.id !== null ? row.id : `row-${index}`">
                                                    <td>
                                                        <v-icon>mdi-drag</v-icon>
                                                    </td>
                                                    <td>{{ index + 1 }}</td>
                                                    <td>{{ row.COLUMN_NAME }}</td>
                                                    <td>{{ row.DATA_TYPE }}</td>
                                                    <td>{{ row.IS_NULLABLE }}</td>
                                                    <td class="label-column">
                                                        <v-text-field v-model="row.label" hide-details
                                                            dense></v-text-field>
                                                    </td>
                                                    <td class="label-column">
                                                        <v-select item-title="text" hide-details item-text="text"
                                                            item-value="value" v-model="row.type" :items="tiposDados"
                                                            dense></v-select>

                                                    </td>
                                                    <td>
                                                        <v-text-field v-model="row.colecao_helper" hide-details
                                                            dense></v-text-field>
                                                    </td>
                                                    <td>
                                                        <v-switch color="primary" v-model="row.hidden" hide-details
                                                            dense></v-switch>
                                                    </td>
                                                    <td>
                                                        <v-switch color="primary" v-model="row.hidden_index" hide-details
                                                            dense></v-switch>
                                                    </td>
                                                    <td>
                                                        <v-switch color="primary" v-model="row.readonly" hide-details
                                                            dense></v-switch>
                                                    </td>
                                                    <td>
                                                        <v-switch color="primary" v-model="row.required" hide-details
                                                            dense></v-switch>
                                                    </td>

                                                </tr>
                                            </VueDraggableNext>

                                        </template>
                                    </v-table>
                                </div>
                            </v-card-text>
                        </v-card>

                        <v-card v-else>
                            <v-card-text class="d-flex justify-center align-center" style="height: 75vh;">
                                <h3> Selecione a tabela para configurar o cadastro</h3>
                            </v-card-text>
                        </v-card>
                        <div class="btn-container">
                            <v-btn @click="setVisualizateForm()" icon text small>
                                
                                <v-icon v-if="esconderLista">mdi-arrow-right-bold-box-outline</v-icon>
                                <v-icon v-else="esconderLista">mdi-arrow-left-bold-box-outline</v-icon></v-btn>
                        </div>

                    </v-col>

                </v-row>
            </UiParentCard>
        </v-col>
        <v-col cols="12">

        </v-col>
    </v-row>


</template>
<style scoped>

.parent-container {
  position: relative; /* Define a posição relativa para o contêiner pai */
}

.btn-container {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 1000; /* Certifique-se de que o valor de z-index seja maior que o das outras divs */
}
.scrollable-container {
    max-height: 75vh;
    overflow-y: auto;
    display: block;
}

.scrollable-horizontal {
    overflow-x: auto;

    display: block;


}

.label-column {
    width: 500px;
}

.text-column {
    width: 300px;
}

.small-text-size {
    font-size: 10px;
}
</style>