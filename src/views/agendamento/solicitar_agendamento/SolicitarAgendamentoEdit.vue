<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import Swal from 'sweetalert2';
import moment from 'moment';
import type { Agendamento } from '@/models/Agendamento';
import type { Fornecedor } from '@/models/Fornecedor';

import { getFornecedorList } from '@/models/Fornecedor';

import type { AgendamentoDocumento } from '@/models/AgendamentoDocumento';

import 'v-calendar/dist/style.css';
import type { HorarioDisponivel } from '@/models/AgendamentoJanelas';

import ResumoAgendamento from '../ResumoAgendamento.vue';

const themeColor = ref('rgb(var(--v-theme-secondary))');

const agendamento = ref<Agendamento>({
    id: 0,
    data_agendamento: new Date(),
    data_entrega: new Date(),
    periodo_dia: null,
    status_id: null,
    tipo_agendamento: null,
    volume_total: null,
    quantidade_total: null,
    fornecedor_id: 0,
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
    agendamento_anexos: [],
    agendamento_documentos: []
});

const fornecedorList = ref<Fornecedor[]>([]);


const route = useRoute();
const router = useRouter();
const anexos = ref<any[]>([]);
const novoAnexo = ref<File[] | null | undefined>(undefined);

function adicionarAnexo() {
    if (novoAnexo.value) {
        anexos.value.push(novoAnexo.value);
        console.log(anexos.value);
        novoAnexo.value = null;
    }
}

function removerAnexo(index: number) {
    anexos.value.splice(index, 1);
}

const props = defineProps({
    id: String
});

const show1 = ref(false);
const loadingBtn = ref(false);
const errorMessage = ref('');  // Mensagem de erro

interface Fornecedores {
    fornecedor_id: number,
    nome?: string,
    cnpj_cpf?: string,
    editItem?: boolean
}



onMounted(async () => {
    if (route.params.id != "novo") {
        await carregarCadastro();
    } else {

    }
    await getFornecedores();
    await getDocas();
    // await getAllowedDates();


});

const docas = ref<Doca[]>([]);

interface Doca {
    id: number,
    nome: string,
    tipo: string | null,

}


function getDocas() {
    fetchWrapper.get('cadastros_basicos/docas').then((response) => {
        docas.value = response;
    });
}

function getDocaById(id: number | undefined): Doca {

    if (id == undefined) {
        return { id: 0, nome: '', tipo: null };
    }
    var doca = docas.value.find(d => d.id == id);
    if (doca) {
        return doca;
    }
    else {
        return { id: 0, nome: '', tipo: null };
    }

}

function fornecedorSelecionadoDetalhe(): Fornecedor {
    var fornecedorInfo: Fornecedor = {
        id: 0,
        nome: '',
        ativo: true,
        inscricao_estadual: null,
        created_at: new Date(),
        updated_at: new Date(),
        user_id_created: null,
        user_id_updated: null,
        user_id_deleted: null,
        motivo_alteracao: null,
        cnpj_cpf: null,
        endereco: null,
        numero: null,
        bairro: null,
        cep: null,
        municipio: null,
        matricula_erp: null,
        uf: null,
        permite_agendamento: true
    }

    if (agendamento.value.fornecedor_id != 0) {
        var selecao = fornecedorList.value.find(f => f.id == agendamento.value.fornecedor_id);
        if (selecao != undefined) {
            fornecedorInfo = selecao;
        }

    }

    return fornecedorInfo;

}



function allowedDates(val: Date): boolean {
    const allowedDate = new Date('2024-10-21T00:00:00-04:00');
    return val.getTime() === allowedDate.getTime();
}

/* async function getAllowedDates() {
    allowedDatesArray.value = [];
    ;
    let randomTimeout = 2000 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, randomTimeout)).then(() => {
        allowedDatesArray.value.push(new Date('2024-11-14').toISOString().slice(0, 10));
    });
} */

const janelasDisponivels = ref<HorarioDisponivel[]>([]);

async function getHorarioDisponivelData(data: string) {
    //console.log(data);
    janelasDisponivels.value = [];
    await fetchWrapper.get('agendamento/janelasdisponivels/' + data).then((response) => {
        janelasDisponivels.value = response;
        console.log(response);
    });

}


watch(() => agendamento.value.data_entrega, (newValue) => {
    if (newValue != null) {
        getHorarioDisponivelData(newValue.toISOString().slice(0, 10));
    }
},);

async function getFornecedores() {
    fornecedorList.value = await getFornecedorList();
    console.log(fornecedorList.value);
    if (fornecedorList.value.length == 1 && route.params.id == "novo") {
        agendamento.value.fornecedor_id = fornecedorList.value[0].id;

    }
}

