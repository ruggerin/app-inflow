<script lang="ts" setup>
import { ref, defineEmits, onMounted, watch } from 'vue';
import type { Agendamento } from '@/models/Agendamento';
import { getAgendamentoEmpyt } from '@/models/Agendamento';
import moment from 'moment';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

import type { Docas } from '@/models/Docas';

import type { StatusAgendamento } from '@/models/StatusAgendamento';
import { useAuthStore } from '@/stores/auth';

import { getStatusList, getStatusFromListById, getStatusAgendamentoEmpyt } from '@/models/StatusAgendamento';

import { getDocasList } from '@/models/Docas';
import Swal from 'sweetalert2';
import SelectComponent from '@/components/cadastro_generico/SelectComponent.vue';

import type { Transportadora } from '@/models/Transportadora';

import { getUserById } from '@/models/Usuario';

import type { Usuario } from '@/models/Usuario';
import type { Veiculo } from '@/models/Veiculo';
import type { Motorista } from '@/models/Motorista';



const props = defineProps<{
    agendamento_id: number
}>();
const emit = defineEmits(['closeDialog', 'refreshList']);


const veiculoInfo = ref<Veiculo>({
    id: 0,
    nome: '',
    capacidade_carga: 0,
    tipo: '',
    cubagem: 0,
    quantidade_paletes: 0,
    transportadora_id: 0,
    ativo: true,
    created_at: null,
    updated_at: null,
    user_id_created: null,
    user_id_updated: null,
    user_id_deleted: null,
    motivo_alteracao: null,
    placa: null
});

const transportadoraInfo = ref<Transportadora>({
    id: 0,
    nome: '',
    cnpj: '',
    ie: '',
    endereco: '',
    ativo: true,
    created_at: new Date(),
    updated_at: new Date(),
    user_id_created: null,
    user_id_updated: null,
    user_id_deleted: null,
    motivo_alteracao: null
});

const btnSubmitLoading = ref(false);

const usuario = ref<Usuario>();
const agendamento = ref<Agendamento>();

const statusAgendamentoInicial = ref<StatusAgendamento>(getStatusAgendamentoEmpyt());

const docasList = ref<Docas[]>();
const statusList = ref<StatusAgendamento[]>();


const motoristaInfo = ref<Motorista>({
    id: 0,
    nome: '',
    rg: null,
    cpf: null,
    cnh: null,
    telefone: null,
    transportadora_id: null,
    created_at: null,
    updated_at: null,
    ativo: true
});

const permissaoAprovar = ref<boolean>(false);

const permisaoAlterar = ref<boolean>(false);
const permissaoCancelar = ref<boolean>(false);
async function submit() {
    btnSubmitLoading.value = true;
    await setTimeout(() => {
        btnSubmitLoading.value = false;
    }, 2000);

}

function dialogClose() {
    emit('closeDialog');
}

async function getVeiculoInfo() {


    if (agendamento.value?.veiculo_id && agendamento.value?.veiculo_id > 0) {
        fetchWrapper.get('cadastros_basicos/veiculo/' + agendamento.value?.veiculo_id).then((response) => {
            veiculoInfo.value = response;
        });
    }

}

async function getMotoristaInfo() {
    if (agendamento.value?.motorista_id && agendamento.value?.motorista_id > 0) {
        fetchWrapper.get('cadastros_basicos/motorista/' + agendamento.value?.motorista_id).then((response) => {
            motoristaInfo.value = response;
        });
    }
}

async function getTransportadoraInfo() {
    if (agendamento.value?.transportador_id && agendamento.value?.transportador_id > 0) {
        fetchWrapper.get('cadastros_basicos/transportadora/' + agendamento.value?.transportador_id).then((response) => {
            transportadoraInfo.value = response;
        });
    }
}
function refreshList() {
    emit('refreshList');
}
function getAgendamento(agendamento_id: number) {
    fetchWrapper.get('agendamento/show/' + agendamento_id).then((response) => {
        console.log(response);
        agendamento.value = response;
        statusInicial.value = response.status_id ?? 0;
    });
}


function permiteEditar() {
    return permisaoAlterar.value && agendamento.value && !(agendamento.value.status_id == 1 || agendamento.value.status_id != 4);
}

watch(() => agendamento.value?.veiculo_id, async (newVal, oldVal) => {
    if (newVal !== oldVal) {
        await getVeiculoInfo();
    }
});

watch(() => agendamento.value?.motorista_id, async (newVal, oldVal) => {
    if (newVal !== oldVal) {
        await getMotoristaInfo();
    }
});

watch(() => agendamento.value?.transportador_id, async (newVal, oldVal) => {
    if (newVal !== oldVal) {
        await getTransportadoraInfo();
    }
});


