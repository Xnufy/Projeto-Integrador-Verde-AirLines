import express from "express";
import oracledb from "oracledb";
import dotenv from "dotenv";
import cors from "cors";
import moment from 'moment';

import { CustomResponse } from "./CustomResponse";
import { Aeroporto } from "./Aeroporto";
import { Aeronave } from "./Aeronave";
import { Trecho } from "./Trecho";

import { oraConnAttribs } from "./conexaoOracle";

import { rowsToAeronaves, rowsToAeroportos, rowsToTrecho, rowsToListarTrecho, rowsToListarVoos } from "./Conversores";

import { aeroportoValida, aeroportoVoo, trechoValido } from "./Validadores";
import { aeronaveValida } from "./Validadores";
import { ListarVoo } from "./ListarVoos";


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // { origin: 'http://127.0.0.1:5500' }

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

//
//    REQUISIÇÕES AERONAVE
//

// LISTAR AERONAVES
app.get("/listarAeronaves", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);

    let resultadoConsulta = await connection.execute(`SELECT * FROM AERONAVES`);

    cr.status = "SUCCESS";
    cr.messagem = "Dados obtidos";
    cr.payload = (rowsToAeronaves(resultadoConsulta.rows));
  }
  catch (e) {
    if (e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else
      cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
  }
  finally {
    if (connection !== undefined)
      await connection.close();

    res.send(cr);
  }
});

// CADASTRAR AERONAVES
app.put("/inserirAeronave", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  const aeronave: Aeronave = req.body as Aeronave;

  let [valida, mensagem] = aeronaveValida(aeronave);
  if (!valida) {
    cr.messagem = mensagem;
    res.send(cr);
  }
  else {
    let connection;
    try {
      const inserirAeronave =
        `INSERT INTO AERONAVES
      (ID_AERONAVE, MODELO, FABRICANTE, ANO_FABRICACAO, LINHAS_ASSENTO, COLUNAS_ASSENTO, REGISTRO)
      VALUES
      (SEQ_AERONAVES.NEXTVAL, :1, :2, :3, :4, :5, :6)`;

      const dados =
        [aeronave.modelo, aeronave.fabricante, aeronave.anoFabricacao, aeronave.linhasAssentos, aeronave.colunasAssentos, aeronave.registro];

      connection = await oracledb.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(inserirAeronave, dados);

      // COMMIT DA INSERÇÃO DE DADOS
      await connection.commit();

      const rowsInserted = resInsert.rowsAffected;
      if (rowsInserted !== undefined && rowsInserted === 1) {
        cr.status = "SUCCESS";
        cr.messagem = "Aeronave Inserida";
      }
    }
    catch (e) {
      if (e instanceof Error) {
        cr.messagem = e.message;
        console.log(e.message);
      } else
        cr.messagem = "Erro ao conectar ao oracle. Sem detalhes.";
    }
    finally {
      if (connection !== undefined)
        await connection.close();
      res.send(cr);
    }
  }
});

app.delete("/excluirAeronave", async (req, res) => {
  const idAeronave = req.body.idAeronave as number;

  console.log("Id da Aeronave recebido: " + idAeronave);

  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);
    const deletarAeronave = `DELETE AERONAVES WHERE ID_AERONAVE = :1`
    const dados = [idAeronave];

    let resDelete = await connection.execute(deletarAeronave, dados);

    // COMMIT DA DELEÇÃO DE DADOS
    await connection.commit();

    const rowsDeleted = resDelete.rowsAffected;
    if (rowsDeleted !== undefined && rowsDeleted === 1) {
      cr.status = "SUCCESS";
      cr.messagem = "Aeronave excluída.";
    } else
      cr.messagem = "Aeronave não excluída. Verifique se o ID da aeronave está correto";
  }
  catch (e) {
    if (e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else
      cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
  }
  finally {
    if (connection !== undefined)
      await connection.close();

    res.send(cr);
  }
});

