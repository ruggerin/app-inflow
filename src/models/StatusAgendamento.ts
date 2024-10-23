import { fetchWrapper } from "@/utils/helpers/fetch-wrapper";
export interface StatusAgendamento {
    id: number;
    descricao: string;
    created_at?: Date;
    updated_at?: Date;
    user_id_created?: number | null;
    user_id_updated?: number | null;
    user_id_deleted?: number | null;
    motivo_alteracao?: string | null;
    ativo?: boolean;
    cor_fundo?: string | null;
}

export function getStatusAgendamentoEmpyt(): StatusAgendamento {
    var statusAgendamentoEmpyt: StatusAgendamento = {
        id: 0,
        descricao: '',
        created_at: new Date(),
        updated_at: new Date(),
        user_id_created: null,
        user_id_updated: null,
        user_id_deleted: null,
        motivo_alteracao: null,
        ativo: true,
        cor_fundo: null
    };
    return statusAgendamentoEmpyt;
}   

export async function getStatusById(id: number): Promise<StatusAgendamento> { 
    try {
        const response = await fetchWrapper.get('cadastros_basicos/status_agendamento/' + id);
        return response.status_agendamento;
    } catch (error) {
        console.error(error);
        return getStatusAgendamentoEmpyt();
    }
}
export async function getStatusList(): Promise<StatusAgendamento[]> {
    try {
        const response = await fetchWrapper.get('cadastros_basicos/status_agendamento');
        return response.status_agendamento;
    } catch (error) {
        console.error(error);
        return [];
    }
}