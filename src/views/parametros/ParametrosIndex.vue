<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';;
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import type { Parametros } from '@/models/Parametros';

import { getParametros } from '@/models/Parametros';
import Swal from 'sweetalert2';

const carregarDadosBtnLoading = ref(false);
async function carregarDados() {
    console.log('Carregar dados');
    parametroList.value = await getParametros()
}

const parametroList = ref<Parametros[]>([]);

const headers: Header[] = [
    { text: "Nome", value: "nome", sortable: true },
    { text: "Valor", value: "valor", sortable: true },
    { text: "Ações", value: "acoes" },
];

function salvar() {
    console.log('Salvar', parametroList.value);

    Swal.fire({
        title: 'Salvar',
        text: 'Deseja salvar as alterações?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
    }).then((result) => {
        if (result.isConfirmed) {
            sbtmAtualizar()
        }
    });
}



async function sbtmAtualizar() {

    salvarBtnLoading.value = true;
    try {
        await fetchWrapper.put('cadastros_basicos/parametros-updatelist', parametroList.value).then((response) => {
            console.log(response)
            Swal.fire('Salvo!', '', 'success');
        });
    } catch (error) {
        console.log(error)
        Swal.fire('Erro!', 'Erro ao salvar', 'error');
    }
    salvarBtnLoading.value = false;
    carregarDados();
}

function editar(item: Parametros) {
    console.log('Editar', item);

}
const salvarBtnLoading = ref(false);
onMounted(() => {
    carregarDados();
});

function cancelarAgendamento() {
    Swal.fire({
        title: 'Cancelar agendamento',
        text: 'Deseja cancelar o agendamento?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
    }).then((result) => {
        if (result.isConfirmed) {
            console.log('Cancelar agendamento');
        }
    });
}
function dicaControleShow(text_1: string, text_2?: string) {
    Swal.fire({

        html: text_1 + '<br><br>' + text_2,
        icon: 'info',
        confirmButtonText: 'OK'
    });
}

const search = ref('');
</script>

<template>
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-title>
                    <v-row>
                        <v-col cols="12" md="6">
                            <h3>Parâmetros</h3>
                        </v-col>
                        <v-col cols="12" md="6" class="text-right">
                            <v-btn color="primary" @click="carregarDados" :loading="carregarDadosBtnLoading">
                                <v-icon>mdi-refresh</v-icon>
                                Carregar Dados
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="search" label="Pesquisar" prepend-inner-icon="mdi-magnify"
                                single-line variant="outlined" hide-details></v-text-field>
                        </v-col>

                        <v-col cols="12">

                            <v-table>

                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Descrição</th>
                                        <th style="width: 50%;">Valor</th>
                                    </tr>
                                </thead>
                                <tbody v-if="parametroList">
                                    <tr v-for="item in parametroList" :key="item.id">
                                        <td>{{ item.descricao }}
                                            <v-btn v-if="item.texto_ajuda" variant="text" color="secondary" icon
                                                size="small"
                                                @click="dicaControleShow(item.texto_ajuda || '', 'Tipo de dados: ' + item.tipo)">
                                                <v-icon>mdi-help-circle</v-icon>
                                            </v-btn>
                                        </td>
                                        <td>


                                            {{ item.label }} </td>

                                        <td>
                                            <small>({{ item.tipo }})</small><br>
                                            <div v-if="item.tipo == 'number'">
                                                <v-text-field v-model="item.valor" type="number"></v-text-field>
                                            </div>
                                            <div v-else>
                                                <v-text-field v-model="item.valor"></v-text-field>
                                            </div>
                                        </td>

                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                        <v-col cols="12" class="d-flex justify-center">
                            <v-btn color="primary" @click="salvar" :loading="salvarBtnLoading">
                                <v-icon>mdi-content-save</v-icon>
                                Salvar
                            </v-btn>
                            <v-btn color="primary" @click="cancelarAgendamento" :loading="salvarBtnLoading">
                                <v-icon>mdi-content-save</v-icon>
                                Cancelar agendamento
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>

    </v-row>

</template>