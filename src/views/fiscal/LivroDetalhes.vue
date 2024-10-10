<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';
import { useRoute, useRouter } from 'vue-router';

import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import 'vue3-easy-data-table/dist/style.css';
import ImportarArquivo from './importarArquivo.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { InfoCircleIcon } from 'vue-tabler-icons';
import { string } from 'yup';
import type CFOPItem from './CFOPItemIterface';
import type Cabecalho from './LivrofiscalCabecalho';


import type EntradasCredito from './EntradasCreditoInterface';
import DetalheLivroTab from './DetalheLivroTab.vue';
import ListaDiferido from './ListaDiferido.vue';
import EntradaTabDetail from './EntradaTabDetail.vue';
import { useAuthStore } from '@/stores/auth';
//import type User from './usuario_interface.ts'


const route = useRoute();
const themeColor = ref('rgb(var(--v-theme-secondary))');

const ldd_totais = ref(false);
const livro_id = ref("");
const tab2 = ref(null);
const formSearch = ref({
    codfilial: "01",
    livro_id: ""

});

const vendasDiferidas = ref<VendasDiferidas>();

const entradasCredito = ref<EntradasCredito>();
const props = defineProps({
    id: String
});
const totals = {
    icms: 0.00,
    venda: 0.00,
    contabil: 0.00,
    base_calculo: 0.00
}

interface VendaDiferidoItem {
    grupo_cliente: string;
    DTMOV: string;
    FORNECEDOR_CLIENTE: string;
    numnota: number;
    valor: number;
}

interface VendaDiferido {
    total: number;
    items: VendaDiferidoItem[];
}

interface VendasDiferidas {
    [grupo_cliente: string]: VendaDiferido;
}

const cabecalho = ref<Cabecalho>();

const itemsCFOP = ref<CFOPItem[]>([]);

const headers: Header[] = [
    { text: "Id", value: "id" },
];


onMounted(async () => {

    livro_id.value = route.params.id + '';
    await carregarDados();
});



async function recalcularValores() {
    if (cabecalho.value !== undefined && cabecalho.value.proc_status !== undefined) {
        cabecalho.value.proc_status = 2;
    }
    var response = await fetchWrapper.post(`fiscal/livros/${livro_id.value}/processar`);

    if (cabecalho.value !== undefined && cabecalho.value.proc_status !== undefined) {

    }

}

async function recalcularTotais() {


    ldd_totais.value = true;
    var response = await fetchWrapper.post(`fiscal/livros/${livro_id.value}/recalcular_totais`);

    await carregarDados();
    ldd_totais.value = false;

}
async function statusProcessamentoLivro() {

    var response = await fetchWrapper.get(`fiscal/livros/${livro_id.value}/statusprocessamento`);
    if (cabecalho.value !== undefined && cabecalho.value.proc_status !== undefined) {
        cabecalho.value.proc_status = response.proc_status;
    }


}



async function recalcularEVerificarStatus() {
    await recalcularValores();
    verificarStatusContinuamente();
}


async function verificarStatusContinuamente() {
    let status = await statusProcessamentoLivro();
    while (cabecalho.value?.proc_status === 2) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Aguarda 5 segundos
        status = await statusProcessamentoLivro();
    }
    carregarDados();
    console.log("O status do processamento não é mais igual a 2. Parando a verificação.");
}


function processamentoStatus(statusId: number | any) {

    //1-Nada feito  , 2 - Processando, 3 - OK, 4 - Processado com erro
    let valorDescricao = 'Indefinido';
    switch (statusId) {
        case 1:
            valorDescricao = 'Pendente Processamento';
            break;
        case 2:
            valorDescricao = 'Processando';
            break;
        case 3:
            valorDescricao = 'Processado com sucesso';
            break;
        case 4:
            valorDescricao = 'Processado com erro';
            break;

    }
    return valorDescricao;



}



function obterDataHoraAtual(): Date {
    return new Date();
}


function processamentoCor(statusId: number | any) {
    //1-Nada feito  , 2 - Processando, 3 - OK, 4 - Processado com erro
    let valorDescricao = 'prary';
    switch (statusId) {
        case 1:
            valorDescricao = 'primary';
            break;
        case 2:
            valorDescricao = 'warning';
            break;
        case 3:
            valorDescricao = 'success';
            break;
        case 4:
            valorDescricao = 'error';
            break;

    }
    return valorDescricao;

}



async function carregarDados() {
    formSearch.value.livro_id = livro_id.value;
    var response = await fetchWrapper.post(`fiscal/livros/resumo_cfop_base`, formSearch.value);

    //console.log(response);

    itemsCFOP.value = response.resumo_cfops;
    cabecalho.value = response.cabecalho;

    entradasCredito.value = response.entradas_credito;

    console.log(entradasCredito.value)
    vendasDiferidas.value = response.venda_diferido;


    totals.venda = 0;
    totals.icms = 0;
    totals.contabil = 0;
    totals.base_calculo = 0;

    itemsCFOP.value?.map((item) => {
        totals.venda += item.sub_total;
        totals.icms += item.vlr_icms;
        totals.contabil += item.sub_total;
        totals.base_calculo += item.base_calculo;

    });

    // console.log(itemsCFOP.value)
}


const frmFecharLivro = ref(false);
const dataHoraAtual = ref();
const ipExternoUsuario = ref();
const usuario = ref();

const authStore = useAuthStore();


function fecharApuracaoAction() {


    const agora = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    dataHoraAtual.value = agora.toLocaleDateString('pt-BR', options); // Formata como data e hora no formato "DD/MM/YYYY HH:mm"
    frmFecharLivro.value = true;

    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            console.log('Endereço IP do cliente:', data.ip);
            ipExternoUsuario.value = data.ip

        })
        .catch(error => {
            console.error('Ocorreu um erro ao obter o endereço IP:', error);
        });

    usuario.value = authStore.user.user_info.nome ?? 'Admin';

}
</script>

