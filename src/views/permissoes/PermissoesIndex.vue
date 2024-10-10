<script setup lang="ts">
import { ref } from 'vue';
import { VTreeview } from 'vuetify/labs/VTreeview'

interface PermissoesItems {
  id: number;
  nome: string;
  created_at: string;
  updated_at: string;
}

interface Permissoes {
  id: number;
  nome: string;
  permissoes_items: PermissoesItems[];
  created_at: string;
  updated_at: string;
}

const permissoesTeste = ref<Permissoes[]>([
  {
    id: 1,
    nome: 'Cadastros Básicos',
    permissoes_items: [
      { id: 202, nome: 'Cadastrar Fornecedor', created_at: '2021-10-10', updated_at: '2021-10-10' },
      { id: 203, nome: 'Cadastrar Produto', created_at: '2021-10-10', updated_at: '2021-10-10' },
      { id: 204, nome: 'Cadastrar Figura Giro', created_at: '2021-10-10', updated_at: '2021-10-10' },
    ],
    created_at: '2021-10-10',
    updated_at: '2021-10-10',
  },
  {
    id: 2,
    nome: 'Controle de Permissões',
    permissoes_items: [
      { id: 1, nome: 'Permitir Bloquear/Desbloquear Fornecedores', created_at: '2021-10-10', updated_at: '2021-10-10' },
      { id: 2, nome: 'Permitir Incluir cadastro do Fornecedor', created_at: '2021-10-10', updated_at: '2021-10-10' },
    ],
    created_at: '2021-10-10',
    updated_at: '2021-10-10',
  },
]);

const permissoesSelected = ref<number[]>([]);
</script>

<template>
  <v-card>
    <v-toolbar color="primary" dark>
      <v-toolbar-title>Permissões</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="">Fechar</v-btn>
    </v-toolbar>
    <v-card-text>
      <v-treeview
        :items="permissoesTeste"
        item-key="id"
        open-on-click
        activatable
        v-model:selected="permissoesSelected"
        selection-type="leaf"
      >
        <template v-slot:prepend="{ item }">
          <v-checkbox
            :label="item.nome"
            :value="item.id"
            v-model="permissoesSelected"
          />
        </template>
      </v-treeview>
    </v-card-text>
  </v-card>
</template>