onMounted(async () => {
    if (props.agendamento_id && props.agendamento_id > 0) {
        await getAgendamento(props.agendamento_id);
    }
    permissaoAprovar.value = await useAuthStore().hasPermission('agendamento-aprovar', "aprovar-agendamento");

    console.log(permissaoAprovar.value)
    permisaoAlterar.value = await useAuthStore().hasPermission('movimentacao-materiais', "agendamento_alterar");
    permissaoCancelar.value = await useAuthStore().hasPermission('movimentacao-materiais', "agendamento_cancelar");

    docasList.value = await getDocasList();
    statusList.value = await getStatusList();

    if (agendamento.value &&
        agendamento.value.status_id) {
        statusAgendamentoInicial.value = await getStatusFromListById(agendamento.value.status_id, statusList.value);
    }

    console.log(agendamento.value?.user_id_created);
    if (agendamento.value?.user_id_created) {
        usuario.value = await getUserById(agendamento.value?.user_id_created);

        console.log(usuario.value)
    }
    getVeiculoInfo();
    getTransportadoraInfo()
});





const statusInicial = ref(0);
const statusOptions = [
    { value: 2, label: 'Aprovado' },
    { value: 3, label: 'Rejeitado' }
];

const prioridadeList = ['NORMAL', 'EMERGENCIAL'];

const submeterAprovacaoLoading = ref(false);

function confirmarEntrega() {

    let agendamento_id = props.agendamento_id;

    submeterAprovacaoLoading.value = true;
    fetchWrapper.put('agendamento/confirmarentrega/' + agendamento_id,
        {

            realizado_datahorainicio: agendamento.value?.realizado_datahorainicio,
            realizado_datahorafim: agendamento.value?.realizado_datahorafim
        }
    ).then((response) => {

        console.log(response);
        Swal.fire({
            title: 'Sucesso',
            customClass: {
                container: 'my-swal',
            },
            text: 'Operação realizada com sucesso!',
            icon: 'success'
        }).then(async () => {
            await getAgendamento(agendamento_id)
            await refreshList();
        });
        submeterAprovacaoLoading.value = false;
        agendamento.value = response;
        statusInicial.value = response.status_id ?? 0;

    }).catch((error) => {
        console.log(error);
        submeterAprovacaoLoading.value = false;
        Swal.fire({
            title: 'Erro',
            text: 'Ocorreu um erro ao tentar realizar a operação',
            icon: 'error',
            customClass: {
                container: 'my-swal',
            },

        });

    });
}
const today = new Date().toISOString().split('T')[0]; // Obtém a data atual no formato YYYY-MM-DD
</script>

