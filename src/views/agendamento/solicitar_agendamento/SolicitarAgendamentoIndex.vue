<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';;
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import 'vue3-easy-data-table/dist/style.css';
import type { Agendamento } from '@/models/Agendamento';
import { Qalendar } from 'qalendar'; // Certifique-se de que o componente Qalendar está instalado e importado corretamente
import 'qalendar/dist/style.css'; // Importar o estilo do Qalendar

import { type Fornecedor, getFornecedorList } from '@/models/Fornecedor';

import UiParentCard from '@/components/shared/UiParentCard.vue';
import Swal from 'sweetalert2';

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


onMounted(async () => {


    //Aplicação de filtro frontent
    await carregarDados()
    await getStatus();
    //console.log(items.value);


});
const items = ref<Agendamento[]>([]);
const fornecedorList = ref<Fornecedor[]>([]);
const statusList = ref<Status[]>([]);

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



function formatDateTime(date: string, time: string): string {
    return `${date} ${time.substring(0, 5)}`; // Pega apenas os primeiros 5 caracteres de time (hh:mm)
}
const calendarEvents = computed(() => {
    return items.value.map(agendamento => ({
        id: agendamento.id.toString(),
        title: `Entrega: ${agendamento.tipo_agendamento}`,
        time: {
            start: formatDateTime(String(agendamento.data_entrega), String(agendamento.horario_inicio)),
            end: formatDateTime(String(agendamento.data_entrega), String(agendamento.horario_fim))
        },
        description: agendamento.fornecedor_id ? getFornecedorNomeById(agendamento.fornecedor_id) : '',
        //color:  "blue" , // Você pode ajustar a cor conforme necessário
        color: agendamento.status_id ? colorQalendar(agendamento.status_id) : 'grey',
        isEditable: true // Defina se o evento é editável ou não

    }));
});

function saveEventChanges() {
    console.log('saveEventChanges')
}
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


// Configurações do calendário
const calendarConfig = ref({
    time: {
        timeStart: '08:00',
        timeEnd: '18:00',
    },

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
const params = ref({
    data_inicial: formatDate(dataInicial),
    data_final: formatDate(dataFinal),
    fornecedor_id: '',
    status_id: '',
});

const toggle = ref(0);
</script>

<template>
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
                                <v-col lg="5" md="6" cols="12">

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
                                        <div class="pa-1">
                                            <v-btn color="success" :to="{ path: '/agendamento/solicitar/novo/editar' }">
                                                <v-icon>mdi-plus</v-icon>
                                                Novo
                                            </v-btn>
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>


            </v-col>

            <v-col cols="12" class="d-flex justify-end">
                <v-btn-toggle v-model="toggle" divided>
                    <v-btn icon="mdi-table"></v-btn>
                    <v-btn icon="mdi-calendar-multiselect"></v-btn>

                </v-btn-toggle>
            </v-col>
            <v-col cols="12" md="12" v-if="toggle == 0">




                <EasyDataTable table-class-name="customize-table" :theme-color="themeColor" :headers="headers"
                    :items="items">
                    <template #item-fornecedor_id="{ fornecedor_id }">
                        {{ getFornecedorNomeById(fornecedor_id) }}
                    </template>
                    <template #item-status_id="{ status_id }">
                        <v-chip :color="getStatusById(status_id).cor_fundo"> {{ getStatusById(status_id).descricao
                            }}</v-chip>
                    </template>

                    <template #item-acoes="{ id }">
                        <v-btn :to="{ path: `/agendamento/solicitar/${id}/editar` }" icon variant="text">
                            <EditIcon size="20" />
                        </v-btn>

                    </template>
                </EasyDataTable>

            </v-col>
            <v-col cols="12" v-else>
                <div class="calendar-container is-light-mode">
                    <Qalendar is-light-mode :events="calendarEvents" :config="calendarConfig">
                        <template #eventDialog="props">
                            <!-- Certifique-se que props.eventDialogData está sendo passado corretamente -->
                            <div v-if="props.eventDialogData">
                                <!-- Título do evento -->
                                <div :style="{ marginBottom: '8px', fontWeight: 'bold' }">Editar Evento: {{
                                    props.eventDialogData.title }}</div>

                                <!-- Input de edição para o título -->
                                <input class="flyout-input" type="text" v-model="props.eventDialogData.title"
                                    :style="{ width: '90%', padding: '8px', marginBottom: '8px' }">

                                <!-- Campo adicional se precisar -->
                                <textarea v-model="props.eventDialogData.description" placeholder="Adicionar descrição"
                                    :style="{ width: '90%', padding: '8px', marginBottom: '8px' }"></textarea>

                                <!-- Botões de ação -->
                                <button @click="saveEventChanges()">
                                    Salvar
                                </button>
                                <button @click="props.closeEventDialog">
                                    Cancelar
                                </button>
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
</style>
