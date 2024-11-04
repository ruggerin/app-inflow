import type { FastFormField } from "./FastFormsFields";
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
export interface FastForm {
    id: number;
    controle_nome: string;
    label: string;
    ativo: boolean;
    endpoint: string;
    fields: FastFormField[];
    created_at: Date;
    updated_at: Date;
    field_title: string;
}

export async function fastFormConstruct(controle_nome: string): Promise<FastForm> {
    let fastForm: FastForm = {} as FastForm; // Inicializa a variável fastForm como um objeto vazio do tipo FastForm

    await fetchWrapper.get('cadastros_basicos/configuracao_cadastro_basico/' + controle_nome + '/artefatos')
        .then((response) => {
            console.log(response);
            fastForm = response;
        });

    return fastForm;
}