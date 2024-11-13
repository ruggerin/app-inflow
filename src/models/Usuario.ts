import { fetchWrapper } from "@/utils/helpers/fetch-wrapper";

export interface Usuario {
    id: number;
    nome: string;
    email: string;
}

export async function getUserById(id: number): Promise<Usuario> {
    let usuario: Usuario = {
        id: id,
        nome: 'Fulano',
        email: ''
    };
    await fetchWrapper.get(`users/${id}/show`).then((response) => {
        usuario = response;
    });
    return usuario;
}