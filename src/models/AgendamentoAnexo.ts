export interface AgendamentoAnexo {
  id: number;
  agendamento_id: number; // bigint NOT NULL
  path?: string | null; // varchar(255) DEFAULT NULL
  original_name?: string | null; // varchar(255) DEFAULT NULL
  original_type?: string | null; // varchar(50) DEFAULT NULL
  created_at?: Date | null; // timestamp NULL DEFAULT NULL
  updated_at?: Date | null; // timestamp NULL DEFAULT NULL
}