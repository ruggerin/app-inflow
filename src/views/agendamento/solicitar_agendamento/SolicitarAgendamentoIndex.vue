<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';;
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import 'vue3-easy-data-table/dist/style.css';
import type { Agendamento } from '@/models/Agendamento';
import { Qalendar } from 'qalendar'; // Certifique-se de que o componente Qalendar está instalado e importado corretamente
import 'qalendar/dist/style.css'; // Importar o estilo do Qalendar

import type { Fornecedor } from '@/models/Fornecedor';
import type { Empresa } from '@/models/Empresa';

import UiParentCard from '@/components/shared/UiParentCard.vue';
import Swal from 'sweetalert2';
import IndexAgendamentoEditacaoRapida from './IndexAgendamentoEditacaoRapida.vue';
import AgendamentoDetalhe from '../AgendamentoDetalhe.vue';

const themeColor = ref('rgb(var(--v-theme-secondary))');


const headers: Header[] = [
    { text: "Protocolos", value: "id" },
    { text: "Fornecedor", value: "fornecedor_id" },
    { text: "Data", value: "data_entrega" },
    { text: "Hora Incicio", value: "horario_inicio" },
    { text: "Hora Fim", value: "horario_fim" },
    { text: "Volume Total", value: "volume_total" },
    { text: "Doca", value: "doca_id" },
    { text: "Solicitante", value: "usuario_id" },
    { text: "Status", value: "status_id" },
    { text: "Ações", value: "acoes" },


];

const horaCalendarioInicio = ref("05:00");
const horaCalendarioFim = ref("19:00");

onMounted(async () => {
    await getHoraCalendarioHorarios();

    await carregarDados()
    await getStatus();

    await getEmpresaUnidade();
    //console.log(items.value);


});
const items = ref<Agendamento[]>([]);
const fornecedorList = ref<Fornecedor[]>([]);
const statusList = ref<Status[]>([]);
const empresaList = ref<Empresa[]>([]);

interface Status {
    id: number;
    descricao: string;
    created_at?: Date;
    updated_at?: Date;
    user_id_created?: number | null;
    user_id_updated?: number | null;
    user_id_deleted?: number | null;
    motivo_alteracao?: string | null;
    ativo?: boolean;
    cor_fundo?: string | null;
}
const emptyAgendamento: Agendamento = {
    id: 0,
    data_agendamento: new Date(),
    data_entrega: new Date(),
    periodo_dia: null,
    status_id: null,
    tipo_agendamento: null,
    volume_total: null,
    quantidade_total: null,
    fornecedor_id: null,
    pedido_id: null,
    doca_id: null,
    created_at: new Date(),
    updated_at: new Date(),
    horario_inicio: null,
    horario_fim: null,
    user_id_created: null,
    user_id_updated: null,
    user_id_deleted: null,
    motivo_alteracao: null,
    aprovacao_usuario_id: null,
    aprovacao_datahora: null,
    obervacao_solicitante: null,
    agendamento_documentos: [],
    agendamento_anexos: []
};

const agendamentoFastEdit = ref<Agendamento>({ ...emptyAgendamento });


function formatDateTime(date: string, time: string): string {
    return `${date} ${time.substring(0, 5)}`; // Pega apenas os primeiros 5 caracteres de time (hh:mm)
}


async function getHoraCalendarioHorarios() {
    await fetchWrapper.get('cadastros_basicos/parametrosgetname/agendamento-hora-inicio').then((response) => {
        horaCalendarioInicio.value = response.valor;
        console.log(response)
        //   return response
    })

    await fetchWrapper.get('cadastros_basicos/parametrosgetname/agendamento-hora-fim').then((response) => {
        horaCalendarioFim.value = response.valor;
        console.log(response)
        // return response
    })


}


const calendarEvents = computed(() => {
    return items.value.map(agendamento => ({
        id: agendamento.id.toString(),
        title: agendamento.fornecedor_id ? getFornecedorNomeById(agendamento.fornecedor_id) : '',
        time: {
            start: formatDateTime(String(agendamento.data_entrega), String(agendamento.horario_inicio)),
            end: formatDateTime(String(agendamento.data_entrega), String(agendamento.horario_fim))
        },
        description: `Entrega: ${agendamento.tipo_agendamento}`,
        //color:  "blue" , // Você pode ajustar a cor conforme necessário
        color: agendamento.status_id ? getStatusById(agendamento.status_id).cor_fundo : 'grey',//agendamento.status_id ? colorQalendar(agendamento.status_id) : 'grey',
        isEditable: true,
        isCustom: true,

    }));
});