app.get("/listarAeronave/:idAeronave", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);

    // Parametro recebido na URL
    const idAeronave = req.params.idAeronave;

    let resultadoConsulta = await connection.execute(`SELECT * FROM AERONAVES WHERE ID_AERONAVE = ${idAeronave}`);

    const rowFetched = rowsToAeroportos(resultadoConsulta.rows);
    if (rowFetched !== undefined && rowFetched.length === 1) {
      cr.status = "SUCCESS";
      cr.messagem = "Aeronave encontrada";
      cr.payload = rowsToAeronaves(resultadoConsulta.rows);

    } else
      cr.messagem = "Aeronave não encontrada. Verifique se o ID da aeronave está correto";

  }
  catch (e) {
    if (e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else {
      cr.messagem = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  }
  finally {
    if (connection !== undefined) await connection.close();

    res.send(cr);
  }
});

app.put("/alterarAeronave/:idAeronave", async (req, res) => {
  const idAeronave = req.params.idAeronave;
  console.log("Id da Aeronave recebido: " + idAeronave);

  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  const aeronave: Aeronave = req.body as Aeronave;

  let [valida, mensagem] = aeronaveValida(aeronave);
  if (!valida) {
    cr.messagem = mensagem;
    res.send(cr);
  }
  else {
    let connection;

    try {
      connection = await oracledb.getConnection(oraConnAttribs);

      const alterarAeronave =
        `UPDATE AERONAVES SET MODELO = :1, FABRICANTE = :2, ANO_FABRICACAO = :3, LINHAS_ASSENTO = :4, COLUNAS_ASSENTO = :5, REGISTRO = :6
      WHERE ID_AERONAVE = ${idAeronave}`;

      const dados = [aeronave.modelo, aeronave.fabricante, aeronave.anoFabricacao, aeronave.linhasAssentos, aeronave.colunasAssentos, aeronave.registro];

      let resUpdate = await connection.execute(alterarAeronave, dados);

      // COMMIT DA ATUALIZAÇÃO DE DADOS
      await connection.commit();

      const rowsUpdated = resUpdate.rowsAffected;
      if (rowsUpdated !== undefined && rowsUpdated === 1) {
        cr.status = "SUCCESS";
        cr.messagem = "Aeronave alterada.";
        console.log("Aeronave atualizada.")
      } else
        cr.messagem = "Aeronave não alterada. Verifique se o ID da aeronave está correto";
    }
    catch (e) {
      if (e instanceof Error) {
        cr.messagem = e.message;
        console.log(e.message);
      } else
        cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
    }
    finally {
      if (connection !== undefined)
        await connection.close();

      res.send(cr);
    }
  }
});

//
//    SERVIÇOS AEROPORTO
//

app.get("/listarAeroportos", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);

    let resultadoConsulta = await connection.execute(`SELECT * FROM AEROPORTO`);

    cr.status = "SUCCESS";
    cr.messagem = "Dados obtidos";
    cr.payload = (rowsToAeroportos(resultadoConsulta.rows));
  }
  catch (e) {
    if (e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else
      cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
  }
  finally {
    if (connection !== undefined)
      await connection.close();

    res.send(cr);
  }
});

app.put("/inserirAeroporto", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  const aeroporto: Aeroporto = req.body as Aeroporto;

  let [valida, mensagem] = aeroportoValida(aeroporto);
  if (!valida) {
    cr.messagem = mensagem;
    res.send(cr);
  }
  else {
    let connection;
    try {
      const inserirAeroporto =
        `INSERT INTO AEROPORTO
      (ID_AEROPORTO, SIGLA, NOME_AEROPORTO, NOME_COMPANHIA, NOME_CIDADE, UF)
      VALUES
      (SEQ_AEROPORTOS.NEXTVAL, :1, :2, 'Verde Airlines', :3, :4)`;

      const dados = [aeroporto.sigla, aeroporto.nomeAeroporto, aeroporto.nomeCidade, aeroporto.uf];

      connection = await oracledb.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(inserirAeroporto, dados);

      // COMMIT DA INSERÇÃO DE DADOS
      await connection.commit();

      const rowsInserted = resInsert.rowsAffected;
      if (rowsInserted !== undefined && rowsInserted === 1) {
        cr.status = "SUCCESS";
        cr.messagem = "Aeroporto Inserido";
      }
    }
    catch (e) {
      if (e instanceof Error) {
        cr.messagem = e.message;
        console.log(e.message);
      } else
        cr.messagem = "Erro ao conectar ao oracle. Sem detalhes.";
    }
    finally {
      if (connection !== undefined)
        await connection.close();
      res.send(cr);
    }
  }
});

