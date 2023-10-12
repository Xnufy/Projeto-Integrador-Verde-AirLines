import express from "express";
import oracledb from "oracledb";
import dotenv from "dotenv";
import cors from "cors";

import { CustomResponse } from "./CustomResponse";
import { Aeroporto } from "./Aeroporto";

import { oraConnAttribs } from "./conexaoOracle";

import { rowsToAeroportos } from "./Conversores";

import { aeroportoValida } from "./Validadores";


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // { origin: 'http://127.0.0.1:5500' }

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

//
//    REQUISIÇÕES AERONAVE
//

// o código fornecido será ingênuo. 
app.get("/listarAeronaves", async(req, res)=>{});

app.put("/inserirAeronave", async (req, res)=>{});

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


app.listen(port, () => {
  console.log("Servidor HTTP rodando...");
});