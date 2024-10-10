import type { FastForm } from "@/models/FastForms";

export const CadastrosBasicosList: FastForm[] = [
    {
        id: 1,
        controle_nome: "docas",
        label: "Docas",
        ativo: true,
        endpoint: "docas",
        fields: [
            {
                id: 0,
                label: "ID",
                name: "id",
                type: "number",
                required: false,
                readonly: true,
                colecao_helper: "",
            },

            {
                id: 1,
                label: "Nome",
                name: "nome",
                type: "string",
                required: true,
                colecao_helper: "",
            },
            {
                id: 2,
                label: "Tipo",
                name: "tipo",
                type: "string",
                required: true,
                colecao_helper: "",
            },
            {
                id: 3,
                label: "Ativo",
                name: "ativo",
                type: "boolean",
                required: true,
                colecao_helper: "",
            },
        ],
        created_at: new Date(),
        updated_at: new Date(),
        field_title: "Nome",
    },
    {
        id: 2,
        controle_nome: "veiculos",
        label: "Veículos",
        ativo: true,
        endpoint: "veiculos",
        fields: [
            {
                id: 1,
                name: "placa",
                label: "Placa",
                type: "string",
                required: true,
                colecao_helper: "",
            },
            {
                id: 2,
                name: "tipo",
                label: "Tipo",
                type: "string",
                required: true,
                colecao_helper: "",
            },
            {
                id: 3,
                label: "Ativo",
                name: "ativo",
                type: "boolean",
                required: true,
                colecao_helper: "",
            },
        ],
        created_at: new Date(),
        updated_at: new Date(),
        field_title: "Placa",
    },
];
export function getFastForm(controle_nome: string): FastForm | undefined {
    return CadastrosBasicosList.find((fastForm) => fastForm.controle_nome === controle_nome);
}