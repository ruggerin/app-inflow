interface MenuPermissao {
  id: number;
  menu_id: number;
  label?: string | null;
  name?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  user_id_created?: bigint | null;
  user_id_updated?: bigint | null;
  user_id_deleted?: bigint | null;
  acesso?: boolean; // Usado para controle de acesso
}