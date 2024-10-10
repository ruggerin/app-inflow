<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue';
import type CFOPItem from './CFOPItemIterface';
import type Cabecalho from './LivrofiscalCabecalho';
import { dinheiroReal, percentual } from '@/utils/helpers/formatNumberBrazuca';
import CardValores from './CardValores.vue';
// common components
import UiChildCard from '@/components/shared/UiChildCard.vue';


// icons
import { CalendarEventIcon, DeviceMobileIcon, ListDetailsIcon } from 'vue-tabler-icons';



const props = defineProps({
  items: Array<CFOPItem>,
  totals: Object,
  cabecalho: Object,
  entradas_credito: Object
});



function teste() {

}
function printSection() {
    window.print();
  }


const entradasDetailsShow = ref(false);

const helperEntradaCredito = ref('');

onUpdated(async () => {

  helperEntradaCredito.value = dinheiroReal(props.cabecalho?.icms_entrada_bruto) + ' x ' + percentual(props.cabecalho?.perc_aproveitamento_icms) + '% =  ';
});

</script>

<template>
  <!-- shopping list -->



  <v-row justify="center" class="ma-5">
    <v-btn color="primary" v-print="'#printMe'">Imprimir</v-btn>
  </v-row>

  <v-card elevation="0" class="mt-6"  id="printMe">
    <v-row justify="space-between">

      <div class="pa-5">
        <h3>APURAÇÃO DO ICMS - PROPORCIONALIDADE DOS CRÉDITOS</h3>
        <h5>Período: {{ cabecalho?.mes }} / {{ cabecalho?.ano }}</h5>
        <h5>Inscrição Estadual: {{ cabecalho?.inscricao_estadual }} </h5>
      </div>

      <div class="pa-5 text-sm-end text-center">
        <!--<img src="../../../assets/images/logos/LOGOCOMPLETA.png" width="140" />-->
        <img src="../../assets/images/logos/LOGOCOMPLETA.png" width="140" />
      </div>

    </v-row>


    <v-card variant="outlined">
      <v-card-item class="py-3">
        <v-card-title class="text-h5">RESUMO CFOP/BASE DE CÁLCULO</v-card-title>
      </v-card-item>
      <v-divider></v-divider>
      <v-table class="text-no-wrap">
        <thead>
          <tr>
            <th class="text-left text-subtitle-1">CFOP</th>
            <th class="text-left text-subtitle-1">VALOR CONTÁBIL</th>
            <th class="text-left text-subtitle-1">BASE DE CÁLCULO</th>
            <th class="text-left text-subtitle-1">ALÍQUOTA</th>
            <th class="text-left text-subtitle-1">ICMS</th>
            <th class="text-left text-subtitle-1">PROP</th>

            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in items" :key="row.cfop">
            <td class="py-3">
              <h5 class="text-subtitle-1">{{ row.cfop }}</h5><!--CFOP-->
            </td>
            <td class="py-3">{{ dinheiroReal(row.sub_total) }}</td> <!--VALOR CONTÁBIL-->
            <td class="py-3">{{ dinheiroReal(row.base_calculo) }}</td><!--VALOR BASE CALCULO-->
            <td class="py-3">{{ percentual(row.PERC_ICMS) }}%</td><!--ALÍQUOTA-->
            <td class="py-3">{{ dinheiroReal(row.vlr_icms) }}</td><!--ICMS-->
            <td class="py-3"> {{ percentual((row.sub_total / totals?.venda) * 100) }}% </td><!--PROP-->

            <td class="py-3">
              <v-btn color="primary" variant="text" icon>
                <ListDetailsIcon width="20" stroke-width="1.5" />
              </v-btn>
            </td>
          </tr>


          <!--Linha de totais-->

          <tr class="text-subtitle-1">

            <td class="py-3">(=) Total</td>
            <td class="py-3">{{ dinheiroReal(totals?.contabil) }}</td> <!--VALOR CONTÁBIL-->
            <td class="py-3">{{ dinheiroReal(totals?.base_calculo) }}</td><!--VALOR BASE CÁLCULO-->
            <td class="py-3"></td><!--ALÍQUOTA-->
            <td class="py-3">{{ dinheiroReal(totals?.icms) }}</td><!--ICMS-->
            <td class="py-3"> </td><!--PROP-->

            <td class="py-3">

            </td>
          </tr>

          <!--Fim linha totais-->
        </tbody>
      </v-table>

    </v-card>
    <!-- {{ entradas_credito }}-->
    <CardValores title="CRÉDITO ENTRADA" :value="dinheiroReal(cabecalho?.valor_icms_credito_entrada_final)"
      :helper="helperEntradaCredito" />
    <CardValores title="VALOR DO ICMS DEBITADO(INCENTIVADO)"
      :value="dinheiroReal(cabecalho?.valor_icms_debitado_incentivo)" />
    <CardValores title="VALOR DO ESTORNO DE DÉBITO(diferido)"
      :value="dinheiroReal(cabecalho?.valor_estorno_icms_diferido)" />
    <CardValores title="SALDO DO ICMS DEBITADO" :value="dinheiroReal(cabecalho?.icms_debitado)" />

    <CardValores title="SALDO CREDOR MÊS ANTERIOR " :value="dinheiroReal(cabecalho?.saldo_credor_anterior)" />

    <CardValores title="SALDO DO ICMS (DEVEDOR)" :value="dinheiroReal(cabecalho?.saldo_icms_devedor)" />
    <CardValores title="NÍVEL DE RESTITUIÇÃO " :value="percentual(cabecalho?.nivel_restituicao_perc) + '%'" />
    <CardValores title="CRÉDITO ESTÍMULO " :value="dinheiroReal(cabecalho?.valor_credito_estimulo)" />

    <CardValores title="CRÉDITO NÃO ESTIMULO" :value="dinheiroReal(cabecalho?.valor_icms_credito_nao_incentivado)" />
    <CardValores title="FMPES (6% s/ Crédito Estímulo)"
      :value="dinheiroReal(cabecalho?.valor_credito_FMPES_estimulo)" />
    <CardValores title="UEA      (1,5% s/ Crédito Estímulo)"
      :value="dinheiroReal(cabecalho?.valor_credito_UEA_estimulo)" />
    <div class="pa-5">
      <h5>IMPOSTOS INCIDENTES D/ FATURAMENTO C/ DIFERIMENTO</h5>
    </div>

    <CardValores title="VALOR BASE(CLIENTES GRUPO IE 06.300)" :value="dinheiroReal(cabecalho?.total_grupo_diferido)" />
    <CardValores title="VALOR FTI" :value="dinheiroReal(cabecalho?.valor_fti_diferido)"
      :helper="percentual(cabecalho?.perc_fti_diferido) + '% => '" />
    <CardValores title="VALOR UEA" :value="dinheiroReal(cabecalho?.valor_uea_diferido)"
      :helper="percentual(cabecalho?.perc_uea_diferido) + '% => '" />
    <CardValores title="DIFERENCA DE ALIQUOTA" :value="dinheiroReal(0)" :helper="'USO/CONSUMO => '" />
    <CardValores title="DIFERENCA DE ALIQUOTA" :value="dinheiroReal(0)" :helper="'FRETE USO/CONSUMO => '" />

    <CardValores title="ICMS NÃO INCENTIVADO" :value="dinheiroReal(cabecalho?.valor_icms_n_incentivado)"
      :helper="'Tributo 1335 => '" />
    <CardValores title="TOTAL DA APURAÇÃO DOS IMPOSTOS" :value="dinheiroReal((
      cabecalho?.valor_icms_credito_nao_incentivado +
      cabecalho?.valor_credito_UEA_estimulo +
      cabecalho?.valor_credito_FMPES_estimulo +
      cabecalho?.valor_fti_diferido +
      cabecalho?.valor_uea_diferido) +
      cabecalho?.valor_icms_n_incentivado



    )" />

  </v-card>
</template>
<style scoped>
@media print {
  body * {
    visibility: hidden;
  }

  #printMe,
  #printMe * {
    visibility: visible;
  }

  #printMe {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
