import { fetchWrapper } from "@/utils/helpers/fetch-wrapper";
export interface Docas  {
  id: number;
  nome: string;
  tipo: string;
  ativo: boolean;
  created_at: Date;
  updated_at: Date;
  user_id_created?: number | null;
  user_id_updated?: number | null;
  user_id_deleted?: number | null;
  motivo_alteracao?: string | null;
  empresa_id?: number | null;
}

export function getDocasList(): Promise< Docas[]> {
  return fetchWrapper.get('cadastros_basicos/docas');
}