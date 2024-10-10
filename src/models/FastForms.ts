import { type FastFormField} from "./FastFormsFields";

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