function colorQalendar(status_id: number): string {
    switch (status_id) {
        case 1:
            return 'yellow';
        case 2:
            return 'green';
        case 3:
            return 'red';
        default:
            return 'grey';
    }
}

function saveEventChanges(props: any) {
    console.log(props)
    console.log('saveEventChanges')
}

//const calendarEvents = computed(() => {
const calendarConfig = computed(() => {

    return {
        dayBoundaries: {
            start: parseInt(horaCalendarioInicio.value.substring(0, 2)),
            end: parseInt(horaCalendarioFim.value.substring(0, 2)),
        },
        scrollToHour: 5,
        isSmal: true,
        eventDialog: {
            isEditable: false,
            isCustom: true
        },

    }
});

function getFornecedores() {
    fetchWrapper.get('cadastros_basicos/fornecedor').then((response) => {
        fornecedorList.value = response;
        console.log(response)
        return response
    })

}

function getStatus() {
    fetchWrapper.get('cadastros_basicos/status_agendamento').then((response) => {
        statusList.value = response;
        console.log(response)
        return response
    })
}

function getEmpresaUnidade() {
    fetchWrapper.get('cadastros_basicos/empresa').then((response) => {
        empresaList.value = response;
        console.log(response)
        return response
    })
}

function getStatusById(id: number): Status {

    const status = statusList.value.find(status_i => status_i.id == id);


    return status ? status : { cor_fundo: 'grey', descricao: id + 'Não localizado', id: 0 };
}

const carregarDadosBtnLoading = ref(false);

