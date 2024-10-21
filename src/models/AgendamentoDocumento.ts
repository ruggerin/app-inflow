export interface AgendamentoDocumento {
    id: number;
    pedido_id?: string | null; // varchar(50) DEFAULT NULL
    numnota?: string | null; // varchar(50) DEFAULT NULL
    serie?: number | null; // int DEFAULT NULL
    chave_nf?: string | null; // varchar(255) DEFAULT NULL
    observacoes?: string | null; // text
    usuario_id: number; // bigint NOT NULL
    fornecedor_id: number; // bigint NOT NULL
    created_at?: Date | null; // timestamp NULL DEFAULT NULL
    updated_at?: Date | null; // timestamp NULL DEFAULT NULL
    tipo_documento?: string | null; // varchar(100) DEFAULT NULL
    dt_emissao?: Date | null; // date DEFAULT NULL
    volumes: number | null;
}