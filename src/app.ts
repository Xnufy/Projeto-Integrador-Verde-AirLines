import express from "express";
import oracledb from "oracledb";
import dotenv from "dotenv";
import cors from "cors";

import { CustomResponse } from "./CustomResponse";
import { Aeroporto } from "./Aeroporto";
import { Aeronave } from "./Aeronave";

import { oraConnAttribs } from "./conexaoOracle";

import { rowsToAeronaves, rowsToAeroportos } from "./Conversores";

import { aeroportoValida } from "./Validadores";
import { aeronaveValida } from "./Validadores";

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

app.delete("/excluirAeronave", async (req, res)=> {
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
    if(rowsDeleted !== undefined && rowsDeleted === 1) {
      cr.status = "SUCCESS";
      cr.messagem = "Aeronave excluída.";
    } else
      cr.messagem = "Aeronave não excluída. Verifique se o ID da aeronave está correto";
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
      if(rowFetched !== undefined && rowFetched.length === 1) {
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
  console.log(aeronave);

  let[valida, mensagem] = aeronaveValida(aeronave);
  if(!valida) {
    cr.messagem = mensagem;
    res.send(cr);
  } 
  else {
    let connection;

    try {
      connection = await oracledb.getConnection(oraConnAttribs);

      const alterarAeronave = 
      `UPDATE AERONAVES SET MODELO = :1, FABRICANTE = :2, ANO_FABRICACAO = :3, ID_AEROPORTO_AERONAVE = :4, LINHAS_ASSENTO = :5, COLUNAS_ASSENTO = :6, REGISTRO = :7
      WHERE ID_AERONAVE = ${idAeronave}`;
  
      const dados = [aeronave.modelo, aeronave.fabricante, aeronave.anoFabricacao, aeronave.idAeroportoAeronave, aeronave.linhasAssentos, aeronave.colunasAssentos, aeronave.registro];
  
      let resUpdate = await connection.execute(alterarAeronave, dados);
  
      // COMMIT DA ATUALIZAÇÃO DE DADOS
      await connection.commit();
  
      const rowsUpdated = resUpdate.rowsAffected;
      if(rowsUpdated !== undefined && rowsUpdated === 1) {
        cr.status = "SUCCESS";
        cr.messagem = "Aeronave alterada.";
        console.log("Aeronave atualizada.")
      } else
        cr.messagem = "Aeronave não alterada. Verifique se o ID da aeronave está correto";
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
      (ID_AEROPORTO, SIGLA, NOME_AEROPORTO, NOME_COMPANHIA, NOME_CIDADE, UF)
      VALUES
      (SEQ_AEROPORTOS.NEXTVAL, :1, :2, 'Verde Airlines', :3, :4)`;
      
      const dados = [aeroporto.sigla, aeroporto.nomeAeroporto, aeroporto.nomeCidade, aeroporto.uf];

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
      `UPDATE AEROPORTO SET SIGLA = :1, NOME_AEROPORTO = :2, NOME_CIDADE = :3, UF = :4
      WHERE ID_AEROPORTO = ${idAeroporto}`;
  
      const dados = [aeroporto.sigla, aeroporto.nomeAeroporto, aeroporto.nomeCidade, aeroporto.uf];
  
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

app.listen(port, () => {
  console.log("Servidor HTTP rodando...");
});