async function carregarDados() {
    carregarDadosBtnLoading.value = true;
    await getFornecedores();
    try {
        var intoParams = { ...params.value };
        items.value = await fetchWrapper.get(`agendamento/index`, { ...intoParams });
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

function getFornecedorNomeById(id: number) {
    const fornecedor = fornecedorList.value.find(fornecedor => fornecedor.id === id);
    return fornecedor ? fornecedor.nome + ' - ' + fornecedor.cnpj_cpf : '';
}

const today = new Date();
const dataInicial = new Date(today);
dataInicial.setDate(today.getDate() - 15);
const dataFinal = new Date(today);
dataFinal.setDate(today.getDate() + 15);

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().length === 1 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
    const day = date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate().toString();
    return `${year}-${month}-${day}`;
}

function fornecedorSelectProps(item: any) {
    return {
        title: item.nome,
        subtitle: item.cnpj_cpf,
    };
}
function empresaSelectProps(item: any) {
    return {
        title: item.nome,
        subtitle: item.cnpj_cpf,
    };
}


function getAgendamentoById(id: number): Agendamento {

    return items.value.find(agendamento => agendamento.id == id) || emptyAgendamento;
}

const params = ref({
    data_inicial: formatDate(dataInicial),
    data_final: formatDate(dataFinal),
    empresa_id: 0,
    fornecedor_id: '',
    status_id: '',
});

function extractTimeFromDate(date: string): string {
    return date.substring(11, 16);
}
function getObjHourString(objetct: any): string {
    return extractTimeFromDate(objetct.start) + '-' + extractTimeFromDate(objetct.end);
}

const dialogAgendamentoId = ref(0);
const dialogAgendamentoShow = ref(false);
function abrirDetalhes(id: number | string) {
    console.log('abrirDetalhes', id)
    dialogAgendamentoShow.value = true;
    dialogAgendamentoId.value = parseInt(id.toString());
}

function closeDialogAgendamento() {
    dialogAgendamentoShow.value = false;
    dialogAgendamentoId.value = 0;
}
const toggle = ref(0);
</script>

<template>
    <v-dialog v-model="dialogAgendamentoShow">
        <AgendamentoDetalhe @closeDialog="closeDialogAgendamento" @refreshList="carregarDados()"
            :agendamento_id="dialogAgendamentoId">
        </AgendamentoDetalhe>
    </v-dialog>
    <v-row>

        <UiParentCard title="Painel de agendamento">
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
                                <v-col lg="4" md="6" cols="12">

                                    <v-select variant="outlined" clearable v-model="params.empresa_id"
                                        :items="empresaList" item-title="nome" item-value="id"
                                        :item-props="empresaSelectProps" label="Unidade entrega">
                                    </v-select>
                                </v-col>
                                <v-col lg="4" md="6" cols="12">

                                    <v-select variant="outlined" clearable v-model="params.fornecedor_id"
                                        :items="fornecedorList" item-title="nome" item-value="id"
                                        :item-props="fornecedorSelectProps" label="Fornecedor">
                                    </v-select>
                                </v-col>

                                <v-col lg="3" md="6" cols="12">
                                    <v-select variant="outlined" clearable v-model="params.status_id"
                                        :items="statusList" item-title="descricao" item-value="id" label="Status">
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
            <v-col cols="12" class=" d-flex">
                <div class="pa-1">
                    <v-btn color="success" :to="{ path: '/agendamento/solicitar/novo/editar' }">
                        <v-icon>mdi-plus</v-icon>
                        Novo agendamento
                    </v-btn>
                </div>
                <!--            <div class="pa-1">
                    <v-btn color="error" :to="{ path: '/agendamento/solicitar/novo/editar' }">
                        <v-icon>mdi-alert-box</v-icon>
                        Agendamento de emergência
                    </v-btn>
                </div> -->
            </v-col>

            <v-col cols="12" class="d-flex justify-end">
                <v-btn-toggle v-model="toggle" divided>

                    <v-btn icon="mdi-calendar-multiselect"></v-btn>
                    <v-btn icon="mdi-table-of-contents"></v-btn>
                </v-btn-toggle>
            </v-col>
            <v-col cols="12" md="12" v-if="toggle == 1">




                <EasyDataTable table-class-name="customize-table" :theme-color="themeColor" :headers="headers"
                    rowsPerPageMessage="Registros por página" rowsOfPageSeparatorMessage="de"
                    emptyMessage="Não há registros disponíveis" :items="items">
                    <template #item-fornecedor_id="{ fornecedor_id }">
                        {{ getFornecedorNomeById(fornecedor_id) }}
                    </template>
                    <template #item-status_id="{ status_id }">
                        <v-chip :color="getStatusById(status_id).cor_fundo ?? 'error'">
                            {{ getStatusById(status_id).descricao }}
                        </v-chip>
                    </template>

                    <template #item-acoes="{ id }">
                        <v-btn @click="abrirDetalhes(id)" icon variant="text">
                            <EditIcon size="20" />
                        </v-btn>

                    </template>
                </EasyDataTable>

            </v-col>
            <v-col cols="12" v-else>
                <div class="calendar-container is-light-mode">
                    <Qalendar is-light-mode :events="calendarEvents" :config="calendarConfig">
                        <template #weekDayEvent="eventProps">
                            <div class="pa-2" @click="abrirDetalhes(eventProps.eventData.id)"
                                :style="{ backgroundColor: eventProps.eventData.color, color: '#fff', width: '100%', height: '100%', overflow: 'hidden' }">
                                <v-row>
                                    <v-col cols="12">

                                        <span> <v-icon>mdi-clock</v-icon> {{ getObjHourString(eventProps.eventData.time)
                                            }}</span>
                                    </v-col>
                                    <v-col cols="12">
                                        <span>{{ eventProps.eventData.description }}</span>
                                    </v-col>
                                </v-row>
                            </div>
                        </template>
                        <template #monthEvent="eventProps">
                            <div class="pa-2" @click="abrirDetalhes(eventProps.eventData.id)"
                                :style="{ backgroundColor: eventProps.eventData.color, color: '#fff', width: '100%', height: '100%', overflow: 'hidden' }">
                                <v-row>
                                    <v-col cols="12">

                                        <span> <v-icon>mdi-clock</v-icon> {{ getObjHourString(eventProps.eventData.time)
                                            }} {{ eventProps.eventData.description }}</span>
                                    </v-col>

                                </v-row>
                            </div>
                        </template>

                    </Qalendar>
                </div>


            </v-col>

        </UiParentCard>

    </v-row>
</template>
<style>
@import "qalendar/dist/style.css";

.calendar-container {
    width: 100%;
    max-width: 100%;
    height: 800px;
    max-height: calc(100vh - 20px);
}

.event-flyout {
    width: 90vh !important;
    top: 50% !important;
    left: 50% !important;
    max-height: 80% !important;
    transform: translate(-50%, -50%) !important;
    z-index: 9999 !important;
    overflow-y: auto !important;
    /* Adiciona scroll vertical */
}
</style>