app.delete("/excluirAeroporto", async (req, res) => {
  const idAeroporto = req.body.idAeroporto as number;

  console.log("Id do Aeroporto recebido: " + idAeroporto);

  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);
    const deletarAeroporto = `DELETE AEROPORTO WHERE ID_AEROPORTO = :1`
    const dados = [idAeroporto];

    let resDelete = await connection.execute(deletarAeroporto, dados);

    // COMMIT DA DELEÇÃO DE DADOS
    await connection.commit();

    const rowsDeleted = resDelete.rowsAffected;
    if (rowsDeleted !== undefined && rowsDeleted === 1) {
      cr.status = "SUCCESS";
      cr.messagem = "Aeroporto excluído.";
    } else
      cr.messagem = "Aeroporto não excluído. Verifique se o ID do aeroporto está correto";
  }
  catch (e) {
    if (e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else
      cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
  }
  finally {
    if (connection !== undefined)
      await connection.close();

    res.send(cr);
  }
});

app.get("/listarAeroporto/:idAeroporto", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);

    // Parametro recebido na URL
    const idAeroporto = req.params.idAeroporto;

    let resultadoConsulta = await connection.execute(`SELECT * FROM AEROPORTO WHERE ID_AEROPORTO = ${idAeroporto}`);

    const rowFetched = rowsToAeroportos(resultadoConsulta.rows);
    if (rowFetched !== undefined && rowFetched.length === 1) {
      cr.status = "SUCCESS";
      cr.messagem = "Aeroporto encontrado";
      cr.payload = rowsToAeroportos(resultadoConsulta.rows);

    } else
      cr.messagem = "Aeroporto não encontrado. Verifique se o ID do aeroporto está correto";

  }
  catch (e) {
    if (e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else {
      cr.messagem = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  }
  finally {
    if (connection !== undefined) await connection.close();

    res.send(cr);
  }
});

app.put("/alterarAeroporto/:idAeroporto", async (req, res) => {
  const idAeroporto = req.params.idAeroporto;
  console.log("Id do Aeroporto recebido: " + idAeroporto);

  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  const aeroporto: Aeroporto = req.body as Aeroporto;

  let [valida, mensagem] = aeroportoValida(aeroporto);
  if (!valida) {
    cr.messagem = mensagem;
    res.send(cr);
  }
  else {
    let connection;

    try {
      connection = await oracledb.getConnection(oraConnAttribs);

      const alterarAeroporto =
        `UPDATE AEROPORTO SET SIGLA = :1, NOME_AEROPORTO = :2, NOME_CIDADE = :3, UF = :4
      WHERE ID_AEROPORTO = ${idAeroporto}`;

      const dados = [aeroporto.sigla, aeroporto.nomeAeroporto, aeroporto.nomeCidade, aeroporto.uf];

      let resUpdate = await connection.execute(alterarAeroporto, dados);

      // COMMIT DA ATUALIZAÇÃO DE DADOS
      await connection.commit();

      const rowsUpdated = resUpdate.rowsAffected;
      if (rowsUpdated !== undefined && rowsUpdated === 1) {
        cr.status = "SUCCESS";
        cr.messagem = "Aeroporto alterado.";
        console.log("Aeroporto atualizado.")
      } else
        cr.messagem = "Aeroporto não alterado. Verifique se o ID do aeroporto está correto";
    }
    catch (e) {
      if (e instanceof Error) {
        cr.messagem = e.message;
        console.log(e.message);
      } else
        cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
    }
    finally {
      if (connection !== undefined)
        await connection.close();

      res.send(cr);
    }
  }
});

