<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';;
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import 'vue3-easy-data-table/dist/style.css';
import type { Agendamento } from '@/models/Agendamento';

import { formatDate } from '@/utils/helpers/dateUtils';

import type { Fornecedor } from '@/models/Fornecedor';
import { getFornecedorList } from '@/models/Fornecedor';
import type { StatusAgendamento } from '@/models/StatusAgendamento';
import Swal from 'sweetalert2';
import { getFornecedorEmpyt, getFornecedorById, getFornecedorNomeById } from '@/models/Fornecedor';

import type { Docas } from '@/models/Docas';
import { getDocasList } from '@/models/Docas';

import * as _ from 'lodash'; // Importa todas as funções de lodash
import * as ss from 'simple-statistics'; // Importa todas as funções de simple-statistics
import AgendamentoDetalhe from '../AgendamentoDetalhe.vue';



const agendamentos = ref<Agendamento[]>([]);
const fornecedorList = ref<Fornecedor[]>([]);
const statusList = ref<StatusAgendamento[]>([]);
const docasList = ref<Docas[]>([]);
const carregarDadosBtnLoading = ref(false);
const themeColor = ref('rgb(var(--v-theme-secondary))');
function getStatus() {
    fetchWrapper.get('cadastros_basicos/status_agendamento').then((response) => {
        statusList.value = response;
        console.log(response)
        return response
    })
}


const activeTab = ref(1);
const search = ref('');


function countAgendamentosForStatus(statusId: number): number {
    return agendamentos.value.filter(
        (agendamento) =>
            agendamento.status_id == statusId
    ).length;
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
function filteredAgendamentos(statusId: number): Item[] {
    return agendamentos.value.filter(
        (agendamento) =>
            agendamento.status_id == statusId
    );
}

function getStatusById(id: number): StatusAgendamento {

    const status = statusList.value.find(status_i => status_i.id == id);


    return status ? status : { cor_fundo: 'grey', descricao: id + 'Não localizado', id: 0 };
}

async function carregarDados() {
    carregarDadosBtnLoading.value = true;
    fornecedorList.value = await getFornecedorList();
    try {
        var intoParams = { ...params.value };
        agendamentos.value = await fetchWrapper.get(`agendamento/index`, { ...intoParams });
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
const today = new Date();
const dataInicial = new Date(today);
dataInicial.setDate(today.getDate() - 7);
const dataFinal = new Date(today);
dataFinal.setDate(today.getDate() + 14);

const params = ref({
    data_inicial: formatDate(dataInicial),
    data_final: formatDate(dataFinal),
    fornecedor_id: '',
    status_id: '',
});

function fornecedorSelectProps(item: any) {
    return {
        title: item.nome,
        subtitle: item.cnpj_cpf,
    };
}



function resumPorStatus() {
    return _.chain(agendamentos.value)
        .groupBy('status_id')
        .map((agendamentos, status_id) => ({
            status_id: Number(status_id),
            descricao: getStatusById(Number(status_id)).descricao,
            color: getStatusById(Number(status_id)).cor_fundo,
            total: agendamentos.length
        }))
        .value();
}

function resumoVolumesDias() {
    return _.chain(agendamentos.value)
        .groupBy('data_entrega')
        .map((agendamentos, data_entrega) => ({
            data_entrega,
            total: agendamentos.length
        }))
        .value();
}

const lineChartVolumesDias = computed(() => {
    return {
        series: [
            {
                name: 'Volumes',
                data: resumoVolumesDias().map((item) => item.total)
            }
        ]
    }
});


const chartOptionsStatus = computed(() => {
    return {
        chart: {
            type: 'pie',
            height: 300,
            fontFamily: `inherit`,
            foreColor: '#a1aab2',
            sparkline: {
                enabled: true
            }
        },
        colors: resumPorStatus().map((item) => item.color),
        labels: resumPorStatus().map((item) => item.descricao),
        legend: {
            show: true,
            position: 'bottom',
            fontFamily: 'inherit',
            labels: {
                colors: 'inherit'
            }
        },
        dataLabels: {
            enabled: true,
            dropShadow: {
                enabled: false
            }
        },
        theme: {
            monochrome: {
                enabled: false
            }
        }
    };
});

const chartOptionsVolumesDias = computed(() => {
    return {
        chart: {
            type: 'bar',
            height: 350,
            fontFamily: `inherit`,
            foreColor: '#a1aab2',
            stacked: true
        },
        colors: ['#5c1ac3'],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }
        ],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%'
            }
        },
        xaxis: {
            type: 'category',
            categories: resumoVolumesDias().map((item) => item.data_entrega),
        },
        legend: {
            show: true,
            fontFamily: `'Roboto', sans-serif`,
            position: 'bottom',
            offsetX: 20,
            labels: {
                useSeriesColors: false
            },
            markers: {
                width: 16,
                height: 16,
                radius: 5
            },
            itemMargin: {
                horizontal: 15,
                vertical: 8
            }
        },
        fill: {
            type: 'solid'
        },
        dataLabels: {
            enabled: true
        },
        grid: {
            show: true
        },
        tooltip: {
            theme: 'dark'
        }
    };
});

