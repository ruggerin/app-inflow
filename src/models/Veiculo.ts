export interface Veiculo {
    id: number;
    nome: string;
    capacidade_carga: number;
    tipo: string;
    cubagem: number;
    quantidade_paletes: number;
    transportadora_id: number;
    ativo: boolean;
    created_at: Date | null;
    updated_at: Date | null;
    user_id_created?: number | null;
    user_id_updated?: number | null;
    user_id_deleted?: number | null;
    motivo_alteracao?: string | null;
    placa?: string | null;
  }