///VOOS

app.put("/inserirVoo", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  const voo: ListarVoo = req.body as ListarVoo;

  let [valida, mensagem] = aeroportoVoo(voo);
  if (!valida) {
    cr.messagem = mensagem;
    res.send(cr);
  }
  else {
    let connection;
    try {
      const inserirVoo = `INSERT INTO VOOS(ID_VOO, ID_TRECHO, DATA_VOO_PARTIDA, HORARIO_PARTIDA,
      DATA_VOO_CHEGADA, HORARIO_CHEGADA, NUMERO_AVIAO, VALOR)
      VALUES
      (SEQ_VOOS.NEXTVAL,:2,:3,:4,:5,:6,:7,:8)`;

      //Formata o tipo da data.
      const new_date_partida = moment(voo.data_partida, 'YYYY-MM-DD').format('DD/MM/YYYY');
      const new_date_chegada = moment(voo.data_chegada, 'YYYY-MM-DD').format('DD/MM/YYYY');

      const dados = [voo.trecho, new_date_partida, voo.horaPartida,new_date_chegada, voo.horaChegada, voo.idAeronave, voo.valor?.toFixed(2)];

      connection = await oracledb.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(inserirVoo, dados);

      // COMMIT DA INSERÇÃO DE DADOS
      await connection.commit();

      const rowsInserted = resInsert.rowsAffected;
      if (rowsInserted !== undefined && rowsInserted === 1) {
        cr.status = "SUCCESS";
        cr.messagem = "Voo Inserido";
      }
    }
    catch (e) {
      if (e instanceof Error) {
        cr.messagem = e.message;
        console.log(e.message);
      } else
        cr.messagem = "Erro ao conectar ao oracle. Sem detalhes.";
    }
    finally {
      if (connection !== undefined)
        await connection.close();
      res.send(cr);
    }
  }
});

app.put("/alterarVoo/:idVoo", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  const idVoo = req.params.idVoo;

  const voo: ListarVoo = req.body as ListarVoo;

  let [valida, mensagem] = aeroportoVoo(voo);
  if (!valida) {
    cr.messagem = mensagem;
    res.send(cr);
  }
  else {
    let connection;
    try {
      const inserirVoo = `UPDATE VOOS SET ID_TRECHO = :1, DATA_VOO_PARTIDA = :2, HORARIO_PARTIDA = :3,
      DATA_VOO_CHEGADA = :4, HORARIO_CHEGADA = :5, NUMERO_AVIAO = :6, VALOR = :7 WHERE ID_VOO = ${idVoo}`;



      //Formata o tipo da data.
      const new_date_partida = moment(voo.data_partida, 'YYYY-MM-DD').format('DD/MM/YYYY');
      const new_date_chegada = moment(voo.data_chegada, 'YYYY-MM-DD').format('DD/MM/YYYY');

      const dados = [voo.trecho, new_date_partida, voo.horaPartida,new_date_chegada, voo.horaChegada, voo.idAeronave, voo.valor?.toFixed(2)];

      connection = await oracledb.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(inserirVoo, dados);

      // COMMIT DA INSERÇÃO DE DADOS
      await connection.commit();

      const rowsInserted = resInsert.rowsAffected;
      if (rowsInserted !== undefined && rowsInserted === 1) {
        cr.status = "SUCCESS";
        cr.messagem = "Voo Inserido";
      }
    }
    catch (e) {
      if (e instanceof Error) {
        cr.messagem = e.message;
        console.log(e.message);
      } else
        cr.messagem = "Erro ao conectar ao oracle. Sem detalhes.";
    }
    finally {
      if (connection !== undefined)
        await connection.close();
      res.send(cr);
    }
  }
});

