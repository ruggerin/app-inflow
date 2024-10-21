export interface HorarioDisponivel {
    id: number;
    diasemana: string;
    hora_inicial: string;
    hora_final: string;
    created_at: string;
    updated_at: string;
    disponivel: boolean;
    docas: number[] ;
}