<template>
    <v-card v-if="agendamento && statusAgendamentoInicial.id != 0">
        <v-toolbar color="primary" dark>
            <v-toolbar-title>Agendamento #{{ agendamento.id }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <v-sheet height="80%" class="pa-3" elevation="0" rounded :color="statusAgendamentoInicial.cor_fundo">
                <span style="color:white; font-size: medium;"> {{ statusAgendamentoInicial.descricao }}</span></v-sheet> -->

            <v-chip v-if="statusAgendamentoInicial.cor_fundo != null" elevated variant="flat"
                :color="statusAgendamentoInicial.cor_fundo">Status:
                {{ statusAgendamentoInicial.descricao }}</v-chip>



            <v-btn size="small" color="white" icon @click="dialogClose()">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
            <v-card class="" variant="outlined">
                <v-card-title>
                    <span>Confirmar entrega</span>
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="agendamento.realizado_datahorainicio" variant="outlined"
                                label="Data de Entrega" type="datetime-local"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="agendamento.realizado_datahorafim" variant="outlined"
                                label="Data de Entrega" type="datetime-local"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                        <v-textarea v-model="agendamento.realizado_observacao" label="Observação da entrega" outlined></v-textarea>
                        </v-col>
                        <v-col cols="12">
                            <v-btn color="primary" @click="confirmarEntrega">Confirmar Entrega</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>

            </v-card>

        </v-card-text>
        <v-card-text v-if="agendamento">
            <form @submit.prevent="submit">
                <v-row>
                    <v-col cols="2">
                        <v-text-field disabled v-model="agendamento.id" variant="outlined"
                            label="Código"></v-text-field>
                    </v-col>
                    <v-col cols="4" xxl="2" xl="2" lg="2" md="3" sm="12" xsm="12">
                        <v-text-field disabled v-model="agendamento.data_agendamento" variant="outlined" :min="today"
                            label="Data de Agendamento" type="datetime-local"></v-text-field>
                    </v-col>
                    <v-col cols="4" v-if="usuario">
                        <v-text-field disabled v-model="usuario.nome" variant="outlined"
                            label="Usuário Solicitante"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field readonly min v-model="agendamento.data_entrega" variant="outlined"
                            label="Data de Entrega" type="date" required></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-select readonly v-model="agendamento.periodo_dia" :items="['MANHÃ', 'TARDE', 'NOITE']"
                            variant="outlined" label="Período do Dia"></v-select>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field readonly v-model="agendamento.horario_inicio" variant="outlined" label="Inicial"
                            type="time"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="agendamento.horario_fim" variant="outlined" label="Final"
                            type="time"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <!--  <v-text-field v-model="agendamento.tipo_agendamento" variant="outlined"
                            label="Tipo de Agendamento"></v-text-field> -->
                        <v-select readonly label="Prioridade" v-model="agendamento.tipo_agendamento" variant="outlined"
                            :items="prioridadeList"></v-select>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field readonly v-model="agendamento.volume_total" variant="outlined"
                            label="Volume Total" type="number" step="0.01"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field v-model="agendamento.quantidade_total" variant="outlined" label="Quantidade Total"
                            type="number"></v-text-field>
                    </v-col>

                    <v-col cols="4">

                        <SelectComponent v-model:itemId="agendamento.fornecedor_id" controller_name="fornecedor"
                            label="Fornecedor"></SelectComponent>
                    </v-col>
                    <v-col cols="4">

                        <SelectComponent readonly v-model:itemId="agendamento.empresa_id" label="Empresa entrega"
                            :controller_name="'empresa'">
                        </SelectComponent>

                    </v-col>

                    <v-col cols="4">

                        <SelectComponent readonly v-model:itemId="agendamento.doca_id" label="Doca"
                            :controller_name="'docas'">
                        </SelectComponent>

                    </v-col>

                </v-row>
            </form>



            <v-col cols="12">
                <v-card elevation="0">
                    <v-card-title>
                        <span>Informações da Transportadora</span>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="4">
                                <SelectComponent readonly v-model:itemId="agendamento.transportador_id"
                                    controller_name="transportadora" label="Transportadora"></SelectComponent>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field readonly v-model="transportadoraInfo.nome" variant="outlined"
                                    label="Razão social"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field readonly v-model="transportadoraInfo.cnpj" variant="outlined"
                                    label="Cnpj"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field readonly v-model="transportadoraInfo.endereco" variant="outlined"
                                    label="Endereco"></v-text-field>
                            </v-col>

                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>



            <v-col cols="12">
                <v-card elevation="0">
                    <v-card-title>
                        <span>Informações do Veículo</span>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="4">
                                <SelectComponent readonly v-model:itemId="agendamento.veiculo_id"
                                    controller_name="veiculo" label="Veiculo"></SelectComponent>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field readonly v-model="veiculoInfo.placa" variant="outlined"
                                    label="Placa"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field readonly v-model="veiculoInfo.tipo" variant="outlined"
                                    label="Tipo"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field readonly v-model="veiculoInfo.capacidade_carga" variant="outlined"
                                    label="Capacidade Carga(kg)"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field readonly v-model="veiculoInfo.quantidade_paletes" variant="outlined"
                                    label="Capacidade Palets"></v-text-field>
                            </v-col>


                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card elevation="0">
                    <v-card-title>
                        <span>Motorista</span>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="4">
                                <SelectComponent readonly v-model:itemId="agendamento.motorista_id"
                                    controller_name="motorista" label="Motorista"></SelectComponent>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field readonly v-model="motoristaInfo.nome" variant="outlined"
                                    label="Nome"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field readonly v-model="motoristaInfo.cnh" variant="outlined"
                                    label="CNH"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field readonly v-model="motoristaInfo.cpf" variant="outlined"
                                    v-maska="'###.###.###-##'" label="CPF"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field readonly v-model="motoristaInfo.rg" variant="outlined"
                                    label="RG"></v-text-field>
                            </v-col>


                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-row>
                <v-col cols="12">
                    <v-card elevation="0">
                        <v-card-title>
                            <span>Itens do Agendamento</span>
                        </v-card-title>
                        <v-card-text>
                            <v-table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Tipo Doc.</th>
                                        <th>Num. Pedido</th>
                                        <th>Num. Nota</th>
                                        <th>Série</th>
                                        <th>Chave</th>
                                        <th>Volumes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item_doc in agendamento.agendamento_documentos">
                                        <td></td>
                                        <td>{{ item_doc.tipo_documento }}</td>
                                        <td>{{ item_doc.pedido_id }}</td>
                                        <td>{{ item_doc.numnota }}</td>
                                        <td>{{ item_doc.serie }}</td>
                                        <td>{{ item_doc.chave_nf }}</td>
                                    </tr>

                                </tbody>
                            </v-table>

                        </v-card-text>

                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>

    </v-card>
    <v-card v-else>
        <v-card-text>
            <v-row>
                <v-col cols="12" class="d-flex justify-center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<style>
.my-swal {
    position: fixed !important;
    z-index: 9999999 !important;
}
</style>