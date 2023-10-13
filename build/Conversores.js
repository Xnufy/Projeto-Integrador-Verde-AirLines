"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rowsToAeroportos = exports.rowsToAeronaves = void 0;
function rowsToAeronaves(oracleRows) {
    let aeronaves = [];
    let aeronave;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            aeronave = {
                idAeronave: registro.ID_AERONAVE,
                modelo: registro.MODELO,
                fabricante: registro.FABRICANTE,
                anoFabricacao: registro.FABRICANTE,
                linhasAssentos: registro.LINHAS_ASSENTOS,
                colunasAssentos: registro.COLUNAS_ASSENTOS,
                registro: registro.REGISTRO
            };
            aeronaves.push(aeronave);
        });
    }
    return aeronaves;
}
exports.rowsToAeronaves = rowsToAeronaves;
function rowsToAeroportos(oracleRows) {
    // vamos converter um array any (resultados do oracle)
    // em um array de Aeroporto
    let aeroportos = [];
    let aeroporto;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro) => {
            aeroporto = {
                idAeroporto: registro.ID_AEROPORTO,
                sigla: registro.SIGLA,
                nomeAeroporto: registro.NOME_AEROPORTO,
                nomeCidade: registro.NOME_CIDADE
            };
            // inserindo o novo Array convertido.
            aeroportos.push(aeroporto);
        });
    }
    return aeroportos;
}
exports.rowsToAeroportos = rowsToAeroportos;
