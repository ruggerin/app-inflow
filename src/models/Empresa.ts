export interface Empresa {
  id: number;
  nome: string;
  ativo: boolean;
  codigo_interno?: number | null;
  created_at: Date;
  updated_at: Date;
  user_id_created?: number | null;
  user_id_updated?: number | null;
  user_id_deleted?: number | null;
  motivo_alteracao?: string | null;
  cnpj_cpf?: string | null;
  endereco?: string | null;
  numero?: string | null;
  bairro?: string | null;
  cep?: string | null;
  municipio_id?: number | null;
  matricula_erp?: string | null;
  uf?: string | null;
  matriz?: string | null;
  permite_agendamento: boolean;
  inscricao_estadual?: string | null;
  email_notificacao_novo_agendamento?: string | null;
}