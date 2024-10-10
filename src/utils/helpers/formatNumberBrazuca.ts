const dinheiroReal = (valor: number | undefined) => {
    // Verifica se o valor está definido


    if (valor !== undefined) {
        // Usando o método toLocaleString para formatar o número em reais
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    } else {
        // Retorna "--" se o valor for undefined
        return '--';
    }
};



const percentual = (valor: number | undefined) => {
    // Verifica se o valor está definido
    if (valor !== undefined) {
        return valor.toFixed(2).replace('.', ','); // Fixa em duas casas decimais e substitui o ponto por vírgula
    } else {
        return '--';
    }
};
export { dinheiroReal, percentual };