// Manter o restante do seu código...
async function carregarCadastro() {
    // Sua lógica existente
}
function formSubmit() {
    // Sua lógica existente
}

function fornecedorSelectProps(item: any) {
    return {
        title: item.nome,
        subtitle: item.cnpj_cpf,
    };
}

const botaoNavegacaoTexto = ref('Próximo');
function botaoNavegacaoAcao() {
    console.log(tab.value);

    if (tab.value < 3) {
        avancarAction();
    }
    else {
        showResumoAgendamento.value = true;
        //formSubmit();
    }


}
function voltarAction() {
    tab.value = tab.value - 1;

}

const documentoEdit = ref<AgendamentoDocumento>({
    id: 0,
    pedido_id: null,
    numnota: null,
    serie: null,
    chave_nf: null,
    observacoes: null,
    usuario_id: 0,
    fornecedor_id: 0,
    created_at: null,
    updated_at: null,
    tipo_documento: 'PEDIDO',
    dt_emissao: null,
    volumes: 0
});

function doecumentEditClear() {
    documentoEdit.value = {
        id: 0,
        pedido_id: null,
        numnota: null,
        serie: null,
        chave_nf: null,
        observacoes: null,
        usuario_id: 0,
        fornecedor_id: 0,
        created_at: null,
        updated_at: null,
        tipo_documento: 'PEDIDO',
        dt_emissao: null,
        volumes: 0
    }
}

function documentRemove(item: AgendamentoDocumento) {
    agendamento.value.agendamento_documentos = agendamento.value.agendamento_documentos.filter((doc) => doc != item)
}

