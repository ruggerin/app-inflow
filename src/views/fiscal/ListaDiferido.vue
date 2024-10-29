<script setup lang="ts">
import { ref } from 'vue';

import moment from 'moment'
import UiChildCard from '@/components/shared/UiChildCard.vue';

import { dinheiroReal, percentual } from '@/utils/helpers/formatNumberBr';
// icons
import { CalendarEventIcon, DeviceMobileIcon, MailIcon } from 'vue-tabler-icons';


const props = defineProps({

  vendasDiferidas: Object
});

</script>

<template>

  <UiChildCard title="Relação Diferido">

    <div id="printDiferido">
      <div v-for="(venda, grupo) in vendasDiferidas" :key="grupo">
        <h2>Grupo {{ grupo }}</h2>
        <v-table class="text-no-wrap small-text-table">
          <thead>
            <tr>
              <th>DTMOV</th>
              <th>FORNECEDOR_CLIENTE</th>
              <th>Num. Nota</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in venda.items" :key="index">
              <td>{{ moment(item.DTMOV).format("DD/MM/YYYY") }}</td>
              <td>{{ item.FORNECEDOR_CLIENTE }}</td>
              <td>{{ item.numnota }}</td>
              <td>{{ dinheiroReal(item.valor) }}</td>
            </tr>
            <tr>
              <td colspan="3"><strong>Total</strong></td>
              <td><strong>{{ dinheiroReal((venda.total)) }}</strong></td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
    <v-row justify="center" class="ma-5">
      <v-btn color="primary" v-print="'#printDiferido'">Imprimir</v-btn>
    </v-row>
  </UiChildCard>
</template>
<style scoped>
.text-no-wrap th {
  white-space: nowrap;
}

.small-text-table th,
.small-text-table td {
  font-size: 0.8rem;
  /* Ajuste o tamanho da fonte conforme necessário */
}
</style>