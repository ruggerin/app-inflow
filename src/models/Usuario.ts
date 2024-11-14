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

export async function getUsuarioList(): Promise<Usuario[] > {
    try {
        const response = await fetchWrapper.get('users');
        return response;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export function getUsuariosByIdFromList(id: number, usuarioList: Usuario[]): Usuario | undefined {
    if (usuarioList.length === 0) {
        return undefined;
    }

    const usuario = usuarioList.find((usuario) => usuario.id === id);
    return usuario;
}
