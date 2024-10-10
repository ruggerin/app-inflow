<script setup lang="ts">
import { ref, computed, watch, onMounted, reactive } from 'vue';
import { fetchWrapper } from '../../../utils/helpers/fetch-wrapper';

import { useDisplay } from 'vuetify'
import type { Header, Item } from 'vue3-easy-data-table';
import { DateTime } from 'luxon';

import 'vue3-easy-data-table/dist/style.css';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';


const themeColor = ref('rgb(var(--v-theme-secondary))');

const departamentoDetailShow = ref(false);
const tabsTypeShow = ref("option-1");
const { xs, smAndDown, sm, mdAndDown } = useDisplay()





/*Tipagem para resumo*/

interface TotalItem {
    vlrvenda: number;
    qtclipos: number;
    lucro: number;
    eficiencia: string;
    realizado: number;
    meta: number;
}

interface DepartamentoItem {
    codigo: string;
    descricao: string;
    meta: number;
    realizado: number;
    scraps: number;
    produtividade_perc: number;
}
interface SupervisorItem {
    codsupervisor: number;
    nome: string;
    vlrvenda: number;
    qtclipos: number;
    precotbl: number;
    custo: number;
    lucro: number;
    lucro_perc: number;
    meta: number;
}
interface ResumoData {
    total: TotalItem[];
    departamentos: DepartamentoItem[];
    supervisores: SupervisorItem[];
}



const dataResumo = ref<ResumoData>({
    total: [
        {
            vlrvenda: 255544.665,
            qtclipos: 919958.00,
            lucro: 0.00,
            eficiencia: "86,44",
            realizado: 0,
            meta: 565948.665,
        }
    ],
    departamentos: [],
    supervisores: []
});

const departamentoSelecionadoMobile = ref<DepartamentoItem>();


function resetarValoresDepartamentoSelecionadoMobile() {

}
const headers: Header[] = [
    { text: "Código", value: "codigo", sortable: true },

    { text: "Descrição", value: "descricao", sortable: true },
    { text: "Meta", value: "meta", sortable: true },
    { text: "Produzido", value: "realizado", sortable: true },
    { text: "Tendência", value: "tendencia", sortable: true },
    { text: "%Tend.", value: "produtividade_perc", sortable: true },

    { text: "Scraps", value: "scraps", sortable: true },



]
const headersSupervisor: Header[] = [
    { text: "Código", value: "codsupervisor", sortable: true },

    { text: "Segmento", value: "nome", sortable: true },
    { text: "Meta", value: "meta", sortable: true },
    { text: "Produzido", value: "vlrvenda", sortable: true },
    { text: "Realizado", value: "realizado_perc", sortable: true },
    { text: "Cobertura", value: "qtclipos", sortable: true },
    { text: "Lucro", value: "lucro_perc", sortable: true },



]


const breadcrumbs = ref([
    {
        text: 'Indústria',
        disabled: false,
        href: '#'
    },
    {
        text: 'Acompanhamento de Tendência',
        disabled: true,
        href: '#'
    }
]);






const btnLoading = ref(false);


const formBusca = ref({
    dti: "",
    dtf: ""
});


onMounted(() => {

    btnLoading.value = true;
    const currentDateTime = DateTime.now();

    formBusca.value.dti = currentDateTime.toISODate()?.toString() ?? "";
    formBusca.value.dtf = currentDateTime.toISODate()?.toString() ?? "";
    resetarValoresDepartamentoSelecionadoMobile();
    btnLoading.value = false;



});

function departamentoDetailShowOpen(departamentoSelecionado: DepartamentoItem) {

    resetarValoresDepartamentoSelecionadoMobile();
    departamentoSelecionadoMobile.value = departamentoSelecionado;
    departamentoDetailShow.value = true
}

async function search() {

    resetarValoresDepartamentoSelecionadoMobile();
    btnLoading.value = true;

    console.log(formBusca.value)
    try {
        let response = await fetchWrapper.post(`industria/tendencia`, formBusca.value);

        console.log(response);
        dataResumo.value.departamentos = response;
        // let margem = (dataResumo.value.total[0].lucro / dataResumo.value.total[0].vlrvenda * 100);;
        // dataResumo.value.total[0].margem = margem.toLocaleString('pt-BR', { maximumSignificantDigits: 4 });
    } catch (error) {
        console.log("Erro na requisição");
        console.log(error);
    }



    btnLoading.value = false;
}

