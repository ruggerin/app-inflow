export default interface EntradasCredito {
    totals: number;
    details: EntradaCreditoDetail[];
}

interface EntradaCreditoDetail {
    cfop: number;
    descricao: string;
    PERC_ICMS: number;
    entrada_saida_aux: string;
    sub_total: number;
    base_calculo: number;
    vlr_icms: number;
}