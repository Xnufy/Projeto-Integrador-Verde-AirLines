import express from "express";
import oracledb from "oracledb";
import dotenv from "dotenv";
import cors from "cors";
import moment from 'moment';

import { CustomResponse } from "./CustomResponse";
import { Aeroporto } from "./Aeroporto";
import { Aeronave } from "./Aeronave";

import { oraConnAttribs } from "./conexaoOracle";

import { rowsToAeronaves, rowsToAeroportos, rowsToVoos } from "./Conversores";

import { aeroportoValida, aeroportoVoo } from "./Validadores";
import { aeronaveValida } from "./Validadores";
import { Voo } from "./Voo";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // { origin: 'http://127.0.0.1:5500' }

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

//
//    REQUISIÇÕES AERONAVE
//

// LISTAR AERONAVES
app.get("/listarAeronaves", async(req, res)=>{
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
  catch(e) {
    if(e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else
      cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
  } 
  finally {
    if(connection !== undefined)
      await connection.close();

    res.send(cr);
  }
});

// CADASTRAR AERONAVES
app.put("/inserirAeronave", async (req, res)=>{
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  const aeronave: Aeronave = req.body as Aeronave;
  console.log(aeronave);

  let[valida, mensagem] = aeronaveValida(aeronave);
  if(!valida) {
    cr.messagem = mensagem;
    res.send(cr);
  } 
  else {
    let connection;
    try {
      const inserirAeronave = 
      `INSERT INTO AERONAVES
      (ID_AERONAVE, MODELO, FABRICANTE, ANO_FABRICACAO, ID_AEROPORTO_AERONAVE, LINHAS_ASSENTO, COLUNAS_ASSENTO, REGISTRO)
      VALUES
      (SEQ_AERONAVES.NEXTVAL, :1, :2, :3, :4, :5, :6, :7)`;

      const dados = 
      [aeronave.modelo, aeronave.fabricante, aeronave.anoFabricacao,
      aeronave.idAeroportoAeronave, aeronave.linhasAssentos, aeronave.colunasAssentos, aeronave.registro];

      connection = await oracledb.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(inserirAeronave, dados);
      
      // COMMIT DA INSERÇÃO DE DADOS
      await connection.commit();

      const rowsInserted = resInsert.rowsAffected;
      if(rowsInserted !== undefined && rowsInserted === 1) {
        cr.status = "SUCCESS";
        cr.messagem = "Aeronave Inserida";
      }
    }
    catch(e) {
      if(e instanceof Error) {
        cr.messagem = e.message;
        console.log(e.message);
      } else
        cr.messagem = "Erro ao conectar ao oracle. Sem detalhes.";
    }
    finally {
      if(connection !== undefined)
        await connection.close();
      res.send(cr);
    }
  }
});

app.delete("/excluirAeronave", (req, res)=>{
  // excluir aeronave no Oracle.
});


//
//    SERVIÇOS AEROPORTO
//

app.get("/listarAeroportos", async(req, res)=> {
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
  catch(e) {
    if(e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else
      cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
  } 
  finally {
    if(connection !== undefined)
      await connection.close();

    res.send(cr);
  }
});

app.put("/inserirAeroporto", async(req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  const aeroporto: Aeroporto = req.body as Aeroporto;
  console.log(aeroporto);

  let[valida, mensagem] = aeroportoValida(aeroporto);
  if(!valida) {
    cr.messagem = mensagem;
    res.send(cr);
  } 
  else {
    let connection;
    try {
      const inserirAeroporto = 
      `INSERT INTO AEROPORTO
      (ID_AEROPORTO, SIGLA, NOME_AEROPORTO, NOME_COMPANHIA, NOME_CIDADE)
      VALUES
      (SEQ_AEROPORTOS.NEXTVAL, :1, :2, 'Verde Airlines', :3)`;
      
      const dados = [aeroporto.sigla, aeroporto.nomeAeroporto, aeroporto.nomeCidade];

      connection = await oracledb.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(inserirAeroporto, dados);
      
      // COMMIT DA INSERÇÃO DE DADOS
      await connection.commit();

      const rowsInserted = resInsert.rowsAffected;
      if(rowsInserted !== undefined && rowsInserted === 1) {
        cr.status = "SUCCESS";
        cr.messagem = "Aeroporto Inserido";
      }
    }
    catch(e) {
      if(e instanceof Error) {
        cr.messagem = e.message;
        console.log(e.message);
      } else
        cr.messagem = "Erro ao conectar ao oracle. Sem detalhes.";
    }
    finally {
      if(connection !== undefined)
        await connection.close();
      res.send(cr);
    }
  }
});

app.delete("/excluirAeroporto", async(req, res) => {
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
    if(rowsDeleted !== undefined && rowsDeleted === 1) {
      cr.status = "SUCCESS";
      cr.messagem = "Aeroporto excluído.";
    } else
      cr.messagem = "Aeroporto não excluído. Verifique se o ID do aeroporto está correto";
  }
  catch(e) {
    if(e instanceof Error) {
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
      if(rowFetched !== undefined && rowFetched.length === 1) {
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
  console.log(aeroporto);

  let[valida, mensagem] = aeroportoValida(aeroporto);
  if(!valida) {
    cr.messagem = mensagem;
    res.send(cr);
  } 
  else {
    let connection;

    try {
      connection = await oracledb.getConnection(oraConnAttribs);

      const alterarAeroporto = 
      `UPDATE AEROPORTO SET SIGLA = :1, NOME_AEROPORTO = :2, NOME_CIDADE = :3
      WHERE ID_AEROPORTO = ${idAeroporto}`;
  
      const dados = [aeroporto.sigla, aeroporto.nomeAeroporto, aeroporto.nomeCidade];
  
      let resUpdate = await connection.execute(alterarAeroporto, dados);
  
      // COMMIT DA ATUALIZAÇÃO DE DADOS
      await connection.commit();
  
      const rowsUpdated = resUpdate.rowsAffected;
      if(rowsUpdated !== undefined && rowsUpdated === 1) {
        cr.status = "SUCCESS";
        cr.messagem = "Aeroporto alterado.";
        console.log("Aeroporto atualizado.")
      } else
        cr.messagem = "Aeroporto não alterado. Verifique se o ID do aeroporto está correto";
    }
    catch(e) {
      if(e instanceof Error) {
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

app.put("/inserirVoo", async(req, res) => {
  let cr: CustomResponse = {
    status: "ERROR",
    messagem: "",
    payload: undefined
  };

  const voo: Voo = req.body as Voo;
  console.log(voo);

  let[valida, mensagem] = aeroportoVoo(voo);
  if(!valida) {
    cr.messagem = mensagem;
    res.send(cr);
  } 
  else {
    let connection;
    try {
      const inserirVoo = 
      `INSERT INTO VOOS
      (ID_VOO, SAIDA_VOO, CHEGADA_VOO, DATA, VALOR)
      VALUES
      (:1,:2,:3,:4,:5)`;

      //Formata o tipo da data.
      const new_date = moment(voo.data, 'YYYY-MM-DD').format('DD/MM/YYYY');
      
      const dados = [voo.idVoo, voo.saidaVoo, voo.chegadaVoo, new_date, voo.valor?.toFixed(2)];

      connection = await oracledb.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(inserirVoo, dados);
      
      // COMMIT DA INSERÇÃO DE DADOS
      await connection.commit();

      const rowsInserted = resInsert.rowsAffected;
      if(rowsInserted !== undefined && rowsInserted === 1) {
        cr.status = "SUCCESS";
        cr.messagem = "Voo Inserido";
      }
    }
    catch(e) {
      if(e instanceof Error) {
        cr.messagem = e.message;
        console.log(e.message);
      } else
        cr.messagem = "Erro ao conectar ao oracle. Sem detalhes.";
    }
    finally {
      if(connection !== undefined)
        await connection.close();
      res.send(cr);
    }
  }
});

app.get("/listarVoos", async(req, res)=> {
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
    cr.payload = (rowsToVoos(resultadoConsulta.rows));
  }
  catch(e) {
    if(e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else
      cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
  } 
  finally {
    if(connection !== undefined)
      await connection.close();

    res.send(cr);
  }
});

app.get("/lastIdVoo", async(req, res)=> {
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
    let arrayVoos = (rowsToVoos(resultadoConsulta.rows));

    let lastIdVoo = arrayVoos.length;
    cr.payload = lastIdVoo;
  }
  catch(e) {
    if(e instanceof Error) {
      cr.messagem = e.message;
      console.log(e.message);
    } else
      cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
  } 
  finally {
    if(connection !== undefined)
      await connection.close();

    res.send(cr);
  }
});

app.delete("/excluirVoo", async(req, res) => {
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
    if(rowsDeleted !== undefined && rowsDeleted === 1) {
      cr.status = "SUCCESS";
      cr.messagem = "Voo excluído.";
    } else
      cr.messagem = "Voo não excluído. Verifique se o ID do voo está correto";
  }
  catch(e) {
    if(e instanceof Error) {
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