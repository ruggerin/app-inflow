<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';

import { useRoute, useRouter } from 'vue-router';

import type { Empresa } from '@/models/Empresa';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import 'vue3-easy-data-table/dist/style.css';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import Swal from 'sweetalert2';

const themeColor = ref('rgb(var(--v-theme-secondary))');
const route = useRoute();
const router = useRouter();



const props = defineProps({
    id: String
});

const show1 = ref(false);
const loadingBtn = ref(false);



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
    fornecedores: Fornecedores[],
    empresas: UserEmpresas[]
}

interface UserEmpresas {
    id: number, //empresa
    usuario_id: number,
    empresa_id: number,
    editItem?: boolean
}



const titulo = ref('Carregando...')
onMounted(async () => {
    if (route.params.id != "novo") {


        titulo.value = "Edição de usuário [ " + route.params.id + " ]"

        await getPerfils();
        await getFornecedores();
        await carregarCadastro();
        await getEmpresas();
    } else {

        titulo.value = "Cadastro de usuário"
    }



});


interface Perfil {

    perfil_id: number,
    nome: string,
    editItem?: boolean

}

const perfilList = ref<Perfil[]>([]);
const fornecedorList = ref<Fornecedores[]>([]);

const empresaList = ref<Empresa[]>([]);

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

function getEmpresas() {
    fetchWrapper.get('cadastros_basicos/empresa').then((response) => {
        empresaList.value = response.map((empresa: any) => {
            return { id: empresa.id, nome: empresa.nome, cnpj_cpf: empresa.cnpj_cpf }
        });
        console.log(response)
        return response
    })
}

function voltarIndex() {

    router.push('/controle-de-acesso/usuarios');


}


async function carregarCadastro() {

    loadingBtn.value = true;
    try {
        if (route.params.id == '0') {
            form.value = {
                id: 0,
                nome: '',
                email: '',
                password: '',
                perfils: [],
                fornecedores: [],
                empresas: []
            }
            loadingBtn.value = false;
            return;
        }
        form.value = await fetchWrapper.get(`users/${route.params.id}/show`);
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
    fornecedores: [],
    empresas: []
});

function getPerfilNomeById(id: number) {
    const perfil = perfilList.value.find(perfil => perfil.perfil_id === id);
    return perfil ? perfil.nome : '';
}

function getEmpresaByid(id: number) {
    const empresa = empresaList.value.find(empresa => empresa.id == id);
    console.log("id:", id)
    console.log("empresa:", empresaList.value)
    console.log("empresa:", empresa)
    return empresa ? id + ' -' + empresa.nome + ' - ' + empresa.cnpj_cpf : id;

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
        if (route.params.id == '0') {
            response = await fetchWrapper.post(`users/create`, form.value);
            form.value.id = response.id;
        } else {
            response = await fetchWrapper.post(`users/${route.params.id}/update`, form.value);
        }
        console.log(response);
        var id = route.params.id == '0' ? response.id : route.params.id;
        loadingBtn.value = false;
        Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Cadastro salvo com sucesso!',
        });
        router.push('/controle-de-acesso/usuarios/' + id + '/editar');
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


function removerEmpresa(item: any) {
    if (!form.value.empresas) {
        return;
    }
    form.value.empresas = form.value.empresas.filter(empresa => empresa !== item);
}

