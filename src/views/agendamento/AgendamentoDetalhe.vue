<script lang="ts" setup>
import { ref, defineEmits, onMounted } from 'vue';
import type { Agendamento } from '@/models/Agendamento';
import { getAgendamentoEmpyt } from '@/models/Agendamento';
import moment from 'moment';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

import type { Docas } from '@/models/Docas';

import type { StatusAgendamento } from '@/models/StatusAgendamento';

import { getStatusList } from '@/models/StatusAgendamento';
import { getDocasList } from '@/models/Docas';

const props = defineProps<{
    agendamento_id: number
}>();
const emit = defineEmits(['closeDialog']);

const btnSubmitLoading = ref(false);

const agendamento = ref<Agendamento>();

const docasList = ref<Docas[]>();
const statusList = ref<StatusAgendamento[]>();


async function submit() {
    btnSubmitLoading.value = true;
    await setTimeout(() => {
        btnSubmitLoading.value = false;
    }, 2000);

}

function dialogClose() {
    emit('closeDialog');
}

function getAgendamento(agendamento_id: number) {
    fetchWrapper.get('agendamento/show/' + agendamento_id).then((response) => {
        console.log(response);
        agendamento.value = response;
        statusInicial.value = response.status_id ?? 0;

    });

}

onMounted(async () => {
    if (props.agendamento_id && props.agendamento_id > 0) {
        await getAgendamento(props.agendamento_id);
    }

    docasList.value = await getDocasList();
    statusList.value = await getStatusList();

});


const statusInicial = ref(0);
const statusOptions = [
    { value: 2, label: 'Aprovado' },
    { value: 3, label: 'Rejeitado' }
];
</script>

<template>
    <v-card>
        <v-toolbar color="primary" dark>
            <v-toolbar-title>Agendamento</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn :loading="btnSubmitLoading" @click="submit()">Salvar</v-btn>
            <v-btn size="small" color="white" icon @click="dialogClose()">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>


        <v-card-text v-if="statusInicial == 1 && agendamento">

            <v-row>
                <v-col cols="12">
                    <v-sheet color="#ffeaa7" class="pa-3">
                        <span>Agendamento econtra-se pendente de aprovação</span>
                    </v-sheet>
                </v-col>

                <v-col cols="12" md="6">
                    <v-radio-group v-model="agendamento.status_id" label="Status">
                        <v-radio v-for="option in statusOptions" :key="option.value" :label="option.label"
                            :value="option.value"></v-radio>

                    </v-radio-group>
                </v-col>
                <v-col md="6" v-if="agendamento.status_id && agendamento.status_id == 3">
                    <v-text-field variant="outlined" v-model="agendamento.rejeicao_motivo"
                        label="Motivo da Rejeição"></v-text-field>
                </v-col>
            </v-row>




            <v-divider>

            </v-divider>

        </v-card-text>


        <v-card-text v-if="agendamento">
            <form @submit.prevent="submit">
                <v-row>
                    <v-col cols="2">
                        <v-text-field v-model="agendamento.id" variant="outlined" label="Código"
                            readonly></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="agendamento.data_agendamento" variant="outlined"
                            label="Data de Agendamento" type="datetime-local"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="agendamento.data_entrega" variant="outlined" label="Data de Entrega"
                            type="date" required></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-select v-model="agendamento.periodo_dia" :items="['MANHÃ', 'TARDE', 'NOITE']"
                            variant="outlined" label="Período do Dia"></v-select>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="agendamento.horario_inicio" variant="outlined" label="Horário"
                            type="time"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-select v-model="agendamento.status_id" disabled :items="statusList" title="descricao"
                            value="id" text="descricao"></v-select>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="agendamento.tipo_agendamento" variant="outlined"
                            label="Tipo de Agendamento"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="agendamento.volume_total" variant="outlined" label="Volume Total"
                            type="number" step="0.01"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="agendamento.quantidade_total" variant="outlined" label="Quantidade Total"
                            type="number"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field disabled v-model="agendamento.fornecedor_id" variant="outlined"
                            label="Fornecedor ID" type="number"></v-text-field>
                    </v-col>

                    <v-col cols="4">
                        <v-text-field v-model="agendamento.doca_id" variant="outlined" label="Doca ID"
                            type="number"></v-text-field>
                    </v-col>
                    <!-- <v-col cols="12" class="d-flex justify-end">
                        <v-btn type="submit" :loading="btnSubmitLoading" color="primary">Submit</v-btn>
                    </v-col> -->
                </v-row>
            </form>
            <v-col cols="12">
                <v-card elevation="0">
                    <v-card-title>
                        <span>Informações do transporte</span>
                    </v-card-title>
                    <v-card-text>
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
</template>