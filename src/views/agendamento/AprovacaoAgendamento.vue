<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';;
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import 'vue3-easy-data-table/dist/style.css';
import type { Agendamento } from '@/models/Agendamento';
import type { Fornecedor } from '@/models/Fornecedor';




import { getStatusList } from '@/models/StatusAgendamento';

import moment from 'moment';

import type { StatusAgendamento } from '@/models/StatusAgendamento';

import { formatDate } from '@/utils/helpers/dateUtils';
import { getFornecedorNomeById, getFornecedorList } from '@/models/Fornecedor';
import AgendamentoDetalhe from './AgendamentoDetalhe.vue';

import type { Usuario } from '@/models/Usuario';
import { getUsuarioList, getUsuariosByIdFromList } from '@/models/Usuario';
import Swal from 'sweetalert2';


const themeColor = ref('rgb(var(--v-theme-secondary))');

const agendamentoList = ref<Agendamento[]>([]);
const fornecedorList = ref<Fornecedor[]>([]);

const usuarioList = ref<Usuario[]>([]);

const statusList = ref<StatusAgendamento[]>([]);
function getStatus() {
    fetchWrapper.get('cadastros_basicos/status_agendamento').then((response) => {
        statusList.value = response;
        console.log(response)
        return response
    })
}
function fornecedorSelectProps(item: any) {
    return {
        title: item.nome,
        subtitle: item.cnpj_cpf,
    };
}



const btnRefreshLoading = ref(false);

onMounted(async () => {
    await carregarDados();

    getStatus();
});
async function carregarDados1() {

    fornecedorList.value = await getFornecedorList();

    usuarioList.value = await getUsuarioList();

    console.log('usuarioList', usuarioList.value);
    btnRefreshLoading.value = true;
    await fetchWrapper.get('agendamento/index', { status_id: 1 }).then((response) => {
        agendamentoList.value = response;
        console.log(response)
    });
    btnRefreshLoading.value = false;


}

const today = new Date();
const dataInicial = new Date(today);
dataInicial.setDate(today.getDate() - 15);
const dataFinal = new Date(today);
dataFinal.setDate(today.getDate() + 15);


const params = ref({
    data_inicial: formatDate(dataInicial),
    data_final: formatDate(dataFinal),
    fornecedor_id: '',
    status_id: 2,
});
const carregarDadosBtnLoading = ref(false);
async function carregarDados() {
    carregarDadosBtnLoading.value = true;
    fornecedorList.value = await getFornecedorList();

    usuarioList.value = await getUsuarioList();
    try {
        var intoParams = { ...params.value };
        intoParams.status_id = 2;
        agendamentoList.value = await fetchWrapper.get(`agendamento/index`, { ...intoParams });
        carregarDadosBtnLoading.value = false;
    }
    catch (e) {
        Swal.fire({
            title: 'Erro ao carregar dados',

            icon: 'error',
            confirmButtonText: 'OK'
        });
        carregarDadosBtnLoading.value = false;
        console.error(e)
    }
}

function getStatusById(id: number): StatusAgendamento {

    const status = statusList.value.find(status_i => status_i.id == id);


    return status ? status : { cor_fundo: 'grey', descricao: id + 'Não localizado', id: 0 };
}
const headers: Header[] = [
    { text: "Protocolos", value: "id", sortable: true },
    { text: "Fornecedor", value: "fornecedor_id", sortable: true },
    { text: "Data", value: "data_entrega", sortable: true },
    { text: "Período", value: "periodo_dia" },
    { text: "Hora Incicio", value: "horario_inicio" },
    { text: "Hora Fim", value: "horario_fim" },
    { text: "Volume Total", value: "volume_total" },
    { text: "Doca", value: "doca_id" },
    { text: "Solicitante", value: "user_id_created" },
    { text: "Status", value: "status_id" },
    { text: "Ações", value: "acoes" },


];
const searchTerm = ref('');


function filteredAgendamentos(): Item[] {
    return agendamentoList.value.filter(
        (agendamento) =>

        (agendamento.id?.toString().includes(searchTerm.value) ||
            agendamento.data_agendamento?.toString().includes(searchTerm.value) ||
            agendamento.fornecedor_id?.toString().toLowerCase().includes(searchTerm.value.toLowerCase()))
    );
}


