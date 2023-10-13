"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatarNumero = void 0;
const moment_1 = __importDefault(require("moment"));
function formatarNumero(numero) {
    // Converte para número (se for uma string)
    const valorNumerico = typeof numero === 'string' ? parseFloat(numero) : numero;
    // Verifica se é um número válido
    if (!isNaN(valorNumerico)) {
        // Cria um objeto Moment a partir do valor numérico
        const valorMoment = (0, moment_1.default)(valorNumerico);
        // Formata o valor com duas casas decimais
        const valorFormatado = valorMoment.format('0,0.00');
        return valorFormatado;
    }
    else {
        return "Valor inválido";
    }
}
exports.formatarNumero = formatarNumero;
