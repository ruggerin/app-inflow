import { AgendamentoAnexo } from './AgendamentoAnexo';
import { AgendamentoDocumento } from './AgendamentoDocumento';

export interface Agendamento {
  id: number;
  data_agendamento?: Date; // timestamp NULL DEFAULT CURRENT_TIMESTAMP
  data_entrega: Date; // date NOT NULL
  periodo_dia?: string | null; // varchar(20) DEFAULT NULL
  status_id?: number | null; // int DEFAULT NULL
  tipo_agendamento?: 'Normal' | 'Emergencial' | null; // varchar(20) DEFAULT NULL
  volume_total?: number | null; // decimal(10,2) DEFAULT NULL
  quantidade_total?: number | null; // int DEFAULT NULL
  fornecedor_id?: number | null; // int DEFAULT NULL
  pedido_id?: number | null; // int DEFAULT NULL
  doca_id?: number | null; // int DEFAULT NULL
  created_at: Date; // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
  updated_at: Date; // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  horario_inicio: string | null; // time DEFAULT NULL
  horario_fim: string | null; // time DEFAULT NULL
  user_id_created?: number | null; // bigint unsigned DEFAULT NULL
  user_id_updated?: number | null; // bigint unsigned DEFAULT NULL
  user_id_deleted?: number | null; // bigint unsigned DEFAULT NULL
  motivo_alteracao?: string | null; // varchar(155) DEFAULT NULL
  aprovacao_usuario_id?: number | null; // bigint DEFAULT NULL
  aprovacao_datahora?: Date | null; // datetime DEFAULT NULL
  obervacao_solicitante: string | null; // text
  agendamento_documentos: AgendamentoDocumento[];
  agendamento_anexos: AgendamentoAnexo[]; 
}