app.get("/listarVoos/:idVoo", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);

    // Parametro recebido na URL
    const idVoo = req.params.idVoo;

    let resultadoConsulta = await connection.execute(`SELECT
      v.id_voo,
      t.id_trecho,
      a_partida.nome_aeroporto AS nome_aeroporto_partida,
      a_chegada.nome_aeroporto AS nome_aeroporto_chegada,
      v.DATA_VOO_PARTIDA,
      v.data_voo_chegada,
      v.valor,
      v.horario_partida,
      v.horario_chegada,
      aviao.registro,
      aviao.id_aeronave FROM voos v
    INNER JOIN
      trecho t ON v.id_trecho = t.id_trecho
    INNER JOIN
      aeroporto a_partida ON t.id_local_partida = a_partida.id_aeroporto
    INNER JOIN
      aeroporto a_chegada ON t.id_local_chegada = a_chegada.id_aeroporto
    JOIN 
      aeronaves aviao on v.numero_aviao = aviao.id_aeronave WHERE ID_VOO = ${idVoo}`);

    const rowFetched = rowsToListarVoos(resultadoConsulta.rows);
    if (rowFetched !== undefined && rowFetched.length === 1) {
      cr.status = "SUCCESS";
      cr.messagem = "Voo encontrado";
      cr.payload = rowsToListarVoos(resultadoConsulta.rows);
    } else
      cr.messagem = "Voo não encontrado. Verifique se o ID do voo está correto";

  }
  catch (e) {
    if (e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else {
      cr.messagem = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  }
  finally {
    if (connection !== undefined) await connection.close();

    res.send(cr);
  }
});

/**
 * Requisição para buscar a passagem pela data de ida e/ou de volta.
 * Além disso, irá verificar os aeroportos de origem e destino selecionados.
 */
app.get("/listarPassagens", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);

    // Parametro recebido na URL
    const dataVoo = req.query.dataVoo;
    const localOrigem = req.query.localOrigem;
    const localDestino = req.query.localDestino;

    let resultadoConsulta = await connection.execute(`SELECT ID_VOO, DATA_VOO_PARTIDA, PARTIDA.NOME_AEROPORTO AS nome_aeroporto_partida,
    CHEGADA.NOME_AEROPORTO AS nome_aeroporto_chegada
    FROM VOOS v
    JOIN TRECHO t ON v.ID_TRECHO  = t.ID_TRECHO
    JOIN AEROPORTO PARTIDA ON t.ID_LOCAL_PARTIDA = PARTIDA.ID_AEROPORTO  
    JOIN AEROPORTO CHEGADA ON t.ID_LOCAL_CHEGADA  = CHEGADA.ID_AEROPORTO 
    WHERE v.DATA_VOO_PARTIDA = '${dataVoo}' 
    AND PARTIDA.NOME_AEROPORTO = '${localOrigem}' 
    AND CHEGADA.NOME_AEROPORTO = '${localDestino}'`);

    const rowFetched = rowsToListarVoos(resultadoConsulta.rows);
    if (rowFetched !== undefined && rowFetched.length >= 1) {
      cr.status = "SUCCESS";
      cr.messagem = "Voo encontrado";
      cr.payload = rowsToListarVoos(resultadoConsulta.rows);
    } else
      cr.messagem = "Voo não encontrado.";

  }
  catch (e) {
    if (e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else {
      cr.messagem = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  }
  finally {
    if (connection !== undefined) await connection.close();

    res.send(cr);
  }
});


