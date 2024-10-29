import { fetchWrapper } from "@/utils/helpers/fetch-wrapper";

export interface Parametros {
    id: number;
    descricao: string;
    tipo: string;
    valor?: string | null;
    ativo: boolean;
    grupo?: string | null;
    created_at?: Date | null;
    updated_at?: Date | null;
    user_id_created?: number | null;
    user_id_updated?: string | null;
    label: string;
    texto_ajuda?: string | null;
}

export async function getParametros(): Promise<Parametros[]> {
    try {
        const response = await fetchWrapper.get('cadastros_basicos/parametros');
        return response;
    } catch (error) {
        throw error;
    }

}