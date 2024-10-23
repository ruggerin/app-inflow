<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, watch } from 'vue';

const props = defineProps({
  hora: {
    type: String as () => string | null,
    required: true
  }
});

const emit = defineEmits(['update:hora']);
const horaEdit = ref<string | null>(props.hora);

onMounted(() => {
  if (props.hora === null) {
    horaEdit.value = '00:00:00';
  }
});

function updateHora() {
  emit('update:hora', horaEdit.value);
}

watch(() => props.hora, (newVal) => {
  horaEdit.value = newVal;
});
</script>

<template>
  <v-row class="row">
    <v-col cols="10">
      <v-text-field
        variant="outlined"
        density="compact"
        type="time"
        class="form-control"
        v-maska="'##:##:##'"
        id="hora"
        v-model="horaEdit"
      />
    </v-col>
    <v-col cols="2" style="margin-left: -15px;  ">
      <v-btn style="width: 35px;"
        v-if="horaEdit !== props.hora"
        size="small"
        icon
        variant="text"
        @click="updateHora"
        class="btn btn-primary"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<style scoped>
.compact-form {
  padding: 0 !important;
}

.compact-form > * {
  margin: 1 !important;
  padding: 0 !important;
}
</style>