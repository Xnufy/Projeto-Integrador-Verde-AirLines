import { Aeroporto } from "./Aeroporto";

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