"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rowsToAeroportos = void 0;
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
