export default interface  Cabecalho {
    id: number;
    mes: string;
    ano: string;
    detalhes: null | any; // Altere para o tipo apropriado, se possível
    arquivo_importado_dir: string;
    proc_status: number;
    proc_erro: null | string; // Altere para o tipo apropriado, se possível
    filename_original: string;
    user_create: number;
    user_edit: number;
    created_at: string;
    fechamento_dt: string | null;
    fechamento_user_id: number | null;
    updated_at: string;
    prm_fiscal_variaveis: null | any; // Altere para o tipo apropriado, se possível
    valor_icms_debitado: string;
    valor_estorno_icms: string;
    total_icms_recolher: string;
    saldo_credor_anterior: string;
    icms_creditado: string;
    icms_debitado: string;
    saldo_icms: string;
    valor_credito_estimulo: string;
    icms_nao_incentivado: string;
    valor_credito_FMPES: string;
    valor_credito_UEA: string;
    total_impostos_estaduais: string;
}