const lineChartStatus = computed(() => {
    return {
        series: resumPorStatus().map((item) => item.total)
    }
});

onMounted(async () => {
    await getStatus();

    docasList.value = await getDocasList();
    await carregarDados();
})


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
        <AgendamentoDetalhe @closeDialog="closeDialogAgendamento" :agendamento_id="dialogAgendamentoId"></AgendamentoDetalhe>
    </v-dialog>
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-text>
                    <h3>Dashboard Agendamento</h3>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12">
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
                            <v-col lg="3" md="6" cols="12">
                                <v-select variant="outlined" clearable v-model="params.status_id" :items="statusList"
                                    item-title="descricao" item-value="id" label="Status">
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


        <v-col cols="12" md="6">
            <v-card elevation="0">
                <v-card-title>
                    <small class="headline">Tickets por Status de Agendamento</small>
                </v-card-title>
                <v-card-text>
                    <div class="mt-4">
                        <apexchart :options="chartOptionsStatus" type="pie" height="300"
                            :series="lineChartStatus.series">
                        </apexchart>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>

        <v-col lg="6" cols="12">
            <v-card elevation="0">
                <v-card-title>
                    <small class="headline">Total de volumes por dia</small>
                </v-card-title>
                <v-card-text>
                    <div class="mt-4">
                        <apexchart type="bar" height="200" :options="chartOptionsVolumesDias"
                            :series="lineChartVolumesDias.series">
                        </apexchart>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col lg="6" cols="12" v-for="doca in docasList">
            <v-card elevation="0">
                <v-card-title>
                    <small class="headline">Próximos recebimentos #{{ doca.nome }}</small>
                </v-card-title>
                <v-card-text>

                    
                </v-card-text>
            </v-card>
        </v-col>


        <v-col cols="12">
            <v-card>
                <v-card-title>
                    Agendamentos por status
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-tabs v-model="activeTab">
                            <v-tab v-for="status in statusList" :value="status.id" :key="status.id">
                                {{ status.descricao }} ({{ countAgendamentosForStatus(status.id) }})
                            </v-tab>
                        </v-tabs>
                        <v-window v-model="activeTab">
                            <v-window-item v-for="status in statusList" :key="status.id" :value="status.id">
                                <v-card flat>
                                    <v-card-text>
                                        <EasyDataTable table-class-name="customize-table" :theme-color="themeColor"
                                            :headers="headers" :items="filteredAgendamentos(status.id)">
                                            <template #item-fornecedor_id="{ fornecedor_id }">
                                                {{ getFornecedorNomeById(fornecedor_id, fornecedorList) }}
                                            </template>
                                            <template #item-status_id="{ status_id }">
                                                <v-chip :color="getStatusById(status_id).cor_fundo ?? 'error'">
                                                    {{ getStatusById(status_id).descricao }}
                                                </v-chip>
                                            </template>

                                            <template #item-acoes="{ id }">
                                                <v-btn @click="openDialogAgendamento(id)" icon
                                                    variant="text">
                                                    <EditIcon size="20" />
                                                </v-btn>

                                            </template>
                                        </EasyDataTable>
                                    </v-card-text>
                                </v-card>
                            </v-window-item>
                        </v-window>

                    </v-container>
                </v-card-text>
            </v-card>
        </v-col>


    </v-row>



</template>