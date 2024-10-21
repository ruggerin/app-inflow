export interface Menu {
    id: number;
    nome: string;
    ativo?: boolean;
    created_at: string;
    updated_at: string;
    user_id_created?: number | null;
    user_id_updated?: number | null;
    user_id_deleted?: number | null;
    motivo_alteracao?: string;
    menu_pai?: number | null;
    icon?: string;
    path_url?: string;
    label?: string;
    ordem: number;
    crud_simples?: boolean;
    open? : boolean;
    children?: Menu[];
    permissoes? : MenuPermissao[];
    acesso?: boolean; // Usado para controle de acesso
  }