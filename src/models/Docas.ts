export interface Doca {
  id: number;
  nome: string;
  tipo: string;
  ativo: boolean;
  created_at: Date;
  updated_at: Date;
}

export const docaLabels = {
    id: 'ID',
    nome: 'Nome',
    tipo: 'Tipo',
    ativo: 'Ativo',
    created_at: 'Data de Criação',
    updated_at: 'Data de Atualização',
  };