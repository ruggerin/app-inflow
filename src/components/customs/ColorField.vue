<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';

const dialogShow = ref(false);

// Definindo as props (usando modelValue para v-model)
const props = defineProps<{
  modelValue?: string | null;
}>();

// Definindo os eventos emitidos
const emits = defineEmits(['update:modelValue']);

// Usando a prop para inicializar o valor local
const colorValue = ref(props.modelValue || '#FFFFFF'); // Valor padrão

// Observando mudanças na prop e atualizando o valor local
watch(() => props.modelValue, (newValue) => {
  if (newValue !== colorValue.value) {
    colorValue.value = newValue??'#FFFFFF';
  }
});

// Função para abrir o diálogo
function openDialog() {
  dialogShow.value = true;
}

// Função para fechar o diálogo
function closeDialog() {
  dialogShow.value = false;
}

// Função para emitir o novo valor de cor
watch(colorValue, (newColor) => {
  emits('update:modelValue', newColor);  // Emitindo o evento toda vez que a cor mudar
});
</script>

<template>
  <v-dialog v-model="dialogShow" max-width="25%">
    <v-card>
      <v-card-title>Seleção de cor</v-card-title>
      <v-card-text  class="d-flex align-center justify-center">
        <!-- Usando v-model para vincular a cor diretamente -->
        <v-color-picker v-model="colorValue"></v-color-picker>
      </v-card-text>
      <v-card-text class="d-flex align-center justify-center pa-5">
        <v-btn color="primary"  width="60%" @click="closeDialog">OK</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Campo de texto para exibir e alterar o valor da cor -->
  <v-text-field variant="outlined" v-model="colorValue" label="Color">
    <template v-slot:append-inner>
      <v-btn class="custom-border" elevation="0" :color="colorValue" size="small" @click="openDialog">
      
      </v-btn>
    </template>
  </v-text-field>
</template>

<style scoped>
.custom-border {
  border: 0.5px solid black;
}
</style>
