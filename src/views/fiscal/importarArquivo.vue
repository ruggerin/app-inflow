<script setup lang="ts">
import { ref,defineEmits, computed, watch, onMounted, reactive } from 'vue';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';

const editor = useEditor({
    extensions: [StarterKit],
    content: ``
});


const etapa = ref("Enviar")

const livro_processado  =ref(0);

const emit = defineEmits(['closeDrawer','refresh']);

const loadingBtn = ref(false)

interface Form {
    titulo: string;
    categoria: string;
    arquivo: File | null;
    mes: string;
    ano: string;
}

const lng_sbtm = ref(false);
const show_alert_sucess = ref(false);
const form = ref<Form>({
    titulo: '',
    categoria: '',
    mes: '',
    ano: '',
    arquivo: null
});

const months = ref([
    { text: 'Janeiro', value: 1 },
    { text: 'Fevereiro', value: 2 },
    { text: 'Março', value: 3 },
    { text: 'Abril', value: 4 },
    { text: 'Maio', value: 5 },
    { text: 'Junho', value: 6 },
    { text: 'Julho', value: 7 },
    { text: 'Agosto', value: 8 },
    { text: 'Setembro', value: 9 },
    { text: 'Outubro', value: 10 },
    { text: 'Novembro', value: 11 },
    { text: 'Dezembro', value: 12 },
]);
function handleFileUpload(event: any) {
    const file = event.target.files[0]; // Captura o primeiro arquivo da lista de arquivos selecionados
    form.value.arquivo = file; // Define o arquivo no objeto form
}
async function submit() {

    //  editor.value?.commands.clearContent();
    lng_sbtm.value = false;
    show_alert_sucess.value = true;

    // 
}

async function enviarArquivo() {
    loadingBtn.value = true;
    const arquivo = form.value.arquivo;



    if (arquivo) {


        const formData = new FormData();
        formData.append('arquivo', arquivo);
        formData.append('mes', form.value.mes)
        formData.append('ano', form.value.ano)



        //  console.log(formData);


        try {
            const resp = await fetchWrapper.post('fiscal/livros/uploadcsv', formData);
            console.log('Resposta do servidor:', resp);

        
            livro_processado.value = resp.livro_id;
            processarArquivo(livro_processado.value)
            loadingBtn.value = false;
            show_alert_sucess.value = true;
 
        } catch (error) {

            alert("Erro ao processar arquivo")
            console.log('Ocorreu um erro na requisição:', error);
            loadingBtn.value = false;
        }
    } else {
        console.log('Nenhum arquivo selecionado para enviar.');
        loadingBtn.value = false;
 
    }
}

async function processarArquivo(livro_id : number) {
    try {
        const resp =  fetchWrapper.post(`fiscal/livros/${livro_id}/processar`);
        console.log(resp)
    } catch (error) {

        alert("Erro ao processar arquivo")
        console.log('Ocorreu um erro na requisição:', error);
        loadingBtn.value = false;
    }

}


function closeForm() {
    emit('closeDrawer')
    emit('refresh')
}

</script>
<template>
    <v-card elevation="0">
        <v-alert closable v-model="show_alert_sucess" temporary type="success" variant="tonal" class="mb-4">
            <h5 class="text-h5 text-capitalize">Sucesso</h5>
            <div>Arquivo importado com sucesso, para acessar o livro, <router-link :to="'/fiscal/livros/'+livro_processado+'/show'">clique
                    aqui</router-link></div>
        </v-alert>

        <v-card-text class="">
            <form>
                <!--<form @submit="submit">-->
                <v-row justify="center" class="align-center">
                    <v-col lg="12">
                        <div class="d-flex align-center">
                            <h4>Importação de livro</h4>
                            <v-btn icon size="small" class="ml-auto" elevation="0" @click="closeForm()">
                                <xIcon size="16" />
                            </v-btn>
                        </div>
                    </v-col>
                    <v-col cols="12">
                        <!--<v-text-field :disabled="lng_sbtm" required v-model="form.mes" variant="outlined"
                            label="Descrição" hide-details color="primary"></v-text-field>
                            -->
                        <v-select required v-model="form.mes" variant="outlined" label="Mês" item-title="text"
                            item-value="value" hide-details color="primary" :items="months"></v-select>
                    </v-col>
                    <v-col cols="12">
                        <v-select required v-model="form.ano" variant="outlined" label="Ano" hide-details color="primary"
                            :items="['2022', '2023', '2024']">
                        </v-select>
                    </v-col>

                    <v-col cols="12">
                        <v-file-input label="Selecione um arquivo CSV" variant="outlined"
                            @change="handleFileUpload"></v-file-input>

                    </v-col>
                    <v-col cols="12">
                        <div class="d-flex justify-end" style="width: 100%;">

                            <v-btn variant="text" :loading="loadingBtn" @click="enviarArquivo">Enviar</v-btn>

                        </div>
                    </v-col>
                </v-row>
            </form>

        </v-card-text>
    </v-card>
</template>