function adicionarEmpresa() {
    const novo: UserEmpresas = { usuario_id: 0, id: 0, empresa_id: 0, editItem: true }
    if (!form.value.empresas) {
        form.value.empresas = []
    }
    form.value.empresas.push(novo)
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

function finishEditEmpresaItem(item: UserEmpresas) {
    // Encontrar o índice do item no array
    const index = form.value.empresas.findIndex(empresa => empresa.empresa_id === item.empresa_id);

    // Se o item for encontrado, atualizá-lo
    if (index !== -1) {
        form.value.empresas[index] = { ...item, editItem: false };
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
                    <v-text-field required v-model="form.id" disabled variant="outlined" label="Matricula" hide-details
                        color="primary"></v-text-field>
                </v-col>
                <v-col lg="8" md="8" sm="12">
                    <v-text-field required v-model="form.nome" variant="outlined" label="Nome" hide-details
                        color="primary"></v-text-field>
                </v-col>
                <v-col lg="8" md="8" sm="12">
                    <v-text-field required v-model="form.email" variant="outlined" label="E-mail" hide-details
                        color="primary"></v-text-field>
                </v-col>
                <v-col lg="8" md="8" sm="12">
                    <v-text-field :required="route.params.id == 'novo'" v-model="form.password" label="Senha"
                        density="comfortable" variant="outlined" color="primary" hide-details="auto"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'"
                        @click:append="show1 = !show1" class="pwdInput"></v-text-field>
                </v-col>
                <!-- <v-col lg="8" md="8" sm="12">
                    <v-file-input
                        v-model="form.avatar"
                        accept="image/*"
                        show-size
                        @change="onFileChange"
                        label="Avatar"
                    ></v-file-input>
                   
                    <v-img v-if="form.avatar" :src="URL.createObjectURL(form.avatar)" max-height="200"></v-img>
         
                </v-col>
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
                                <v-col cols="3" class="d-flex align-center justify-center">
                                    <div style="height: 100%;  margin-top: 15%;">
                                        <v-btn variant="text" v-if="item.editItem" color="primary" small
                                            @click="finishEditPerfilItem(item)"><v-icon> mdi-check-bold</v-icon></v-btn>
                                        <v-btn variant="text" small @click="removerPerfil(item)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </div>

                                </v-col>
                            </v-row>
                        </v-list-item>

                    </v-list>
                    <div class="d-flex align-center justify-center">
                        <v-btn variant="text" color="secondary"
                            @click="adcionarPerfil"><v-icon>mdi-plus-circle</v-icon>Adicionar Perfil</v-btn>
                    </div>
                </v-col>
                <v-col lg="8" md="8" sm="12">

                    <v-list>
                        <v-list-item>

                            <v-list-item-title>Restrição de empresas/Filiais/Unidade entrega</v-list-item-title>


                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item v-for="item in form.empresas" :key="item.id">
                            <v-row>
                                <v-col cols="9">

                                    <!--   <v-text-field v-model="item.nome"></v-text-field> -->

                                    <v-select v-if="item.editItem" v-model="item.id" :items="empresaList"
                                        item-title="nome" item-value="empresa_id" :item-props="itemProps"
                                        label="Empresa" filterable>

                                    </v-select>
                                    <span v-else>{{ getEmpresaByid(item.id) }}</span>

                                </v-col>
                                <v-col cols="3" class="d-flex align-center justify-center">
                                    <div style="height: 100%;  margin-top: 15%;">
                                        <v-btn variant="text" v-if="item.editItem" color="primary" small
                                            @click="finishEditEmpresaItem(item)"><v-icon>
                                                mdi-check-bold</v-icon></v-btn>
                                        <v-btn variant="text" small @click="removerEmpresa(item)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </div>

                                </v-col>
                            </v-row>
                        </v-list-item>

                    </v-list>
                    <div class="d-flex align-center justify-center">
                        <v-btn variant="text" color="secondary"
                            @click="adicionarEmpresa"><v-icon>mdi-plus-circle</v-icon>Adicionar
                            Empresa</v-btn>
                    </div>
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
                                <v-col cols="3" class="d-flex align-center justify-center">
                                    <div style="height: 100%;  margin-top: 15%;">
                                        <v-btn variant="text" v-if="item.editItem" color="primary" small
                                            @click="finishEditFornecedorItem(item)"><v-icon>
                                                mdi-check-bold</v-icon></v-btn>
                                        <v-btn variant="text" small @click="removerFornecedor(item)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </div>

                                </v-col>
                            </v-row>
                        </v-list-item>

                    </v-list>
                    <div class="d-flex align-center justify-center">
                        <v-btn variant="text" color="secondary"
                            @click="adcionarFornecedor"><v-icon>mdi-plus-circle</v-icon>Adicionar
                            Fornecedor</v-btn>
                    </div>
                </v-col>
                <div class="d-flex justify-center mt-10" style="width: 100%;">

                    <v-btn color="primary" :loading="loadingBtn" @click="formSubmit">Salvar</v-btn>


                    <v-btn variant="text" @click="voltarIndex">Cancelar</v-btn>
                </div>
            </v-row>

        </UiParentCard>
    </v-row>
</template>
