import { fetchWrapper } from "@/utils/helpers/fetch-wrapper";

export interface Fornecedor {
    id: number;
    nome: string;
    ativo?: boolean; // tinyint(1) DEFAULT '1'
    created_at: Date; // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
    updated_at: Date; // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    user_id_created?: number | null; // bigint unsigned DEFAULT NULL
    user_id_updated?: number | null; // bigint unsigned DEFAULT NULL
    user_id_deleted?: number | null; // bigint unsigned DEFAULT NULL
    motivo_alteracao?: string | null; // varchar(155) DEFAULT NULL
    cnpj_cpf?: string | null; // varchar(50) DEFAULT NULL
    inscricao_estadual?: string | null; // varchar(50) DEFAULT NULL
    endereco?: string | null; // varchar(100) DEFAULT NULL
    numero?: string | null; // varchar(100) DEFAULT NULL
    bairro?: string | null; // varchar(100) DEFAULT NULL
    cep?: string | null; // varchar(12) DEFAULT NULL
    municipio?: string | null; // varchar(50) DEFAULT NULL
    matricula_erp?: string | null; // varchar(100) DEFAULT NULL
    uf?: string | null; // varchar(3) DEFAULT NULL
    permite_agendamento: boolean; // tinyint NOT NULL DEFAULT '1'
}

export async function getFornecedorNomeById(id: number, fornecedorList: Fornecedor[]): Promise<string> {
    const fornecedor = fornecedorList.find(fornecedor => fornecedor.id === id);
    return fornecedor ? fornecedor.nome + ' - ' + fornecedor.cnpj_cpf : '';
}

export function getFornecedorEmpyt() {
    var fornecedorEmpyt: Fornecedor = {
        id: 0,
        nome: '',
        ativo: false,
        created_at: new Date(),
        updated_at: new Date(),
        user_id_created: null,
        user_id_updated: null,
        user_id_deleted: null,
        motivo_alteracao: null,
        cnpj_cpf: null,
        inscricao_estadual: null,
        endereco: null,
        numero: null,
        bairro: null,
        cep: null,
        municipio: null,
        matricula_erp: null,
        uf: null,
        permite_agendamento: false
    };
    return fornecedorEmpyt;

}

export async function getFornecedorById(id: number): Promise<Fornecedor> {


    try {
        const response = await fetchWrapper.get('cadastros_basicos/fornecedor/' + id);
        return response;
    } catch (e) {
        console.error('Erro ao buscar a lista de fornecedores:', e);
        return getFornecedorEmpyt();
    }
}

export async function getFornecedorList(): Promise<Fornecedor[]> {
    try {
        const response = await fetchWrapper.get('cadastros_basicos/fornecedor');
        const fornecedorList: Fornecedor[] = response.map((fornecedor: any) => {
            return {
                id: fornecedor.id,
                nome: fornecedor.nome,
                ativo: fornecedor.ativo,
                created_at: new Date(fornecedor.created_at),
                updated_at: new Date(fornecedor.updated_at),
                user_id_created: fornecedor.user_id_created,
                user_id_updated: fornecedor.user_id_updated,
                user_id_deleted: fornecedor.user_id_deleted,
                motivo_alteracao: fornecedor.motivo_alteracao,
                cnpj_cpf: fornecedor.cnpj_cpf,
                endereco: fornecedor.endereco,
                numero: fornecedor.numero,
                inscricao_estadual: fornecedor.inscricao_estadual,
                bairro: fornecedor.bairro,
                cep: fornecedor.cep,
                municipio: fornecedor.municipio,
                matricula_erp: fornecedor.matricula_erp,
                uf: fornecedor.uf,
                permite_agendamento: fornecedor.permite_agendamento
            };
        });
        return fornecedorList;
    } catch (error) {
        console.error('Erro ao buscar a lista de fornecedores:', error);
        return [];
    }
}