app.get("/listarVoos", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);

    let resultadoConsulta = await connection.execute(`
    SELECT
      v.id_voo,
      t.id_trecho,
      a_partida.nome_aeroporto AS nome_aeroporto_partida,
      a_chegada.nome_aeroporto AS nome_aeroporto_chegada,
      v.DATA_VOO_PARTIDA,
      v.data_voo_chegada,
      v.valor,
      v.horario_partida,
      v.horario_chegada,
      aviao.registro,
      aviao.id_aeronave FROM voos v
    INNER JOIN
      trecho t ON v.id_trecho = t.id_trecho
    INNER JOIN
      aeroporto a_partida ON t.id_local_partida = a_partida.id_aeroporto
    INNER JOIN
      aeroporto a_chegada ON t.id_local_chegada = a_chegada.id_aeroporto
    JOIN 
      aeronaves aviao on v.numero_aviao = aviao.id_aeronave
    `);

    cr.status = "SUCCESS";
    cr.messagem = "Dados obtidos";
    cr.payload = (rowsToListarVoos(resultadoConsulta.rows));
  }
  catch (e) {
    if (e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else
      cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
  }
  finally {
    if (connection !== undefined)
      await connection.close();
    res.send(cr);
  }
});

app.get("/lastIdVoo", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);

    let resultadoConsulta = await connection.execute(`SELECT * FROM VOOS`);

    cr.status = "SUCCESS";
    cr.messagem = "Dados obtidos";
    let arrayVoos = (rowsToListarVoos(resultadoConsulta.rows));

    let lastIdVoo = arrayVoos.length;
    cr.payload = lastIdVoo;
  }
  catch (e) {
    if (e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else
      cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
  }
  finally {
    if (connection !== undefined)
      await connection.close();

    res.send(cr);
  }
});

app.delete("/excluirVoo", async (req, res) => {
  const idVoo = req.body.idVoo as number;

  console.log("Id do Aeroporto recebido: " + idVoo);

  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);
    const deletarAeroporto = `DELETE VOOS WHERE ID_VOO = :1`
    const dados = [idVoo];

    let resDelete = await connection.execute(deletarAeroporto, dados);

    // COMMIT DA DELEÇÃO DE DADOS
    await connection.commit();

    const rowsDeleted = resDelete.rowsAffected;
    if (rowsDeleted !== undefined && rowsDeleted === 1) {
      cr.status = "SUCCESS";
      cr.messagem = "Voo excluído.";
    } else
      cr.messagem = "Voo não excluído. Verifique se o ID do voo está correto";
  }
  catch (e) {
    if (e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else
      cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
  }
  finally {
    if (connection !== undefined)
      await connection.close();

    res.send(cr);
  }

});

app.listen(port, () => {
  console.log("Servidor HTTP rodando...");
});



app.get("/listarTrecho", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);

    let resultadoBusca = await connection.execute(`SELECT
    t.id_trecho,
    partida.nome_aeroporto AS nome_partida,
    chegada.nome_aeroporto AS nome_chegada
FROM
    trecho t
JOIN
    aeroporto partida
    ON t.id_local_partida = partida.id_aeroporto
JOIN
    aeroporto chegada
    ON t.id_local_chegada = chegada.id_aeroporto
`);

    cr.status = "SUCCESS";
    cr.messagem = "Dados obtidos";
    cr.payload = (rowsToListarTrecho(resultadoBusca.rows));
  }
  catch (e) {
    if (e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else
      cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
  }
  finally {
    if (connection !== undefined)
      await connection.close();

    res.send(cr);
  }
});

app.get("/listarTrechos/:idTrecho", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);

    // Parametro recebido na URL
    const idTrecho = req.params.idTrecho;

    let resultadoConsulta = await connection.execute(`SELECT * FROM TRECHO WHERE ID_TRECHO = ${idTrecho}`);

    const rowFetched = rowsToTrecho(resultadoConsulta.rows);
    if (rowFetched !== undefined && rowFetched.length === 1) {
      cr.status = "SUCCESS";
      cr.messagem = "Trecho encontrado";
      cr.payload = rowsToTrecho(resultadoConsulta.rows);

    } else
      cr.messagem = "Trecho não encontrado. Verifique se o ID do trecho está correto";

  }
  catch (e) {
    if (e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else {
      cr.messagem = "Erro ao conectar ao Oracle. Sem detalhes";
    }
  }
  finally {
    if (connection !== undefined) await connection.close();

    res.send(cr);
  }
});

