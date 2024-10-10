<script lang="ts" setup>
import { ref ,defineEmits} from 'vue';
import type { Agendamento } from '@/models/Agendamento';
import moment from 'moment';


const emit = defineEmits(['closeDialog']);

const btnSubmitLoading = ref(false);

const agendamento = ref<Agendamento>({
    id: 0,
    data_agendamento: moment().toDate(),
    data_entrega: new Date(),
    periodo_dia: null,
    horario: null,
    status_id: null,
    tipo_agendamento: null,
    volume_total: null,
    quantidade_total: null,
    fornecedor_id: null,
    pedido_id: null,
    doca_id: null,
});


async function submit() {
    btnSubmitLoading.value = true;
    await setTimeout(() => {
        btnSubmitLoading.value = false;
    }, 2000);
    alert('Erro ao processar operação, código do erro: 500');

}
function dialogClose() {
    emit('closeDialog');
}

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

        <v-card-text>

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
                        <v-text-field v-model="agendamento.horario" variant="outlined" label="Horário"
                            type="time"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="agendamento.status_id" variant="outlined" label="Status ID"
                            type="number"></v-text-field>
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
                        <v-text-field v-model="agendamento.fornecedor_id" variant="outlined" label="Fornecedor ID"
                            type="number"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="agendamento.pedido_id" variant="outlined" label="Pedido ID"
                            type="number"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="agendamento.doca_id" variant="outlined" label="Doca ID"
                            type="number"></v-text-field>
                    </v-col>
                    <v-col cols="12" class="d-flex justify-end">
                        <v-btn type="submit" :loading="btnSubmitLoading" color="primary">Submit</v-btn>
                    </v-col>
                </v-row>
            </form>
        </v-card-text>
    </v-card>
</template>