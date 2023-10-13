"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aeroportoVoo = exports.aeroportoValida = exports.aeronaveValida = void 0;
// neste arquivo colocaremos TODAS as funções de validação para todo tipo de objeto. 
// diferentemente de outras linguagens, podemos fazer uma função
// que possa retornar ou um booleano, ou uma string ou um tipo não definido.
// para que isso? se retornar TRUE no final significa que deu tudo certo. 
// se retornar uma string será o código de erro. 
function aeronaveValida(aero) {
    let valida = false;
    let mensagem = "";
    if (aero.fabricante === undefined) {
        mensagem = "Fabricante não informado";
    }
    if (aero.fabricante !== 'Embraer' && aero.fabricante !== 'Airbus' && aero.fabricante !== 'Boeing') {
        mensagem = "Fabricante deve ser: Embraer, Airbus ou Boeing.";
    }
    if (aero.modelo === undefined) {
        mensagem = "Modelo não informado.";
    }
    if (aero.linhasAssentos === undefined) {
        mensagem = "Linhas de poltronas não informada";
    }
    if (aero.colunasAssentos === undefined) {
        mensagem = "Colunas de poltronas não informada";
    }
    if ((aero.linhasAssentos && aero.colunasAssentos !== undefined)
        && (aero.linhasAssentos * aero.colunasAssentos < 100 || aero.linhasAssentos * aero.colunasAssentos > 1000)) {
        mensagem = "Total de assentos é inválido";
    }
    if (aero.anoFabricacao === undefined) {
        mensagem = "Ano de fabricação não informado";
    }
    if ((aero.anoFabricacao !== undefined) && (aero.anoFabricacao < 1990 || aero.anoFabricacao > 2026)) {
        mensagem = "Ano de fabricação deve ser entre 1990 e 2026";
    }
    if (aero.registro === undefined) {
        mensagem = "Referência da aeronave não fornecida.";
    }
    // se passou em toda a validação.
    if (mensagem === "") {
        valida = true;
    }
    return [valida, mensagem];
}
exports.aeronaveValida = aeronaveValida;
function aeroportoValida(aeroporto) {
    let valida = false;
    let mensagem = "";
    if (aeroporto.sigla === undefined) {
        mensagem = "Fabricante não informado";
    }
    if (aeroporto.nomeAeroporto === undefined) {
        mensagem = "Nome do aeroporto não informado";
    }
    if (aeroporto.nomeCidade === undefined) {
        mensagem = "Nome da cidade do aeroporto não fornecida.";
    }
    if (aeroporto.uf === undefined) {
        mensagem = "UF da cidade do aeroporto não fornecida.";
    }
    // se passou em toda a validação.
    if (mensagem === "") {
        valida = true;
    }
    return [valida, mensagem];
}
exports.aeroportoValida = aeroportoValida;
function aeroportoVoo(voo) {
    let valida = false;
    let mensagem = "";
    if (voo.saidaVoo === voo.chegadaVoo) {
        mensagem = "O aeroporto de chegada não pode ser o mesmo de saída.";
    }
    // se passou em toda a validação.
    if (mensagem === "") {
        valida = true;
    }
    return [valida, mensagem];
}
exports.aeroportoVoo = aeroportoVoo;
