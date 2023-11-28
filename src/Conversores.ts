import { Aeroporto } from "./Aeroporto";
import { Aeronave } from "./Aeronave";
import { ListarVoo } from "./ListarVoos";
import { Trecho } from "./Trecho"
import { ListarTrecho } from "./ListarTrecho"
import { ListarAssentos } from "./ListarMapaAssentos";
import { Reserva } from "./Reserva";
import { Cliente } from "./Cliente";

export function rowsToAeronaves(oracleRows: unknown[] | undefined): Array<Aeronave> {
    let aeronaves: Array<Aeronave> = [];
    let aeronave;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro: any) => {
            aeronave = {
                idAeronave: registro.ID_AERONAVE,
                modelo: registro.MODELO,
                fabricante: registro.FABRICANTE,
                anoFabricacao: registro.ANO_FABRICACAO,
                linhasAssentos: registro.LINHAS_ASSENTO,
                colunasAssentos: registro.COLUNAS_ASSENTO,
                registro: registro.REGISTRO
            } as Aeronave;

            aeronaves.push(aeronave);
        });
    }
    return aeronaves;
}

export function rowsToAeroportos(oracleRows: unknown[] | undefined): Array<Aeroporto> {
    // vamos converter um array any (resultados do oracle)
    // em um array de Aeroporto
    let aeroportos: Array<Aeroporto> = [];
    let aeroporto;
    if (oracleRows !== undefined) {
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


export function rowsToListarVoos(oracleRows: unknown[] | undefined): Array<ListarVoo> {
    // vamos converter um array any (resultados do oracle)
    // em um array de Aeroporto
    let voos: Array<ListarVoo> = [];
    let voo;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro: any) => {
            voo = {
              idVoo: registro.ID_VOO,
              numAssento: registro.NUMASSENTO,
              numVoo: registro.NUM_VOOS,
              trecho: registro.ID_TRECHO,
              nomeSaidaVoo: registro.NOME_AEROPORTO_PARTIDA,
              cidade_aeroporto_partida: registro.CIDADE_AEROPORTO_PARTIDA,
              sigla_aeroporto_partida: registro.SIGLA_AEROPORTO_PARTIDA,
              nomeChegadaVoo: registro.NOME_AEROPORTO_CHEGADA,
              cidade_aeroporto_chegada: registro.CIDADE_AEROPORTO_CHEGADA,
              sigla_aeroporto_chegada: registro.SIGLA_AEROPORTO_CHEGADA,
              data_partida: registro.DATA_VOO_PARTIDA,
              data_chegada: registro.DATA_VOO_CHEGADA,
              valor: registro.VALOR,
              horaPartida: registro.HORARIO_PARTIDA,
              horaChegada: registro.HORARIO_CHEGADA,
              registro: registro.REGISTRO,
              idAeronave: registro.ID_AERONAVE,
            } as ListarVoo;

            // inserindo o novo Array convertido.
            voos.push(voo);
        })
    }

    return voos;
}
export function rowsToTrecho(oracleRows: unknown[] | undefined): Array<Trecho> {
    let trechos: Array<Trecho> = [];
    let trecho;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro: any) => {
            trecho = {
                idTrecho: registro.ID_TRECHO,
                origem: registro.ID_LOCAL_PARTIDA,
                destino: registro.ID_LOCAL_CHEGADA
            } as Trecho;

            trechos.push(trecho);
        });
    }
    return trechos;
}

export function rowsToListarTrecho(oracleRows: unknown[] | undefined): Array<ListarTrecho> {
    let listaTrechos: Array<ListarTrecho> = [];
    let listaTrecho;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro: any) => {
            listaTrecho = {
                idTrecho: registro.ID_TRECHO,
                nomeAeroportoOrigem: registro.NOME_PARTIDA,
                nomeAeroportoDestino: registro.NOME_CHEGADA,
            } as ListarTrecho;

            listaTrechos.push(listaTrecho);
        });
    }
    return listaTrechos;
}

export function rowsToListarAssentos(oracleRows: unknown[] | undefined): Array<ListarAssentos> {
    let listarAssentos: Array<ListarAssentos> = [];
    let listarAssento;
    if (oracleRows !== undefined) {
        oracleRows.forEach((registro: any) => {
            listarAssento = {
                idMapaAssento: registro.ID_ASSENTO_MAPA,
                numVoo: registro.NUM_VOO,
                numAssentoCliente: registro.NUM_ASSENTO_CLIENTE,
                referenciaAssento: registro.REF_ASSENTO,
                statusAsssento: registro.STATUS,
                ticket: registro.TICKET,
                valor: registro.VALOR,
                numLinhasAssento: registro.LINHAS_ASSENTO,
                numColunasAssento: registro.COLUNAS_ASSENTO,
            } as ListarAssentos;

            listarAssentos.push(listarAssento);
        });
    }
    return listarAssentos;
}

export function rowsToReserva(oracleRows: unknown[] | undefined): Array<Reserva> {
  let reservas: Array<Reserva> = [];
  let reserva;
  if (oracleRows !== undefined) {
    oracleRows.forEach((registro: any) => {
      reserva = {
        sequence: registro.NUMSEQ,
        idCliente: registro.ID_CLIENTE,
      } as Reserva;

      reservas.push(reserva);
    });
  }
  return reservas;
}


export function rowsToCliente(
  oracleRows: unknown[] | undefined
): Array<Reserva> {
  let clientes: Array<Cliente> = [];
  let cliente;
  if (oracleRows !== undefined) {
    oracleRows.forEach((registro: any) => {
      cliente = {
        idCliente: registro.ID_CLIENTE,
        cpfCliente: registro.CPF,
        nomeCliente: registro.NOME,
        emailCliente: registro.EMAIL,
        formaPagamento: registro.FORMA_PAGAMENTO,
      } as Cliente;

      clientes.push(cliente);
    });
  }
  return clientes;
}