app.put("/inserirTrecho", async (req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  const trecho: Trecho = req.body as Trecho;

  let [valida, mensagem] = trechoValido(trecho);
  if (!valida) {
    cr.messagem = mensagem;
    res.send(cr);
  }
  else {
    let connection;
    try {
      const inserirTrecho =
        `INSERT INTO TRECHO
      (ID_TRECHO, ID_LOCAL_CHEGADA, ID_LOCAL_PARTIDA)
      VALUES
      (SEQ_TRECHO.NEXTVAL, :1, :2)`;

      const dados = [trecho.destino, trecho.origem];

      connection = await oracledb.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(inserirTrecho, dados);

      // COMMIT DA INSERÇÃO DE DADOS
      await connection.commit();

      const rowsInserted = resInsert.rowsAffected;
      if (rowsInserted !== undefined && rowsInserted === 1) {
        cr.status = "SUCCESS";
        cr.messagem = "Trecho Inserido";
      }
    }
    catch (e) {
      if (e instanceof Error) {
        cr.messagem = e.message;
        console.log(e.message);
      } else
        cr.messagem = "Erro ao conectar ao oracle. Sem detalhes.";
    }
    finally {
      if (connection !== undefined)
        await connection.close();
      res.send(cr);
    }
  }
});


app.delete("/excluirTrecho", async (req, res) => {
  const idTrecho = req.body.idTrecho as number;

  console.log("Id da Trecho recebido: " + idTrecho);

  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  let connection;
  try {
    connection = await oracledb.getConnection(oraConnAttribs);
    const deletarTrecho = `DELETE TRECHO WHERE ID_TRECHO = :1`
    const dados = [idTrecho];

    let resDelete = await connection.execute(deletarTrecho, dados);

    // COMMIT DA DELEÇÃO DE DADOS
    await connection.commit();

    const rowsDeleted = resDelete.rowsAffected;
    if (rowsDeleted !== undefined && rowsDeleted === 1) {
      cr.status = "SUCCESS";
      cr.messagem = "Trecho excluído.";
    } else
      cr.messagem = "Trecho não excluído. Verifique se o ID do Trecho está correto";
  }
  catch (e) {
    if (e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else
      cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
  }
  finally {
    if (connection !== undefined)
      await connection.close();

    res.send(cr);
  }
});

app.put("/alterarTrecho/:idTrecho", async (req, res) => {
  const idTrecho = req.params.idTrecho;
  console.log("Id do Trecho recebido: " + idTrecho);

  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  const trecho: Trecho = req.body as Trecho;

  let [valida, mensagem] = trechoValido(trecho);
  if (!valida) {
    cr.messagem = mensagem;
    res.send(cr);
  }
  else {
    let connection;

    try {
      connection = await oracledb.getConnection(oraConnAttribs);

      const alterarTrecho =
        `UPDATE TRECHO SET ID_LOCAL_CHEGADA = :1, ID_LOCAL_PARTIDA = :2 WHERE ID_TRECHO = ${idTrecho}`;

      const dados = [trecho.destino, trecho.origem];

      let resUpdate = await connection.execute(alterarTrecho, dados);

      // COMMIT DA ATUALIZAÇÃO DE DADOS
      await connection.commit();

      const rowsUpdated = resUpdate.rowsAffected;
      if (rowsUpdated !== undefined && rowsUpdated === 1) {
        cr.status = "SUCCESS";
        cr.messagem = "Trecho alterado.";
        console.log("Trecho atualizado.")
      } else
        cr.messagem = "Trecho não alterado. Verifique se o ID do trecho está correto";
    }
    catch (e) {
      if (e instanceof Error) {
        cr.messagem = e.message;
        console.log(e.message);
      } else
        cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
    }
    finally {
      if (connection !== undefined)
        await connection.close();

      res.send(cr);
    }
  }
});