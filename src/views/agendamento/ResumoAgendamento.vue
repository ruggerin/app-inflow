<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { type Agendamento } from '@/models/Agendamento';
import { fetchWrapper } from "@/utils/helpers/fetch-wrapper";
import { type Fornecedor, getFornecedorById, getFornecedorEmpyt } from '@/models/Fornecedor';
import PrintTextComponent from './PrintTextComponent.vue';
import moment from 'moment';

const props = defineProps({
    agendamento: {
        type: Object as () => Agendamento,
        required: true
    }
});

const emits = defineEmits(['close']);

function closeDialog() {
  emits('close');
}
const forcedorDetalhe = ref<Fornecedor>(getFornecedorEmpyt());

onMounted(async () => {
    if (props.agendamento.fornecedor_id) {
        forcedorDetalhe.value = await getFornecedorById(props.agendamento.fornecedor_id);
    }

});
 


function totalVolumes() {
    let total = 0;
    for (let item_doc of props.agendamento.agendamento_documentos) {
        if (item_doc.volumes)
            total += item_doc.volumes;
    }
    return total;
}
const confirmarAgendamentoLoading = ref(false);

function confirmarAgendamento() {
    confirmarAgendamentoLoading.value = true;

    let form  = props.agendamento;
    form.volume_total = totalVolumes();
    fetchWrapper.post('agendamento/solicitar',props.agendamento)
        .then(() => {
            confirmarAgendamentoLoading.value = false;
            closeDialog();
        })
        .catch(() => {
            confirmarAgendamentoLoading.value = false;
        });
}


const confirmacaoInfo = ref(false);
</script>
<template>
    <v-card class="ma-10">
        <v-toolbar color="primary" dark>
            <v-toolbar-title>Resumo do Agendamento</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="closeDialog">
                <v-icon>mdi-close</v-icon>
                </v-btn>
        </v-toolbar>
        <!--   <pre>{{ agendamento }}</pre> -->
        <v-card-text>
            <v-row class="scrollable-row">
                <v-col cols="12">
                    <h4>DETALHES DO FORNECEDOR</h4>
                </v-col>


                <v-col cols="8">
                    <PrintTextComponent label="RAZÃO SOCIAL" :text="forcedorDetalhe.nome" />
                </v-col>
                <v-col cols="4">
                    <PrintTextComponent label="CNPJ" :text="forcedorDetalhe.cnpj_cpf ?? ''" />

                </v-col>
                <!--       {{ forcedorDetalhe.endereco }} {{ forcedorDetalhe.numero }} {{
                        forcedorDetalhe.bairro }} -->
                <v-col cols="6">
                    <PrintTextComponent label="ENDEREÇO" :text="forcedorDetalhe.endereco ?? ''" />

                </v-col>
                <v-col cols="2">
                    <PrintTextComponent label="NÚMERO" :text="forcedorDetalhe.numero ?? ''" />
                </v-col>
                <v-col cols="4">
                    <PrintTextComponent label="BAIRRO" :text="forcedorDetalhe.bairro ?? ''" />
                </v-col>


                <v-col cols="12">
                    <v-divider></v-divider>
                </v-col>
                <v-col cols="12">
                    <h4>DETALHES DO AGENDAMENTO</h4>
                </v-col>
                <v-col cols="3">
                    <PrintTextComponent :aligment="'center'" label="DATA" :text="moment(agendamento.data_entrega).format('DD/MM/YYYY')" />
                </v-col>
                <v-col cols="3">
                    <PrintTextComponent :aligment="'center'" label="HORA INICIAL" :text="(agendamento.horario_inicio)" />
                </v-col>
                <v-col cols="3">
                    <PrintTextComponent :aligment="'center'" label="HORA FINAL" :text="(agendamento.horario_fim)" />
                </v-col>
                <v-col cols="3">
                    <PrintTextComponent :aligment="'center'" label="TOTAL DE VOLUMES" :text="totalVolumes().toString()" />
                </v-col>
                <v-col cols="12">
                    <v-divider></v-divider>
                </v-col>
                <v-col cols="12">
                    <h4>DOCUMENTOS DE ENTREGA(PEDIDOS/NFS)</h4>
                </v-col>
                <v-col cols="12">

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
                </v-col>
                <v-col cols="12">
                    <v-divider></v-divider>
                </v-col>
                <v-col cols="12">
                    <span>O agendamento passa por um fluxo de aprovação, além disso, está sujeito a alteração</span>
                </v-col>
                <v-checkbox v-model="confirmacaoInfo"
                    label="Declaro que as informações acima estão corretas e que estou ciente da política de agendamento"></v-checkbox>


                <v-col cols="12 d-flex justify-center" >
                    
                    <v-btn color="primary" @click="confirmarAgendamento" :disabled="!confirmacaoInfo">Confirmar
                        Agendamento</v-btn>
                </v-col>

            </v-row>
        </v-card-text>

    </v-card>


</template>
<style scoped>
.scrollable-row {
    max-height: 400px;
    /* Defina a altura máxima desejada */
    overflow-y: auto;
    /* Permite rolagem vertical */
}
</style>