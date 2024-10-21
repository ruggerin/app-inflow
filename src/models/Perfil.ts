import type { Menu } from "./Menu";


export interface Perfil {
  id: number;
  nome: string;
  ativo?: boolean;
  created_at: Date;
  updated_at: Date;
  user_id_created?: bigint | null;
  user_id_updated?: bigint | null;
  user_id_deleted?: bigint | null;
  motivo_alteracao?: string | null;
  menus?: Menu[];
}