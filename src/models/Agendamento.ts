export interface Agendamento {
  id: number;
  data_agendamento?: Date; // timestamp NULL DEFAULT CURRENT_TIMESTAMP
  data_entrega: Date; // date NOT NULL
  periodo_dia?: string | null; // varchar(20) DEFAULT NULL
  horario?: string | null; // time DEFAULT NULL
  status_id?: number | null; // int DEFAULT NULL
  tipo_agendamento?: string | null; // varchar(20) DEFAULT NULL
  volume_total?: number | null; // decimal(10,2) DEFAULT NULL
  quantidade_total?: number | null; // int DEFAULT NULL
  fornecedor_id?: number | null; // int DEFAULT NULL
  pedido_id?: number | null; // int DEFAULT NULL
  doca_id?: number | null; // int DEFAULT NULL
}