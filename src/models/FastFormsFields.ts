export interface FastFormField {
    id: number;
    name: string;
    label: string;
    type: string;
    required: boolean;
    readonly? : boolean | null;
    value? : string | null;
    hidden? : boolean | null;
    hidden_index? : boolean | null;
    colecao_helper : string| null;

}