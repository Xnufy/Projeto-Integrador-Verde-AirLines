import { Aeroporto } from "./Aeroporto";
import { Aeronave } from "./Aeronave";

export function rowsToAeronaves(oracleRows: unknown[] | undefined) : Array<Aeronave> {
    let aeronaves: Array <Aeronave> = [];
    let aeronave;
    if(oracleRows !== undefined) {
        oracleRows.forEach((registro: any) => {
        aeronave = {
            idAeronave: registro.ID_AERONAVE,
            modelo: registro.MODELO,
            fabricante: registro.FABRICANTE,
            anoFabricacao: registro.FABRICANTE,
            linhasAssentos: registro.LINHAS_ASSENTOS,
            colunasAssentos: registro.COLUNAS_ASSENTOS,
            registro: registro.REGISTRO
        } as Aeronave;

        aeronaves.push(aeronave);
        });
    }
    return aeronaves;
}

export function rowsToAeroportos(oracleRows: unknown[] | undefined) : Array<Aeroporto> {
    // vamos converter um array any (resultados do oracle)
    // em um array de Aeroporto
    let aeroportos: Array<Aeroporto> = [];
    let aeroporto;
    if (oracleRows !== undefined){
        oracleRows.forEach((registro: any) => {
        aeroporto = {
            idAeroporto: registro.ID_AEROPORTO,
            sigla: registro.SIGLA,
            nomeAeroporto: registro.NOME_AEROPORTO,
            nomeCidade: registro.NOME_CIDADE
        } as Aeroporto;

        // inserindo o novo Array convertido.
        aeroportos.push(aeroporto);
        })
    }
  return aeroportos;
}