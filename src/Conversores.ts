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
            anoFabricacao: registro.ANO_FABRICACAO,
            idAeroportoAeronave: registro.ID_AEROPORTO_AERONAVE,
            linhasAssentos: registro.LINHAS_ASSENTO,
            colunasAssentos: registro.COLUNAS_ASSENTO,
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
            nomeCidade: registro.NOME_CIDADE,
            uf: registro.UF
        } as Aeroporto;

        // inserindo o novo Array convertido.
        aeroportos.push(aeroporto);
        })
    }
  return aeroportos;
}