export interface Motorista {
  id: number;
  nome: string;
  rg?: string | null;
  cpf?: string | null;
  cnh?: string | null;
  telefone?: string | null;
  transportadora_id?: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  ativo: boolean;
}