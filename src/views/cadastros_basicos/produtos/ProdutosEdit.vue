<script setup lang="ts">
/*import { ref, onMounted } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';

import { useRoute, useRouter } from 'vue-router';

import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import 'vue3-easy-data-table/dist/style.css';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import type {Produto} from './produto_interface';


const themeColor = ref('rgb(var(--v-theme-secondary))');
const route = useRoute();
const router = useRouter();



const props = defineProps({
    id: String
});

const show1 = ref(false);
const loadingBtn = ref(false);




const titulo = ref('Carregando...')
onMounted(async () => {
    if (route.params.id != "novo") {


        titulo.value = "Edição de usuário [ " + route.params.id + " ]"
        carregarCadastro()
    } else {

        titulo.value = "Cadastro de usuário"
    }


    // if()
});


function voltarIndex() {

    router.push('/usuarios'); // Use push para adicionar ao histórico de navegação


}


async function carregarCadastro() {

    loadingBtn.value = true;
    try{
        form.value = await fetchWrapper.get(`users/${route.params.id}/show`);
        loadingBtn.value = false;
    }
    catch(error){
        console.log(error)

        console.error(`Erro ao processar solicitação, verifique com o setor de suporte`);
        loadingBtn.value = false;
    }

    loadingBtn.value = false;
}
const form:Produto = ref({});


async function formSubmit() {
    loadingBtn.value = true;
    var response = await fetchWrapper.post(`users/${route.params.id}/update`, form.value)
    console.log(response)
    loadingBtn.value = false;
}


*/

</script>
<template>
 <!--  <v-row>
        <UiParentCard :title=titulo>
            <v-row justify="center" class="align-center mb-3">

                <v-col lg="8" md="8" sm="12">
                    <v-text-field required v-model="form.id" disabled variant="outlined" label="Matricula" hide-details
                        color="primary"></v-text-field>
                </v-col>
                <v-col lg="8" md="8" sm="12">
                    <v-text-field required v-model="form.codigo" variant="outlined" label="Nome" hide-details
                        color="primary"></v-text-field>
                </v-col>
                <v-col lg="8" md="8" sm="12">
                    <v-text-field required v-model="form.descricao" variant="outlined" label="E-mail" hide-details
                        color="primary"></v-text-field>
                </v-col>
               
            


                <div class="d-flex justify-center" style="width: 100%;">

                    <v-btn color="primary" :loading="loadingBtn" @click="formSubmit">Salvar</v-btn>


                    <v-btn variant="text" @click="voltarIndex">Cancelar</v-btn>
                </div>
            </v-row>

        </UiParentCard>
    </v-row>
--> 
</template>
