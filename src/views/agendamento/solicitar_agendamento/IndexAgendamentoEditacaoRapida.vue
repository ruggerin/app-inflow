<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { maska } from 'maska';
import type { Agendamento } from '@/models/Agendamento';
import type { Fornecedor} from '@/models/Fornecedor';

import { getFornecedorEmpyt, getFornecedorById } from '@/models/Fornecedor';
import type {  StatusAgendamento } from '@/models/StatusAgendamento';
import {  getStatusById, getStatusAgendamentoEmpyt } from '@/models/StatusAgendamento';
import HoraComponent from './HoraComponent.vue';
const emits = defineEmits(['refresh']);




const props = defineProps({
    agendamento: {
        type: Object as () => Agendamento,
        required: true
    },
    permite_aprovar: {
        type: Boolean,
        default: false
    },
})




const statusAgendamento = ref<StatusAgendamento>(getStatusAgendamentoEmpyt());


const agendamentoDetalhe = ref<Agendamento>();

const fornecedorDetalhe = ref<Fornecedor>(getFornecedorEmpyt());



async function getStatus() {

    if (agendamentoDetalhe.value?.status_id) {
        await getStatusById(agendamentoDetalhe.value?.status_id).then((response) => {
            statusAgendamento.value = response;
        });
    }
    else {
        statusAgendamento.value = getStatusAgendamentoEmpyt();
    }

}

async function getFornecedorDetalhe() {

    let fornecedorId = agendamentoDetalhe.value?.fornecedor_id;

    if (fornecedorId) {
        await getFornecedorById(fornecedorId).then((response) => {
            fornecedorDetalhe.value = response;
        });
    }
    else {
        fornecedorDetalhe.value = getFornecedorEmpyt();
    }

}
const loading = ref(false);
onMounted(async () => {

    loading.value = true;
    try {
        agendamentoDetalhe.value = props.agendamento;
        await getStatus();
        await getFornecedorDetalhe();

    } catch (error) {
        console.error('Error fetching details from server:', error);
    } finally {
        loading.value = false;
    }


    //  console.log(agendamentoDetalhe.value);
})



watch(props, async (newProps) => {

    agendamentoDetalhe.value = newProps.agendamento;
    await getFornecedorDetalhe();
    //  console.log(agendamentoDetalhe.value);
})


</script>
<template>
    <!--   <pre>{{agendamento}}</pre> -->

    <v-row v-if="loading" class="d-flex justify-center align-center">
        <div height="250">
            <v-progress-circular vi indeterminate color="primary"></v-progress-circular>
        </div>
    </v-row>
    <v-row v-else v-if="agendamentoDetalhe" class="compact-form">

        <v-col cols="12">
            <h3 class="ma-3">Detalhes do fornecedor</h3>
        </v-col>
        <v-col cols="12" v-if="agendamentoDetalhe">
            <v-text-field density="compact" variant="outlined" v-model="fornecedorDetalhe.nome" label="Fonecedor"
                readonly></v-text-field>
        </v-col>
        <v-col cols="7" v-if="agendamentoDetalhe">
            <v-text-field density="compact" variant="outlined" v-model="fornecedorDetalhe.cnpj_cpf" label="CNPJ/CPF"
                readonly></v-text-field>
        </v-col>
        <v-col cols="5" v-if="agendamentoDetalhe">
            <v-text-field density="compact" variant="outlined" v-model="fornecedorDetalhe.inscricao_estadual"
                label="Ins. Estatual" readonly></v-text-field>
        </v-col>
        <v-col cols="12" md="12">
            <v-divider></v-divider>
        </v-col>
        <v-col cols="12">
            <h3 class="ma-3">Detalhes do agendamento</h3>
        </v-col>
        <v-col cols="5">

            <v-text-field type="date" density="compact" variant="outlined" v-model="agendamentoDetalhe.data_entrega"
                label="Data"></v-text-field>
        </v-col>
        <v-col cols="3">
            <HoraComponent v-model:hora="agendamentoDetalhe.horario_inicio"></HoraComponent>
        </v-col>
        <v-col cols="3">
            <HoraComponent v-model:hora="agendamentoDetalhe.horario_fim"></HoraComponent>
        </v-col>

        <v-col cols="12" md="12">
            <v-divider></v-divider>
        </v-col>
        <v-col cols="12">
            <h3 class="ma-3">Informação da entrega</h3>
        </v-col>
        <v-col cols="12">
            <v-chip v-for="item in agendamentoDetalhe.agendamento_documentos">
                {{ item.pedido_id }}
            </v-chip>
        </v-col>



    </v-row>
</template>
<style scoped>
.compact-form {

    padding: 0 !important;
}

.compact-form>* {
    margin: 1 !important;
    padding: 0 !important;
}
</style>