function documentAdd() {
    var document = documentoEdit.value;
    if (documentoEdit.value != null && documentoEdit.value != undefined) {
        if (documentoEdit.value.tipo_documento == 'PEDIDO' && documentoEdit.value.pedido_id == null) {
            Swal.fire({
                title: 'Atenção',
                text: 'Informe o número do pedido',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }
        agendamento.value.agendamento_documentos.push(document);
        doecumentEditClear();
    }
}

function avancarAction() {
    if (tab.value == 0) {
        if (agendamento.value.fornecedor_id == null || agendamento.value.fornecedor_id == 0) {
            Swal.fire({
                title: 'Atenção',
                text: 'Selecione um fornecedor para prosseguir',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

    }

    tab.value = tab.value + 1;
}
const tab = ref(0);


function changeTab(newTab: number) {
    tab.value = newTab;
}


function docasJanelas() {
    if (janelaIndex.value == null || janelasDisponivels.value.length == 0) {
        return [];
    }
    return janelasDisponivels.value[janelaIndex.value].docas;
}
const janelaIndex = ref(0); // Pega a posição da janela selecionada

watch(() => janelaIndex.value, (newValue) => {
    if (newValue != null) {
        var janelaInfo = janelasDisponivels.value[newValue];
        if (janelaInfo != undefined) {
            agendamento.value.horario_inicio = janelaInfo.hora_inicial;
            agendamento.value.horario_fim = janelaInfo.hora_final;
        }
    }
},);
function totalVolumes() {
    let total: number = 0;
    for (let item_doc of agendamento.value.agendamento_documentos) {
        if (item_doc.volumes)
            total += Number(item_doc.volumes);
    }
    return total;
}
const showResumoAgendamento = ref(false);

function resumoAgendamentoClose() {
    showResumoAgendamento.value = false;
}
function finalizar() {
    showResumoAgendamento.value = false;
    Swal.fire({
        title: 'Sucesso',
        text: 'Agendamento solicitado com sucesso, aguarde a aprovação',
        icon: 'success',
        confirmButtonText: 'OK'
    });
    router.push({ path: '/agendamento/solicitar' });
}
// Exibir o erro no template
</script>

<template>
    <v-dialog v-model="showResumoAgendamento" width="90%" height="100%">


        <ResumoAgendamento @finalizar="finalizar" @close="resumoAgendamentoClose" :agendamento="agendamento">
        </ResumoAgendamento>


    </v-dialog>
    <v-row>
        <UiParentCard title="Solicitação de agendamento">


            <v-row>

                <v-col cols="12">
                    <v-row class="d-flex flex-row">
                        <v-col cols="12" sm="4" class="border-right pr-sm-0 py-sm-0">
                            <v-card-text>
                                <v-tabs v-model="tab" direction="vertical" color="primary">
                                    <v-tab @click="changeTab(0)" rounded="md" class="text-left overflow-hidden"
                                        height="70">
                                        <v-icon class="v-icon--start">mdi-factory</v-icon>
                                        <div>
                                            <div>Empresa</div>
                                            <span
                                                class="text-subtitle-2 text-disabled font-weight-medium d-block">Seleção
                                                de fornecedor para agendamento</span>
                                        </div>
                                    </v-tab>
                                    <v-tab @click="changeTab(1)" rounded="md" class="text-left overflow-hidden"
                                        height="70">
                                        <v-icon class="v-icon--start">mdi-file-document</v-icon>
                                        <!-- <FileDescriptionIcon stroke-width="1.5" width="20" class="v-icon--start" /> -->
                                        <div>
                                            <div>Documentos</div>
                                            <span class="text-subtitle-2 text-disabled font-weight-medium d-block">
                                                Selecionar Pedidos/Nfs para agendamento

                                            </span>
                                        </div>
                                    </v-tab>
                                    <v-tab @click="changeTab(2)" rounded="md" class="text-left overflow-hidden"
                                        height="70">
                                        <!--  <CreditCardIcon stroke-width="1.5" width="20" class="v-icon--start" /> -->
                                        <v-icon class="v-icon--start" rounded="md">mdi-calendar</v-icon>
                                        <div>
                                            <div>Data Entrega</div>
                                            <span
                                                class="text-subtitle-2 text-disabled font-weight-medium d-block">Selecionar
                                                data de entrega</span>
                                        </div>
                                    </v-tab>
                                    <v-tab @click="changeTab(3)" rounded="md" class="mb-3 text-left overflow-hidden"
                                        height="70">
                                        <v-icon class="v-icon--start"
                                            rounded="md">mdi-file-document-edit-outline</v-icon>
                                        <div>
                                            <div>Informações complementares</div>
                                            <span class="text-subtitle-2 text-disabled font-weight-medium d-block">
                                            </span>
                                        </div>
                                    </v-tab>
                                </v-tabs>
                            </v-card-text>
                        </v-col>
                        <v-col cols="12" sm="8" class="pl-sm-0 py-sm-0">
                            <v-card-text>
                                <v-window v-model="tab">
                                    <v-window-item :value="0">
                                        <v-row class="mt-5">
                                            <v-col cols="12">
                                                <v-select variant="outlined" v-model="agendamento.fornecedor_id"
                                                    :items="fornecedorList" item-title="nome" item-value="id"
                                                    :item-props="fornecedorSelectProps" label="Fornecedor">
                                                </v-select>
                                            </v-col>
                                            <v-divider></v-divider>
                                            <v-col cols="12">
                                                <h5>Informações cadastrais</h5>
                                            </v-col>
                                            <v-col lg="12" xlg="9" md="9" sm="12" xsm="12">

                                                <v-text-field variant="outlined" class="text-field-read-only"
                                                    v-model="fornecedorSelecionadoDetalhe().nome" label="Razão Social"
                                                    readonly></v-text-field>
                                            </v-col>
                                            <v-col lg="5" xlg="3" md="3" sm="12" xsm="12">

                                                <v-text-field variant="outlined"
                                                    v-model="fornecedorSelecionadoDetalhe().cnpj_cpf" label="CNPJ/CPF"
                                                    readonly></v-text-field>
                                            </v-col>
                                            <v-col lg="5" xlg="3" md="3" sm="12" xsm="12">

                                                <v-text-field variant="outlined"
                                                    v-model="fornecedorSelecionadoDetalhe().inscricao_estadual"
                                                    label="Inscrição estadual" readonly></v-text-field>
                                            </v-col>

                                            <v-col lg="7" xlg="9" md="9" sm="12" xsm="12">

                                                <v-text-field variant="outlined"
                                                    v-model="fornecedorSelecionadoDetalhe().endereco" label="Endereço"
                                                    readonly></v-text-field>
                                            </v-col>
                                            <v-col lg="2" xlg="3" md="3" sm="12" xsm="12">

                                                <v-text-field variant="outlined"
                                                    v-model="fornecedorSelecionadoDetalhe().numero" label="Número"
                                                    readonly></v-text-field>
                                            </v-col>
                                            <v-col lg="3" xlg="3" md="3" sm="12" xsm="12">

                                                <v-text-field variant="outlined"
                                                    v-model="fornecedorSelecionadoDetalhe().bairro" label="Bairro"
                                                    readonly></v-text-field>
                                            </v-col>
                                            <v-col lg="4" xlg="3" md="3" sm="12" xsm="12">

                                                <v-text-field variant="outlined"
                                                    v-model="fornecedorSelecionadoDetalhe().cep" label="CEP"
                                                    readonly></v-text-field>
                                            </v-col>
                                            <v-col lg="5" xlg="3" md="3" sm="12" xsm="12">

                                                <v-text-field variant="outlined"
                                                    v-model="fornecedorSelecionadoDetalhe().municipio" label="Município"
                                                    readonly></v-text-field>
                                            </v-col>
                                            <v-col lg="2" xlg="3" md="3" sm="12" xsm="12">

                                                <v-text-field variant="outlined"
                                                    v-model="fornecedorSelecionadoDetalhe().uf" label="UF"
                                                    readonly></v-text-field>
                                            </v-col>


                                        </v-row>
                                    </v-window-item>
                                    <v-window-item :value="1">
                                        <v-row class="mt-10">
                                            <v-col lg="5" xlg="3" md="3" sm="12" xsm="12">
                                                <v-select variant="outlined" label="Tipo do documento"
                                                    v-model="documentoEdit.tipo_documento"
                                                    :items="['NOTA FISCAL', 'PEDIDO']"></v-select>
                                            </v-col>
                                            <v-col lg="5" xlg="3" md="3" sm="12" xsm="12"
                                                v-if="documentoEdit.tipo_documento == 'PEDIDO'">
                                                <v-text-field variant="outlined" v-model="documentoEdit.pedido_id"
                                                    label="Número do
                                                    pedido"></v-text-field>
                                            </v-col>
                                            <v-col lg="5" xlg="3" md="3" sm="12" xsm="12"
                                                v-if="documentoEdit.tipo_documento == 'NOTA FISCAL'">
                                                <v-text-field variant="outlined" v-model="documentoEdit.numnota"
                                                    label="Número da nota"></v-text-field>
                                            </v-col>
                                            <v-col lg="2" xlg="2" md="2" sm="12" xsm="12"
                                                v-if="documentoEdit.tipo_documento == 'NOTA FISCAL'">
                                                <v-text-field variant="outlined" v-model="documentoEdit.serie"
                                                    label="Série"></v-text-field>
                                            </v-col>


                                            <v-col lg="8" xlg="8" md="8" sm="12" xsm="12"
                                                v-if="documentoEdit.tipo_documento == 'NOTA FISCAL'">
                                                <v-text-field variant="outlined" v-model="documentoEdit.chave_nf"
                                                    label="Chave NFs"></v-text-field>
                                            </v-col>
                                            <v-col lg="4" xlg="4" md="4" sm="12" xsm="12"
                                                v-if="documentoEdit.tipo_documento == 'NOTA FISCAL'">
                                                <v-text-field variant="outlined" v-model="documentoEdit.dt_emissao"
                                                    type="date" label="Data Emissão"></v-text-field>
                                            </v-col>
                                            <v-col lg="4" xlg="4" md="4" sm="12" xsm="12">
                                                <v-text-field type="number" variant="outlined"
                                                    v-model="documentoEdit.volumes" label="Volumes"></v-text-field>
                                            </v-col>

                                            <v-col cols="12">
                                                <div class="d-flex justify-end">
                                                    <v-btn color="primary" @click="documentAdd">Adicionar</v-btn>
                                                </div>
                                            </v-col>




                                            <v-col cols="12">
                                                <v-divider></v-divider>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-table>
                                                    <thead>
                                                        <tr>
                                                            <th>Tipo Doc.</th>
                                                            <th>Num. Pedido</th>
                                                            <th>Num. Nota</th>
                                                            <th>Série</th>
                                                            <th>Chave</th>
                                                            <th>Volumes</th>
                                                            <th>Ação</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        <tr v-for="item_doc in agendamento.agendamento_documentos">
                                                            <td>{{ item_doc.tipo_documento }}</td>
                                                            <td>{{ item_doc.pedido_id }}</td>
                                                            <td>{{ item_doc.numnota }}</td>
                                                            <td>{{ item_doc.serie }}</td>
                                                            <td>{{ item_doc.chave_nf }}</td>
                                                            <td>{{ item_doc.volumes }}</td>
                                                            <td><v-btn @click="documentRemove(item_doc)" color="error"
                                                                    variant="text"><v-icon>mdi-delete-circle</v-icon></v-btn>
                                                            </td>


                                                        </tr>

                                                    </tbody>
                                                </v-table>
                                            </v-col>
                                            <v-col cols="12" class="d-flex flex-column justify-end">
                                                <div><strong>Total Volumes:</strong> {{ totalVolumes() }}</div>
                                                <div><strong>Total Documentos:</strong> {{
                                                    agendamento.agendamento_documentos.length }}
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-window-item>
                                    <v-window-item :value="2">
                                        <v-row>
                                            <v-col lg="6" md="6" xl="6" sm="12" xsm="12">
                                                <v-row class="pa-5">
                                                    <v-col cols=12>
                                                        <h3 class="text-primary">
                                                            1. Selecione a data de entrega
                                                            <v-icon v-if="agendamento.data_entrega"
                                                                color="success">mdi-check-circle</v-icon>
                                                            <v-icon v-else color="error">mdi-alert-box</v-icon>
                                                        </h3>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <v-date-picker v-model="agendamento.data_entrega"
                                                            :allowed-dates="allowedDates" :min-date="Date()" />
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                            <v-col lg="6" md="6" xl="6" sm="12" xsm="12">
                                                <h3 class="text-primary">2. Selecione o horario disponível para data ({{
                                                    moment(agendamento.data_entrega).format('DD/MM/YYYY') }})</h3>


                                                <div>
                                                    <v-btn-toggle
                                                        v-if="janelasDisponivels.length > 0 && agendamento.data_entrega"
                                                        style="height: 100%;" class="btn-toggle-vertical mt-10"
                                                        v-model="janelaIndex" color="primary" vertical>
                                                        <v-row>
                                                            <v-col cols="12">

                                                                <v-btn class="ma-2" large="medium"
                                                                    v-for="janela in janelasDisponivels">
                                                                    {{ janela.hora_inicial }} Até {{ janela.hora_final
                                                                    }}
                                                                </v-btn>
                                                            </v-col>

                                                        </v-row>
                                                    </v-btn-toggle>

                                                    <div v-else class="centered-text ">
                                                        <strong> Nem um horário disponível para a data
                                                            selecionada</strong>
                                                    </div>
                                                </div>


                                            </v-col>
                                            <v-col cols="12">
                                                <v-row>
                                                    <v-col cols=12>
                                                        <h3 class="text-primary">
                                                            3. Selecione a doca de descarga
                                                        </h3>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <div>

                                                            <v-btn-toggle variant="outlined" divided
                                                                v-if="janelaIndex != null && docasJanelas().length > 0"
                                                                rounded="1" style="height: 100%;"
                                                                v-model="agendamento.doca_id" color="primary" vertical>
                                                                <v-btn v-for="docaId in docasJanelas()" :value="docaId"
                                                                    :key="docaId" class="pa-5">
                                                                    {{ docaId }}. {{ getDocaById(docaId).nome }}
                                                                </v-btn>
                                                            </v-btn-toggle>

                                                        </div>

                                                    </v-col>
                                                </v-row>




                                            </v-col>


                                        </v-row>
                                    </v-window-item>
                                    <v-window-item :value="3">
                                        <v-row class="mt-10">
                                            <v-col cols=12>
                                                <h3 class="text-primary">
                                                    4. Infomações complementares
                                                </h3>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-textarea v-model="agendamento.obervacao_solicitante"
                                                    label="Observações Adcionais" variant="outlined"></v-textarea>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-divider> </v-divider>
                                            </v-col>
                                            <v-col cols="12">
                                                <!-- <v-file-input variant="outlined" v-model="novoAnexo"
                                                    label="Adicionar Anexo" prepend-icon="mdi-paperclip"
                                                    @change="adicionarAnexo"></v-file-input> -->
                                            </v-col>
                                            <v-col cols="12">

                                                <h3 class="text-primary">Anexos:</h3>
                                                <v-list>
                                                    <v-list-item v-for="(anexo, index) in anexos" :key="index">

                                                        {{ anexo[0].name }}

                                                        <v-btn size="small" variant="text" icon
                                                            @click="removerAnexo(index)">
                                                            <v-icon>mdi-delete</v-icon>
                                                        </v-btn>
                                                    </v-list-item>

                                                </v-list>
                                            </v-col>
                                        </v-row>
                                    </v-window-item>
                                </v-window>
                            </v-card-text>
                        </v-col>
                    </v-row>
                </v-col>
                <div class="d-flex justify-center mt-10" style="width: 100%;">
                    <v-btn color="primary" variant="text" :disabled="tab == 0" @click="voltarAction">Anterior</v-btn>
                    <v-btn color="primary" :loading="loadingBtn" @click="botaoNavegacaoAcao">{{ botaoNavegacaoTexto
                        }}</v-btn>
                    <v-btn variant="text" :to="{ path: '/agendamento/solicitar' }">Cancelar</v-btn>
                </div>

            </v-row>
        </UiParentCard>
    </v-row>
</template>

<style scoped>
.error-message {
    margin-top: 20px;
    font-weight: bold;
    color: red;
}

.centered-text {
    margin-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
}

.btn-toggle {
    flex-direction: column;
}
</style>