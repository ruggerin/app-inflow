<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';

import { useRoute, useRouter } from 'vue-router';

import { useAuthStore } from '@/stores/auth';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import 'vue3-easy-data-table/dist/style.css';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import Swal from 'sweetalert2';

const themeColor = ref('rgb(var(--v-theme-secondary))');

const authStore = useAuthStore();
const router = useRouter();

const userId = ref(0);




const show1 = ref(false);
const loadingBtn = ref(false);


function goToHome() {
    router.push({ name: 'home' }); // Substitua 'home' pelo nome da rota para a página inicial
}
interface Fornecedores {
    fornecedor_id: number,
    nome?: string,
    cnpj_cpf?: string,
    editItem?: boolean

}

interface User {
    id: number,
    nome: string,
    email: string,
    password: string,
    perfils: Perfil[]
    fornecedores: Fornecedores[]
}


const titulo = ref('Carregando...')
onMounted(async () => {


    titulo.value = "Meu perfil";
    console.log(authStore)
    userId.value = authStore.user.user_info.id;

    await getPerfils();
    await getFornecedores();
    await carregarCadastro();




});


interface Perfil {

    perfil_id: number,
    nome: string,
    editItem?: boolean

}

const perfilList = ref<Perfil[]>([]);
const fornecedorList = ref<Fornecedores[]>([]);

function getPerfils() {
    fetchWrapper.get('cadastros_basicos/perfil').then((response) => {
        perfilList.value = response.map((perfil: any) => {
            return { perfil_id: perfil.id, nome: perfil.nome }
        });
        console.log(response)

        return response
    })
}
function getFornecedores() {
    fetchWrapper.get('cadastros_basicos/fornecedor').then((response) => {
        fornecedorList.value = response.map((fornecedor: any) => {
            return { fornecedor_id: fornecedor.id, nome: fornecedor.nome, cnpj_cpf: fornecedor.cnpj_cpf }
        });
        console.log(response)
        return response
    })

}

const alterarSenha = ref(false);

const confirmacaoSenha = ref('');



const show2 = ref(false);

const passwordRules = [
    (v: string) => !!v || 'Senha é obrigatória',
    (v: string) => v.length >= 8 || 'A senha deve ter pelo menos 8 caracteres'
];

const confirmacaoSenhaRules = [
    (v: string) => !!v || 'Confirmação de senha é obrigatória',
    (v: string) => v === form.value.password || 'As senhas não conferem'
];

async function carregarCadastro() {

    loadingBtn.value = true;
    try {
        if (userId.value == 0) {
            form.value = {
                id: 0,
                nome: '',
                email: '',
                password: '',
                perfils: [],
                fornecedores: []
            }
            loadingBtn.value = false;
            return;
        }
        form.value = await fetchWrapper.get(`users/${userId.value}}/show`);
        console.log(form.value)
        loadingBtn.value = false;
    }
    catch (error) {
        console.log(error)

        console.error(`Erro ao processar solicitação, verifique com o setor de suporte`);
        loadingBtn.value = false;
    }

    loadingBtn.value = false;
}
const form = ref<User>({
    id: 0,
    nome: '',
    email: '',
    password: '',
    perfils: [],
    fornecedores: []
});
function validateForm() {

    let validacao =  confirmacaoSenha.value == form.value.password && form.value.password.length >= 8;
    return validacao;


}
function getPerfilNomeById(id: number) {
    const perfil = perfilList.value.find(perfil => perfil.perfil_id === id);
    return perfil ? perfil.nome : '';
}

function getFornecedorNomeById(id: number) {
    const fornecedor = fornecedorList.value.find(fornecedor => fornecedor.fornecedor_id === id);
    return fornecedor ? fornecedor.nome + ' - ' + fornecedor.cnpj_cpf : '';
}
async function formSubmit() {

    if (form.value.perfils.length == 0) {

        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: "Selecione ao menos um perfil",
        });
        return;
    }
    try {


        loadingBtn.value = true;
        let response = null;

        response = await fetchWrapper.post(`users/${userId.value}/update`, form.value);

        console.log(response);

        loadingBtn.value = false;
        Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Cadastro salvo com sucesso!',
        });
        goToHome();
    } catch (error) {
        let errorMessage = 'Ocorreu um erro ao salvar o registro. Por favor, tente novamente mais tarde.';

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: errorMessage,
        });
        console.error('Erro ao salvar usuário:', error);

        loadingBtn.value = false;
    }
}
function removerPerfil(item: any) {
    if (!form.value.perfils) {
        return;
    }
    form.value.perfils = form.value.perfils.filter(perfil => perfil !== item);
}
function removerFornecedor(item: any) {
    if (!form.value.fornecedores) {
        return;
    }
    form.value.fornecedores = form.value.fornecedores.filter(fornecedor => fornecedor !== item);
}
function adcionarPerfil() {
    const novoPerfil: Perfil = { perfil_id: 0, nome: '', editItem: true }
    if (!form.value.perfils) {
        form.value.perfils = []
    }
    form.value.perfils.push(novoPerfil)
}
function adcionarFornecedor() {
    const novo: Fornecedores = { fornecedor_id: 0, nome: '', editItem: true }
    if (!form.value.perfils) {
        form.value.perfils = []
    }
    form.value.fornecedores.push(novo)
}

