export interface Transportadora {
    id: number;
    nome: string;
    cnpj: string;
    ie: string;
    endereco: string;
    ativo: boolean;
    created_at: Date;
    updated_at: Date;
    user_id_created?: number | null;
    user_id_updated?: number | null;
    user_id_deleted?: number | null;
    motivo_alteracao?: string | null;
  }