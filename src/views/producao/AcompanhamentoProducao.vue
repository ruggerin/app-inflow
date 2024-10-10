<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue';


import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

import { FileDescriptionIcon, UserCircleIcon } from 'vue-tabler-icons';
const lineChartPizza = {
  series: [66, 50, 40, 30]
};

const lineChart1 = {
  series: [
    {
      data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54, 25, 66, 41, 89, 63, 54, 25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54]
    }
  ]
};

const ninecards = shallowRef([
  { earn: '16', text: 'O.P Abertas', icon: UserCircleIcon, color: 'secondary' },
  { earn: '04:32', text: 'h Total  Pausas', icon: FileDescriptionIcon, color: 'primary' }
]);
const chartOptions1 = computed(() => {
  return {
    chart: {
      type: 'pie',
      height: 300,
      fontFamily: `inherit`,
      foreColor: '#a1aab2',
      sparkline: {
        enabled: true
      }
    },

    labels: ['Maquina 1', 'Maquina 2', 'Maquina 3', 'Maquina 4'],
    legend: {
      show: true,
      position: 'bottom',
      fontFamily: 'inherit',
      labels: {
        colors: 'inherit'
      }
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false
      }
    },
    theme: {
      monochrome: {
        enabled: true
      }
    }
  };
});

const breadcrumbs = ref([
  {
    text: 'Indústria',
    disabled: false,
    href: '#'
  },
  {
    text: 'Produtividade',
    disabled: true,
    href: '#'
  }
]);

</script>

<template>
  <v-row>
    <v-col cols="12" md="12">

      <BaseBreadcrumb title="Análise de produção" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    </v-col>


    <!---Left Part-->
    <v-col cols="12" lg="12" xl="12">


      <v-expansion-panels>
        <v-expansion-panel elevation="0">
          <v-expansion-panel-title>Filtros</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row class="mt-4">
              <v-col cols="12" lg="2">
                <v-text-field label="Data Início" density="compact" variant="outlined"
                  type="date"></v-text-field>
              </v-col>
              <v-col cols="12" lg="2">
                <v-text-field label="Data Fim" density="compact" variant="outlined"
                  type="date"></v-text-field>
              </v-col>
              <v-col cols="12" lg="2">
                <v-btn variant="text"  >Buscar</v-btn>
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

    <v-col cols="12" lg="4" v-for="(card9, i) in ninecards" :value="card9" :key="i">
      <v-card elevation="0" :class="' overflow-hidden  position-relative bg-' + card9.color">
        <v-card variant="outlined" class="text-center border-0">
          <component :is="card9.icon" stroke-width="2" size="89" class="text-white opacity-50 icon-scale" />
          <v-card-text>
            <h3 class="text-h3 my-2">{{ card9.earn }}</h3>
            <span>{{ card9.text }}</span>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
    <v-col cols="12" lg="4">
      <v-card elevation="0">
        <v-card variant="outlined">
          <v-card-item>
            <v-card-title class="text-18">Produção geral</v-card-title>
          </v-card-item>
          <v-divider></v-divider>
          <v-card-text class="text-center">
            <h3 class="text-h3 mb-5">89.73%</h3>
            <v-progress-linear model-value="89" color="primary"></v-progress-linear>
            <div class="d-flex flex-row justify-space-between mt-5">
              <div class="text-left">
                <span class="text-medium-emphasis text-subtitle-2">Anterior</span>
                <h5 class="text-subtitle-1 mt-1">56.75kg</h5>
              </div>
              <div>
                <span class="text-medium-emphasis text-subtitle-2">Variação</span>
                <h5 class="text-subtitle-1 mt-1">+12.60kg</h5>
              </div>

            </div>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>


    <v-col cols="12" lg="8">
      <v-card elevation="0">
        <v-card variant="outlined">
          <v-card-text>
            <h5 class="text-h5 mb-1">Evolução de kg Produzidos <span class="text-medium-emphasis">(diário)</span></h5>
            <span class="text-h5 d-flex align-center mb-5">0.85%

              <ArrowUpIcon stroke-width="2" width="20" class="ml-2 text-primary" />
              <span class="text-primary">0.50%</span>
            </span>
          </v-card-text>
          <apexchart type="bar" height="210" :options="chartOptions1" :series="lineChart1.series"> </apexchart>
        </v-card>
      </v-card>
    </v-col>
    <v-col cols="12" lg="4">
      <v-card elevation="0">
        <v-card variant="outlined">
          <v-card-text>
            <span class="text-subtitle-1">Volumes por equipamento</span>
            <apexchart type="pie" height="300" :options="chartOptions1" :series="lineChartPizza.series"> </apexchart>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>
