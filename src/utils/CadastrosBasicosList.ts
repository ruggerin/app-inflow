import type { FastForm } from "@/models/FastForms";

export const CadastrosBasicosList: FastForm[] = [
    
];
export function getFastForm(controle_nome: string): FastForm | undefined {
    return CadastrosBasicosList.find((fastForm) => fastForm.controle_nome === controle_nome);
}