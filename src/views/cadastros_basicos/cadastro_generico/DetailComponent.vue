<script lang="ts" setup>
import { ref, onMounted, defineProps, defineEmits , computed} from 'vue';
import type { FastForm } from '@/models/FastForms';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';



const emits = defineEmits(['closeDialog', 'updateList']);
const props = defineProps<{
    controller_form: FastForm;
    item_id: number;
}>();

const btnSubmitLoading = ref(false);
const formLoading = ref(false);

function submit() {
    const { isValid, emptyFields } = validateForm();
    if (!isValid) {
        console.log('Campos obrigatórios não preenchidos:', emptyFields);
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    if (props.item_id) {
        update();
    } else {
        create();
    }
}

function create() {
    btnSubmitLoading.value = true;
    const requestBody = buildRequestBody();
    fetchWrapper.post(`cadastros_basicos/${props.controller_form.endpoint}`, requestBody).then(() => {
        btnSubmitLoading.value = false;
        emits('updateList');
        emits('closeDialog');
    });
}
async function update() {
    btnSubmitLoading.value = true;
    const requestBody = buildRequestBody();
    await fetchWrapper.put(`cadastros_basicos/${props.controller_form.endpoint}/${props.item_id}`, requestBody).then(() => {
        btnSubmitLoading.value = false;
        emits('updateList');
        emits('closeDialog');
    }).catch((error) => {
        console.error('Error updating details:', error);

        const statusCode = error.resposeStatus ;
        if(statusCode == 400){
            alert('Erro ao atualizar os detalhes, código do erro: 400');
        }
        else{
            alert('Erro ao atualizar os detalhes, erro interno do sistema');
        }

      
        console.error('Error updating item:', error);
        btnSubmitLoading.value = false;
    });
}

async function getDetailFromServer() {
    formLoading.value = true;

    try {
        const response = await fetchWrapper.get(`cadastros_basicos/${props.controller_form.endpoint}/${props.item_id}`);
        props.controller_form.fields.forEach(field => {
            field.value = response[field.name];
        });
    } catch (error) {
        console.error('Error fetching details from server:', error);
    } finally {
        formLoading.value = false;
    }
}

function dialogClose() {
    emits('closeDialog');
}

onMounted(() => {
    if (props.item_id && props.item_id > 0) {
        getDetailFromServer();
    } else {
        props.controller_form.fields.forEach(field => {
            if(field.name == 'id'){
                field.value = '0';
            }
            else
            field.value = null;
        });
    }
});

function buildRequestBody() {
    const requestBody: Record<string, any> = {};
    props.controller_form.fields.forEach(field => {
        if (!field.readonly) {
            requestBody[field.name] = field.value;
        }
    });
    return requestBody;
}
const validationErrors = ref<Record<string, string>>({});
    function validateForm() {
    validationErrors.value = {};
    let isValid = true;
    const emptyFields:any = [];

    props.controller_form.fields.forEach(field => {
        if (field.required && !field.value) {
            validationErrors.value[field.name] = `${field.label} é obrigatório.`;
            emptyFields.push(field.label);
            isValid = false;
        }
    });

    return { isValid, emptyFields };
}


const idOutput = computed(() => {
  
  var idValue = props.controller_form.fields.find((field) => field.name == 'id')?.value;
  if(idValue == '0'){
      return '(novo)';
  }
  else {
      return idValue;
  }
});




</script>
<template>

    <v-card>
        <v-toolbar color="primary" dark>
            <v-toolbar-title> {{ controller_form.label }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn :loading="btnSubmitLoading" @click="submit()">Salvar</v-btn>
            <v-btn size="small" color="white" icon @click="dialogClose()">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text v-if="formLoading">
            <v-row justify="center">
                <div style="margin: 10vh;">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div>
            </v-row>
        </v-card-text>
        <v-card-text v-else max-height="30vh">

            <form @submit.prevent="submit">
                <v-row>
                    <v-col cols="12" v-for="field in props.controller_form.fields.filter((campo)=>!campo.hidden)" :key="field.id">
                        
                        <v-text-field v-if="field.name =='id'"  v-model="idOutput" variant="outlined" label="Código"
                            readonly></v-text-field>

                        
                        <v-switch v-else-if="field.type == 'boolean'" v-model="field.value" color="success"
                            :label="field.label"></v-switch>


                        <v-text-field v-else-if="field.type == 'number'" variant="outlined" :label="field.label"
                            v-model="field.value" :readonly="field.readonly"
                            :error-messages="validationErrors[field.name]"></v-text-field>
                        <v-text-field v-else-if="field.type == 'date'" variant="outlined"
                            :label="field.label" v-model="field.value" :readonly="field.readonly"
                            :error-messages="validationErrors[field.name]"></v-text-field>

                        <v-text-field v-else variant="outlined" :label="field.label" v-model="field.value"
                            :readonly="field.readonly" :error-messages="validationErrors[field.name]"></v-text-field>
                    </v-col>


                </v-row>
            </form>
        </v-card-text>

    </v-card>

</template>