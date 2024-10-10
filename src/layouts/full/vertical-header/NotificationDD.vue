<script setup lang="ts">
import { ref } from 'vue';
import { BuildingStoreIcon, SendIcon, MailboxIcon, PhotoIcon, CheckIcon } from 'vue-tabler-icons';

const notificationDD = ref(['Todos os Alertas', 'New', 'Unread', 'Other']);
const selectNotify = ref(['Todos os Alertas']);
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- notifications DD -->
  <!-- ---------------------------------------------- -->
  <div class="pa-4">
    <div class="d-flex align-center justify-space-between mb-3">
      <h6 class="text-subtitle-1">
        Alertas
        <v-chip color="warning" variant="flat" size="small" class="ml-2 text-white">10</v-chip>
      </h6>
      <a href="#" class="text-decoration-underline text-primary text-subtitle-2">Marcar como lidos</a>
    </div>
    <v-select :items="notificationDD" v-model="selectNotify" color="primary" variant="outlined" density="default"
      hide-details></v-select>
  </div>
  <v-divider></v-divider>
  <perfect-scrollbar style="height: calc(100vh - 300px); max-height: 650px">
    <v-list class="py-0" lines="three">
      <!-- Ocorrência 1: Parada de Máquina -->
      <v-list-item value="" active-color="secondary">
        <template v-slot:prepend>
          <v-avatar size="40" variant="flat" color="error" class="mr-3 py-2">
            <mdi-alert size="20" />
          </v-avatar>
        </template>
        <div class="d-inline-flex align-center justify-space-between w-100">
          <h6 class="text-subtitle-1">Parada de Máquina</h6>
          <span class="text-subtitle-2 text-medium-emphasis">2 mins</span>
        </div>
        <p class="text-subtitle-2 text-medium-emphasis mt-1">Máquina 3 apresentou falha mecânica e está fora de operação.
        </p>
      </v-list-item>

      <!-- Ocorrência 2: Aumento de Scrap -->
      <v-list-item value="" active-color="secondary">
        <template v-slot:prepend>
          <v-avatar size="40" variant="flat" color="warning" class="mr-3 py-2">
            <mdi-delete size="20" />
          </v-avatar>
        </template>
        <div class="d-inline-flex align-center justify-space-between w-100">
          <h6 class="text-subtitle-1">Aumento de Scrap</h6>
          <span class="text-subtitle-2 text-medium-emphasis">5 mins</span>
        </div>
        <p class="text-subtitle-2 text-medium-emphasis mt-1">Ocorrência de qualidade detectada na linha de produção.
          Aumento significativo de peças defeituosas.</p>
      </v-list-item>

      <!-- Ocorrência 3: Manutenção Preventiva -->
      <v-list-item value="" active-color="secondary">
        <template v-slot:prepend>
          <v-avatar size="40" variant="flat" color="info" class="mr-3 py-2">
            <mdi-wrench size="20" />
          </v-avatar>
        </template>
        <div class="d-inline-flex align-center justify-space-between w-100">
          <h6 class="text-subtitle-1">Manutenção Preventiva</h6>
          <span class="text-subtitle-2 text-medium-emphasis">10 mins</span>
        </div>
        <p class="text-subtitle-2 text-medium-emphasis mt-1">Realizada manutenção preventiva na linha de produção para
          evitar paradas não planejadas.</p>
      </v-list-item>

      <!-- Ocorrência 4: Falta de Material -->
      <v-list-item value="" active-color="secondary">
        <template v-slot:prepend>
          <v-avatar size="40" variant="flat" color="warning" class="mr-3 py-2">
            <mdi-package-variant-closed size="20" />
          </v-avatar>
        </template>
        <div class="d-inline-flex align-center justify-space-between w-100">
          <h6 class="text-subtitle-1">Falta de Material</h6>
          <span class="text-subtitle-2 text-medium-emphasis">15 mins</span>
        </div>
        <p class="text-subtitle-2 text-medium-emphasis mt-1">Material essencial para a produção está em falta. Aguardando
          reposição.</p>
      </v-list-item>

      <!-- Ocorrência 5: Problema Elétrico -->
      <v-list-item value="" active-color="secondary">
        <template v-slot:prepend>
          <v-avatar size="40" variant="flat" color="error" class="mr-3 py-2">
            <mdi-flash size="20" />
          </v-avatar>
        </template>
        <div class="d-inline-flex align-center justify-space-between w-100">
          <h6 class="text-subtitle-1">Problema Elétrico</h6>
          <span class="text-subtitle-2 text-medium-emphasis">20 mins</span>
        </div>
        <p class="text-subtitle-2 text-medium-emphasis mt-1">Falha elétrica detectada na linha de produção. Aguardando
          reparo.</p>
      </v-list-item>

      <!-- Ocorrência 6: Retrabalho -->
      <v-list-item value="" active-color="secondary">
        <template v-slot:prepend>
          <v-avatar size="40" variant="flat" color="warning" class="mr-3 py-2">
            <mdi-replay size="20" />
          </v-avatar>
        </template>
        <div class="d-inline-flex align-center justify-space-between w-100">
          <h6 class="text-subtitle-1">Retrabalho</h6>
          <span class="text-subtitle-2 text-medium-emphasis">25 mins</span>
        </div>
        <p class="text-subtitle-2 text-medium-emphasis mt-1">Peças produzidas necessitam de retrabalho devido a falhas
          detectadas durante inspeção de qualidade.</p>
      </v-list-item>

      <!-- Ocorrência 7: Atraso de Fornecedores -->
      <v-list-item value="" active-color="secondary">
        <template v-slot:prepend>
          <v-avatar size="40" variant="flat" color="warning" class="mr-3 py-2">
            <mdi-truck-delivery size="20" />
          </v-avatar>
        </template>
        <div class="d-inline-flex align-center justify-space-between w-100">
          <h6 class="text-subtitle-1">Atraso de Fornecedores</h6>
          <span class="text-subtitle-2 text-medium-emphasis">30 mins</span>
        </div>
        <p class="text-subtitle-2 text-medium-emphasis mt-1">Fornecedores de matéria-prima estão com atraso na entrega.
          Produção impactada.</p>
      </v-list-item>

      <!-- Ocorrência 8: Falha de Software -->
      <v-list-item value="" active-color="secondary">
        <template v-slot:prepend>
          <v-avatar size="40" variant="flat" color="error" class="mr-3 py-2">
            <mdi-desktop-classic size="20" />
          </v-avatar>
        </template>
        <div class="d-inline-flex align-center justify-space-between w-100">
          <h6 class="text-subtitle-1">Falha de Software</h6>
          <span class="text-subtitle-2 text-medium-emphasis">35 mins</span>
        </div>
        <p class="text-subtitle-2 text-medium-emphasis mt-1">Sistema de controle de produção enfrentou falha. Equipe de TI
          trabalhando na solução.</p>
      </v-list-item>

      <!-- Ocorrência 9: Parada não Planejada -->
      <v-list-item value="" active-color="secondary">
        <template v-slot:prepend>
          <v-avatar size="40" variant="flat" color="error" class="mr-3 py-2">
            <mdi-cancel size="20" />
          </v-avatar>
        </template>
        <div class="d-inline-flex align-center justify-space-between w-100">
          <h6 class="text-subtitle-1">Parada não Planejada</h6>
          <span class="text-subtitle-2 text-medium-emphasis">40 mins</span>
        </div>
        <p class="text-subtitle-2 text-medium-emphasis mt-1">Parada não planejada na linha de produção devido a falha em
          equipamento crítico.</p>
      </v-list-item>

      <!-- Ocorrência 10: Conclusão de Ordem de Produção -->
      <v-list-item value="" active-color="secondary">
        <template v-slot:prepend>
          <v-avatar size="40" variant="flat" color="lightsuccess" class="mr-3 py-2 text-success">
            <mdi-check size="20" />
          </v-avatar>
        </template>
        <div class="d-inline-flex align-center justify-space-between w-100">
          <h6 class="text-subtitle-1">Conclusão de Ordem de Produção</h6>
          <span class="text-subtitle-2 text-medium-emphasis">45 mins</span>
        </div>
        <p class="text-subtitle-2 text-medium-emphasis mt-1">Ordem de produção 'OP-1234' concluída com sucesso. Produto
          pronto para envio ao cliente.</p>
    </v-list-item>
  </v-list>

</perfect-scrollbar>
<v-divider></v-divider>
<div class="pa-2 text-center">
  <v-btn color="primary" variant="text">Ver todos</v-btn>
</div></template>