function finishEditPerfilItem(item: Perfil) {
    // Encontrar o índice do item no array
    const index = form.value.perfils.findIndex(perfil => perfil.perfil_id === item.perfil_id);

    // Se o item for encontrado, atualizá-lo
    if (index !== -1) {
        form.value.perfils[index] = { ...item, editItem: false };
    }
}
function finishEditFornecedorItem(item: Fornecedores) {
    // Encontrar o índice do item no array
    const index = form.value.fornecedores.findIndex(fornecedor => fornecedor.fornecedor_id === item.fornecedor_id);

    // Se o item for encontrado, atualizá-lo
    if (index !== -1) {
        form.value.fornecedores[index] = { ...item, editItem: false };
    }
}

const searchFornecedor = ref('');

function itemProps(item: any) {
    return {
        title: item.nome,
        subtitle: item.cnpj_cpf,
    };
}



</script>
<template>
    <v-row>
        <UiParentCard :title=titulo>
            <v-row justify="center" class="align-center mb-3">

                <v-col lg="8" md="8" sm="12">
                    <v-text-field required v-model="form.id" readonly variant="outlined" label="Matricula" hide-details
                        color="primary"></v-text-field>
                </v-col>
                <v-col lg="8" md="8" sm="12">
                    <v-text-field required v-model="form.nome" readonly variant="outlined" label="Nome" hide-details
                        color="primary"></v-text-field>
                </v-col>
                <v-col lg="8" md="8" sm="12">
                    <v-text-field required v-model="form.email" readonly variant="outlined" label="E-mail" hide-details
                        color="primary"></v-text-field>
                </v-col>

                <v-col lg="8" md="8" sm="12">
                    <v-checkbox v-model="alterarSenha" label="Alterar senha" color="primary"></v-checkbox>
                </v-col>
                <v-col lg="8" md="8" sm="12" v-if="alterarSenha">
                    <v-text-field v-model="form.password" label="Senha" density="comfortable" variant="outlined"
                        color="primary" hide-details="auto" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show1 ? 'text' : 'password'" @click:append="show1 = !show1" class="pwdInput"
                        :rules="passwordRules"></v-text-field>
                </v-col>
                <v-col lg="8" md="8" sm="12" v-if="alterarSenha">
                    <v-text-field v-model="confirmacaoSenha" label="Confirmação de senha" density="comfortable"
                        variant="outlined" color="primary" hide-details="auto"
                        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :type="show2 ? 'text' : 'password'"
                        @click:append="show2 = !show2" class="pwdInput" :rules="confirmacaoSenhaRules"></v-text-field>
                    <!-- <div><span class="text-error">Senhas não conferem</span></div> -->
                </v-col>
                <!-- 
                -->


                <v-col lg="8" md="8" sm="12">

                    <v-list>
                        <v-list-item>

                            <v-list-item-title>Perfis do usuário</v-list-item-title>


                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item v-for="item in form.perfils" :key="item.perfil_id">
                            <v-row>
                                <v-col cols="9">


                                    <!--   <v-text-field v-model="item.nome"></v-text-field> -->

                                    <v-select v-if="item.editItem == true" v-model="item.perfil_id" :items="perfilList"
                                        item-title="nome" item-value="perfil_id" label="Perfil"></v-select>
                                    <span v-else> {{ getPerfilNomeById(item.perfil_id) }}</span>

                                </v-col>

                            </v-row>
                        </v-list-item>

                    </v-list>

                </v-col>
                <v-col lg="8" md="8" sm="12">

                    <v-list>
                        <v-list-item>

                            <v-list-item-title>Restrição de fornecedores</v-list-item-title>


                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item v-for="item in form.fornecedores" :key="item.fornecedor_id">
                            <v-row>
                                <v-col cols="9">

                                    <!--   <v-text-field v-model="item.nome"></v-text-field> -->

                                    <v-select v-if="item.editItem" v-model="item.fornecedor_id" :items="fornecedorList"
                                        item-title="nome" item-value="fornecedor_id" :item-props="itemProps"
                                        label="Fornecedor" filterable>

                                    </v-select>
                                    <span v-else>{{ getFornecedorNomeById(item.fornecedor_id) }}</span>

                                </v-col>

                            </v-row>
                        </v-list-item>

                    </v-list>

                </v-col>
                <div class="d-flex justify-center mt-10" style="width: 100%;">

                    <v-btn color="primary" :disabled="!validateForm()" :loading="loadingBtn"
                        @click="formSubmit">Salvar</v-btn>


                    <v-btn variant="text" @click="goToHome">Cancelar</v-btn>
                </div>
            </v-row>

        </UiParentCard>
    </v-row>
</template>
