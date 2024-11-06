import { fetchWrapper } from "@/utils/helpers/fetch-wrapper";

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

export async function verifyPermissionUserByName(name: string): Promise<boolean> {
  try {
    const response = await fetchWrapper.get('menu-permissoes/verify-permission/' + name);
    return response;
  } catch (error) {
    console.error(error);
    return false;
  }
}