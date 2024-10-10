


<script setup lang="ts">

import { ref, onMounted, onUpdated } from 'vue';
import UiChildCard from '@/components/shared/UiChildCard.vue';

import { dinheiroReal, percentual } from '@/utils/helpers/formatNumberBrazuca';


const props = defineProps({
    items: Object

});

const details = ref<itemCfop[]>([]);


const totalValor = ref(0);
const totalBaseCalculo = ref(0);
const totalValorIcms = ref(0);

interface itemCfop {
    cfop: number;
    descricao: string;
    PERC_ICMS: number;
    entrada_saida_aux: "E" | "S";
    sub_total: number;
    base_calculo: number;
    vlr_icms: number;
}

onUpdated(() => {
    serializarValores();
})


onMounted(() => {
    serializarValores();
});

function serializarValores() {

    details.value = props.items?.details;

    totalValor.value = 0;
    totalBaseCalculo.value = 0;
    totalValorIcms.value = 0;

    details.value.map((e) => {
        totalValor.value += e.sub_total;
        totalBaseCalculo.value += e.base_calculo;
        totalValorIcms.value += e.vlr_icms;
    })
}


</script>

<template>
    <UiChildCard title="Detalhes Notas Fiscais de Entrada">

        <v-row justify="space-between">



            <v-table class="text-no-wrap">
                <thead>
                    <tr>
                        <th class="text-left text-subtitle-1">CFOP</th>
                        <th class="text-left text-subtitle-1">Descrição</th>
                        <th class="text-left text-subtitle-1">VALOR CONTÁBIL</th>
                        <th class="text-left text-subtitle-1">BASE DE CÁLCULO</th>
                        <th class="text-left text-subtitle-1">ALÍQUOTA</th>
                        <th class="text-left text-subtitle-1">ICMS</th>



                    </tr>
                </thead>
                <tbody>

                    <tr v-for="row in details" :key="row.cfop">
                        <td class="py-3">
                            <h5 class="text-subtitle-1">{{ row.cfop }}</h5><!--CFOP-->
                        </td>
                        <td class="py-3">{{ (row.descricao) }}</td> <!--VALOR CONTÁBIL-->
                        <td class="py-3">{{ dinheiroReal(row.sub_total) }}</td> <!--VALOR CONTÁBIL-->
                        <td class="py-3">{{ dinheiroReal(row.base_calculo) }}</td><!--VALOR BASE CALCULO-->
                        <td class="py-3">{{ percentual(row.PERC_ICMS) }}%</td><!--ALÍQUOTA-->
                        <td class="py-3">{{ dinheiroReal(row.vlr_icms) }}</td><!--ICMS-->



                    </tr>


                    <!--Linha de totais-->

                    <tr class="text-subtitle-1">
                   
                        <td colspan="2"><strong>Total</strong></td>
                        <td>{{dinheiroReal(totalValor) }}</td>
                        <td>{{ dinheiroReal(totalBaseCalculo) }}</td>
                        <td>-</td>
                        <td>{{dinheiroReal(totalValorIcms) }}</td>
                    
                    </tr>
                </tbody>
            </v-table>



        </v-row>
    </UiChildCard>
</template>