function colorForGoal(percentual: number) {
    var color = "error";

    if (percentual >= 80) color = "warning"
    if (percentual >= 100) color = "success"

    return color;

}

const formatarParaReal = (valor: number | undefined) => {
    // Verifica se o valor está definido
    if (valor !== undefined) {
        // Usando o método toLocaleString para formatar o número em reais
        return valor.toLocaleString('pt-BR');
    } else {
        // Retorna "--" se o valor for undefined
        return '--';
    }
};


</script>
<style>
.texto-do-grafico {
    position: absolute;
    top: 60px;
    width: 100%;

}

.pai-do-grafico {
    position: relative;
}
</style>
<template>
    <v-row>

        <v-col cols="12" md="12">

            <BaseBreadcrumb title="Tendência - Sintético" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
        </v-col>



        <!---Left Part-->
        <v-col cols="12" lg="12" xl="12">


            <v-expansion-panels>
                <v-expansion-panel elevation="0">
                    <v-expansion-panel-title>Filtros</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <v-row class="mt-4">
                            <v-col cols="12" lg="2">
                                <v-text-field label="Data Início" v-model="formBusca.dti" density="compact"
                                    variant="outlined" type="date"></v-text-field>
                            </v-col>
                            <v-col cols="12" lg="2">
                                <v-text-field label="Data Fim" v-model="formBusca.dtf" density="compact" variant="outlined"
                                    type="date"></v-text-field>
                            </v-col>
                            <v-col cols="12" lg="2">
                                <v-btn variant="text" :loading="btnLoading" @click="search()">Buscar</v-btn>
                            </v-col>


                            <!--<div class="d-flex justify-end" style="width: 100%;">
                                                <v-text-field type="date"></v-text-field>
                                                <v-btn variant="text" @click="search">Atualizar</v-btn>
                                                <v-btn icon variant="text">
                                                </v-btn>
                                            </div>-->
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>

        </v-col>
        <v-col cols="12" lg="3" md="4" sm="6">

            <v-card elevation="0" class="bg-primary overflow-hidden bubble-shape bubble-shape-sm bubble-primary-shape">
                <v-card-text class="pa-5">
                    <div class="d-flex align-center gap-3">
                        <v-btn color="lightwarning" icon rounded="sm" variant="flat">
                            <h2 class="mdi font-weight-large mdi-bullseye-arrow text-primary"></h2>
                        </v-btn>
                        <div>
                            <h4 class="text-h4 font-weight-medium">{{ formatarParaReal((dataResumo.total[0].meta ?? 0))
                            }}
                            </h4>
                            <span class="text-subtitle-2 text-disabled text-white font-weight-medium">Meta</span>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" lg="3" md="4" sm="6">

            <v-card elevation="0" class="bg-primary overflow-hidden bubble-shape  bubble-shape-sm bubble-primary-shape">
                <v-card-text class="pa-5">
                    <div class="d-flex align-center gap-3">
                        <v-btn color="lightwarning" icon rounded="sm" variant="flat">
                            <h2 class="mdi font-weight-large mdi-currency-usd text-primary"></h2>
                        </v-btn>
                        <div>
                            <h4 class="text-h4 font-weight-medium">{{ formatarParaReal((dataResumo.total[0].vlrvenda ?? 0))
                            }}
                            </h4>


                            <v-progress-linear
                                :model-value="(((dataResumo.total[0].vlrvenda ?? 0) / dataResumo.total[0].meta) * 100)"
                                v-if="dataResumo.total[0].meta > 0"></v-progress-linear>
                            <span class="text-subtitle-2 text-disabled text-white font-weight-medium">Produção Total
                                (Vol)</span>

                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>

        <v-col cols="12" lg="3" md="4" sm="6">

            <v-card elevation="0" class="bg-primary overflow-hidden bubble-shape bubble-shape-sm bubble-primary-shape">
                <v-card-text class="pa-5">
                    <div class="d-flex align-center gap-3">
                        <v-btn color="lightwarning" icon rounded="sm" variant="flat">
                            <h2 class="mdi font-weight-large mdi-store-check-outline text-primary"></h2>
                        </v-btn>
                        <div>
                            <h4 class="text-h4 font-weight-medium">{{ formatarParaReal(dataResumo.total[0].qtclipos) ?? 0
                            }}
                            </h4>
                            <span class="text-subtitle-2 text-disabled text-white font-weight-medium">Projeção de
                                produção(mês)</span>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" lg="3" md="4" sm="6">

            <v-card elevation="0" class="bg-primary overflow-hidden bubble-shape bubble-shape-sm bubble-primary-shape">
                <v-card-text class="pa-5">
                    <div class="d-flex align-center gap-3">
                        <v-btn color="lightwarning" icon rounded="sm" variant="flat">
                            <h2 class="mdi font-weight-large mdi-percent text-primary"></h2>
                        </v-btn>
                        <div>
                            <h4 class="text-h4 font-weight-medium">{{ dataResumo.total[0].eficiencia ?? 0
                            }} %
                            </h4>
                            <span class="text-subtitle-2 text-white text-disabled font-weight-medium">Eficiência</span>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>



        <v-col cols="12">
            <v-card>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-tabs v-model="tabsTypeShow" color="primary">
                                <v-tab value="option-1" rounded="md" class="mb-3 text-left">
                                    <PackageIcon width="20" class="v-icon--start" />
                                    <div>
                                        <div>Produtos</div>

                                    </div>
                                </v-tab>
                                <v-tab value="option-2" rounded="md" class="mb-3 text-left">
                                    <UsersIcon width="20" class="v-icon--start" />
                                    <div>
                                        <div>Equipe</div>

                                    </div>
                                </v-tab>
                            </v-tabs>
                        </v-col>
                        <v-col cols="12">
                            <v-divider></v-divider>
                        </v-col>
                        <v-col cols="12">
                            <v-window v-model="tabsTypeShow">
                                <v-window-item value="option-1">
                                    <v-card variant="outlined">
                                        <!--Painel para celulares e tablets-->
                                        <!--smAndDown-->

                                        <!--Inicio painel para Computador-->

                                        <div>
                                            <EasyDataTable :theme-color="themeColor" paginate="false" hide-default-footer
                                                table-class-name="customize-table" :headers="headers"
                                                :items="dataResumo.departamentos">
                                                <template #item-id="{ id }">
                                                    <!--<v-chip color="error">{{ numprojeto }} </v-chip>-->

                                                </template>
                                                <template #item-produtividade_perc="{ produtividade_perc }">

                                                    <div>
                                                        <v-progress-linear label="Teste" :model-value="produtividade_perc"
                                                            :color="colorForGoal(produtividade_perc)"></v-progress-linear>


                                                        <p style=" position:relative;
                                                                justify-content: center;
                                                                align-items: center;
                                                                text-align: center;
                                                                margin: 0;
                                                                height: 100%;"> {{
                                                                    produtividade_perc.toLocaleString('pt-BR', {
                                                                        maximumSignificantDigits: 4
                                                                    }) }}%
                                                        </p>
                                                    </div>
                                                </template>
                                                <template #item-meta="{ meta }">
                                                    {{ formatarParaReal(meta) }}
                                                </template>
                                                <template #item-vlrvenda="{ vlrvenda }">
                                                    {{ formatarParaReal(vlrvenda) }}
                                                </template>
                                                <template #item-lucro_perc="{ lucro_perc }">
                                                    {{ lucro_perc.toLocaleString('pt-BR', {
                                                        maximumSignificantDigits: 4
                                                    }) }}%
                                                </template>




                                            </EasyDataTable>

                                        </div>
                                        <!--Fim painel para Computador-->
                                    </v-card>
                                </v-window-item>


                                <v-window-item value="option-2">
                                    <v-card variant="outlined">


                                        <!--Fim painel para Computador-->
                                    </v-card>

                                </v-window-item>
                            </v-window>

                        </v-col>

                    </v-row>
                </v-card-text>
            </v-card>


        </v-col>
    </v-row>
</template>