<template>
  
    <v-row class="center">

        <v-dialog v-model="frmFecharLivro" max-width="800">
            <v-card elevation="0" class="withbg">
                <v-card-title>
                    Fechar Dados de Resumo
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col lg="12" md="12" sm="12">
                            <v-text-field type="datetime" variant="outlined" disabled elevation="0" label="Data"
                                v-model="dataHoraAtual">

                            </v-text-field>

                        </v-col>
                        <v-col lg="12" md="12" sm="12">
                            <v-text-field variant="outlined" disabled elevation="0" label="Ip Externo"
                                v-model="ipExternoUsuario">

                            </v-text-field>

                        </v-col>
                        <v-col lg="12" md="12" sm="12">
                            <v-text-field variant="outlined" disabled elevation="0" label="Ip Externo"
                                v-model="usuario">

                            </v-text-field>

                        </v-col>
                        <v-col lg="12" md="12" sm="12">
                            <strong class="text-subtitle-1 text-red">
                                Após salvar, você estará informado que este livro está de acordo e este não poderá mais
                                ser editado.
                            </strong>

                        </v-col>


                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-row justify="end" py-5>
                        <v-btn small variant="text" @click="frmFecharLivro = false">Cancelar</v-btn>
                        <v-btn small color="primary">Salvar</v-btn>
                    </v-row>

                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-col lg="12" md="12">
            <v-card variant="outlined" elevation="0" class="withbg">
                <v-card-item >
                    <div class="d-sm-flex align-center justify-space-between">
                        <v-card-title>Seleções</v-card-title>
                        <!-- <template v-slot:append> -->
                        <slot name="action"></slot>
                        <!-- </template> -->
                    </div>
                </v-card-item>
                <v-divider></v-divider>
                <v-card-text>
                    <v-row>
                        <v-col lg="3" md="3">
                            Período de apuração: <strong>{{ cabecalho?.mes }} / {{ cabecalho?.ano }}</strong>
                        </v-col>
                        <v-col lg="3" md="3">
                            Detalhes: <strong>{{ cabecalho?.detalhes }}</strong>
                        </v-col>
                        <v-col lg="3" md="3">
                            Status Processamento: <v-chip :color="processamentoCor(cabecalho?.proc_status)">{{
                                processamentoStatus(cabecalho?.proc_status) }}
                                <InfoCircleFilledIcon v-if="cabecalho?.proc_status == 4" size="20" />
                            </v-chip>
                        </v-col>

                        <v-col cols="12">
                            <v-divider></v-divider>
                        </v-col>



                        <v-col lg="3" md="3">

                            <v-select variant="outlined" label="Empresa" v-model="formSearch.codfilial"
                                density="compact" :onchange="carregarDados()" :items="['00', '01']"></v-select>
                        </v-col>

                        <v-col lg="9" md="9">
                            <v-row justify="end" py-5>
                                <v-btn small variant="text" @click="recalcularEVerificarStatus()"
                                    :loading="cabecalho?.proc_status == 2" color="primary">Reprocessar
                                    Arquivo</v-btn>

                                   

                                <v-btn small variant="text" @click="recalcularTotais()" :loading="ldd_totais"
                                    color="primary">Recalcular
                                    Totais</v-btn>
                               
                                <v-btn small variant="text" @click="fecharApuracaoAction()" color="primary">Fechar
                                    Apuração</v-btn>
                                

                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
        <!--
        <v-col lg="12" md="12">
            <v-card variant="outlined" elevation="0" class="withbg">
                <v-card-item>
                    <div class="d-sm-flex align-center justify-space-between">
                        <v-card-title>Resumo CFOP/Base Cálculo</v-card-title>
                   
                        <slot name="action"></slot>
                     
                    </div>
                </v-card-item>
                <v-divider></v-divider>
                <v-card-text>
                    
                    
                </v-card-text>
            </v-card>
        </v-col>-->
        <v-col cols="12">
            <!-- customer detail table -->
            <v-card elevation="0">
                <v-card variant="outlined">
                    <v-card-text>
                        <v-tabs v-model="tab2" color="primary">
                            <v-tab value="11">
                                <FileDescriptionIcon stroke-width="1.5" width="20" class="v-icon--start" />RESUMO DE
                                APURAÇÃO
                            </v-tab>
                            <v-tab value="22">
                                <FileInvoiceIcon stroke-width="1.5" width="20" class="v-icon--start" /> DEST. INDUSTRIA
                                INCENTIVADA
                            </v-tab>
                            <v-tab value="33">
                                <TruckDeliveryIcon stroke-width="1.5" width="20" class="v-icon--start" /> NOTAS ENTRADAS
                            </v-tab>
                        </v-tabs>
                        <v-divider></v-divider>
                        <v-card-text class="px-0">
                            <v-window v-model="tab2">
                                <v-window-item value="11">
                                    <!-- Details tab -->
                                 
                                        <DetalheLivroTab :items="itemsCFOP" :totals="totals" id="printMe2"
                                            :entradas_credito="entradasCredito" :cabecalho="cabecalho">
                                        </DetalheLivroTab>

                                   

                                </v-window-item>

                                <v-window-item value="22">
                                    <ListaDiferido :vendasDiferidas="vendasDiferidas" />
                                </v-window-item>

                                <v-window-item value="33">
                                    <EntradaTabDetail :items="entradasCredito" />
                                </v-window-item>
                            </v-window>
                        </v-card-text>
                    </v-card-text>
                </v-card>
            </v-card>
        </v-col>
    </v-row>
</template>
