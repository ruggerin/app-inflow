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
import { getFornecedorNomeById } from '@/models/Fornecedor';
import AgendamentoDetalhe from './AgendamentoDetalhe.vue';

const themeColor = ref('rgb(var(--v-theme-secondary))');

const agendamentoList = ref<Agendamento[]>([]);
const fornecedorList = ref<Fornecedor[]>([]);

const statusList = ref<StatusAgendamento[]>([]);
function getStatus() {
    fetchWrapper.get('cadastros_basicos/status_agendamento').then((response) => {
        statusList.value = response;
        console.log(response)
        return response
    })
}

const btnRefreshLoading = ref(false);  

onMounted(async () => {
    await carregarDados();

    getStatus();
});
async function carregarDados() {

    btnRefreshLoading.value = true; 
    await fetchWrapper.get('agendamento/index', { status_id: 2 }).then((response) => {
        agendamentoList.value = response;
    });
    btnRefreshLoading.value = false;
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
    { text: "Solicitante", value: "usuario_id" },
    { text: "Status", value: "status_id" },
    { text: "Ações", value: "acoes" },


];
const searchTerm = ref('');


function filteredAgendamentos(statusId: number): Item[] {
    return agendamentoList.value.filter(
        (agendamento) =>
            agendamento.status_id == statusId &&
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

</script>
<template>
    <v-dialog v-model="dialogDetalheAgendamento">
        <AgendamentoDetalhe @closeDialog="closeDialogAgendamento" @refreshList="carregarDados()" :agendamento_id="dialogAgendamentoId">
        </AgendamentoDetalhe>
    </v-dialog>
    <v-row>
        <v-col cols="12">
            <h3>Aprovação de agendamento</h3>
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
                            <v-text-field variant="outlined"  prepend-inner-icon="mdi-magnify" v-model="searchTerm">
                            </v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-btn color="primary" :loading="btnRefreshLoading" variant="text" @click="carregarDados">Atualizar</v-btn>
                        </v-col>
                        <v-col cols="12">

                            <EasyDataTable table-class-name="customize-table" :theme-color="themeColor"
                                :headers="headers" :items="filteredAgendamentos(1)">
                                <template #item-fornecedor_id="{ fornecedor_id }">
                                    {{ getFornecedorNomeById(fornecedor_id, fornecedorList) ?? fornecedor_id }}
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