const dialogDetalheAgendamento = ref(false);
const dialogAgendamentoId = ref(0);
function openDialogAgendamento(id: number) {
    dialogDetalheAgendamento.value = true;
    dialogAgendamentoId.value = id;
}
function closeDialogAgendamento() {
    dialogAgendamentoId.value = 0;
    dialogDetalheAgendamento.value = false;
}

function getUsuarioNome(id: number) {

    let usuario = getUsuariosByIdFromList(id, usuarioList.value);
    console.log(usuario)
    return usuario ? usuario.nome : 'System';
}

</script>
<template>
    <v-dialog v-model="dialogDetalheAgendamento">
        <AgendamentoDetalhe @closeDialog="closeDialogAgendamento" @refreshList="carregarDados()"
            :agendamento_id="dialogAgendamentoId">
        </AgendamentoDetalhe>
    </v-dialog>
    <v-row>
        <v-col cols="12">
            <h3>Aprovar agendamento</h3>
        </v-col>

        <v-col cols="12" class="">


            <v-expansion-panels elevation="0">
                <v-expansion-panel>
                    <v-expansion-panel-title>
                        <v-icon>mdi-filter</v-icon> Filtros de Busca
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <v-row class="mt-5">
                            <v-col lg="2" md="6" cols="12">
                                <v-text-field variant="outlined" type="date" label="Data Inicial"
                                    v-model="params.data_inicial" class="mr-2"></v-text-field>
                            </v-col>
                            <v-col lg="2" md="6" cols="12">
                                <v-text-field variant="outlined" type="date" label="Data Final"
                                    v-model="params.data_final" class="mr-2"></v-text-field>
                            </v-col>
                            <v-col lg="5" md="6" cols="12">

                                <v-select variant="outlined" clearable v-model="params.fornecedor_id"
                                    :items="fornecedorList" item-title="nome" item-value="id"
                                    :item-props="fornecedorSelectProps" label="Fornecedor">
                                </v-select>
                            </v-col>
                           

                            <v-col lg="12">
                                <div class="d-flex justify-end" style="width: 100%;">
                                    <div class="pa-1">
                                        <v-btn color="primary" :loading="carregarDadosBtnLoading"
                                            @click="carregarDados">
                                            <v-icon>mdi-magnify</v-icon>
                                            Buscar
                                        </v-btn>
                                    </div>

                                </div>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>


        </v-col>



        <v-col cols="12">
            <v-card>
                <v-card-title>
                    <v-row>
                        <v-col cols="12" md="6">
                            <h3>Agendamento</h3>
                        </v-col>

                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="8">
                            <v-text-field variant="outlined" prepend-inner-icon="mdi-magnify" v-model="searchTerm">
                            </v-text-field>
                        </v-col>
                       
                        <v-col cols="12">

                            <EasyDataTable :loading="carregarDadosBtnLoading"  table-class-name="customize-table" :theme-color="themeColor"
                                :headers="headers" :items="filteredAgendamentos()">
                                <template #item-fornecedor_id="{ fornecedor_id }">
                                    {{ getFornecedorNomeById(fornecedor_id, fornecedorList) ?? fornecedor_id }}
                                </template>
                                <template #item-user_id_created="{ user_id_created }">
                                    {{ getUsuarioNome(user_id_created) ?? user_id_created }}
                                </template>
                                <template #item-data_entrega="{ data_entrega }">
                                    {{ moment(data_entrega).format('DD/MM/YYYY') }}
                                </template>
                                <template #item-status_id="{ status_id }">
                                    <v-chip :color="getStatusById(status_id).cor_fundo ?? 'error'">
                                        {{ getStatusById(status_id).descricao }}
                                    </v-chip>
                                </template>

                                <template #item-acoes="{ id }">
                                    <v-btn @click="openDialogAgendamento(id)" icon variant="text">
                                        <EditIcon size="20" />
                                    </v-btn>

                                </template>

                            </EasyDataTable>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>

    </v-row>

</template>