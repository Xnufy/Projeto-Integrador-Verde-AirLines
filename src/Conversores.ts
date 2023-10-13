import { Aeroporto } from "./Aeroporto";
import { Aeronave } from "./Aeronave";
import { Voo } from "./Voo";

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
    console.log(oracleRows)
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

export function rowsToVoos(oracleRows: unknown[] | undefined) : Array<Voo> {
    // vamos converter um array any (resultados do oracle)
    // em um array de Aeroporto
    let voos: Array<Voo> = [];
    let voo;
    if (oracleRows !== undefined){
        oracleRows.forEach((registro: any) => {
        voo = {
            idVoo: registro.ID_VOO,
            saidaVoo: registro.SAIDA_VOO,
            chegadaVoo: registro.CHEGADA_VOO,
            data: registro.DATA,
            valor: registro.VALOR,
        } as Voo;

        // inserindo o novo Array convertido.
        voos.push(voo);
        })
    }

    return voos;
}