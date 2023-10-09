import express from "express";
import ora from "oracledb";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
const port = 3000;


app.use(express.json());

app.use(cors({ origin: 'http://127.0.0.1:5500' }));

// o código fornecido será ingênuo. 
app.get("/listarAeronaves", async(req, res)=>{

  // inicalizando o dotenv
  dotenv.config();

  // o resultado pode ser a lista de aeronaves ou erro.
  let result;
  let dadosAeronaves;

  // primeiro: construir o objeto de CONEXAO.
  const connection = await ora.getConnection(
    { 
      user: process.env.NODE_ORACLEDB_USER, 
      password: process.env.NODE_ORACLEDB_PASSWORD, 
      connectionString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
    });

    console.log("Listando aeronaves...");

    try{
      // tentando obter os dados...
      result = await connection.execute("SELECT * FROM AERONAVES");
      dadosAeronaves = result.rows;
    }catch(erro){
      if(erro instanceof Error){
        console.log(`O detalhamento do erro é: ${erro.message}`)
      }else{
        console.log("Erro desconhecido.");
      }
      result = {
        error: "Erro ao obter aeronaves.",
      }
    }finally{
      if (connection){
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
      res.send(dadosAeronaves);
    }
  });

app.put("/incluirAeronave", (req, res)=>{
  // incluir aeronave no Oracle.
});

app.delete("/excluirAeronave", (req, res)=>{
  // excluir aeronave no Oracle.
});

app.listen(port, ()=>{
  console.log("Servidor HTTP rodando...");
});

app.get("/listarAeroportos", async(req, res)=>{

  // inicalizando o dotenv
  dotenv.config();

  // o resultado pode ser a lista de aeronaves ou erro.
  let result;
  let dadosAeroporto;

  // primeiro: construir o objeto de CONEXAO.
  const connection = await ora.getConnection(
    { 
      user: process.env.NODE_ORACLEDB_USER, 
      password: process.env.NODE_ORACLEDB_PASSWORD, 
      connectionString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
    });

    console.log("Listando aeroportos...");

    try{
      // tentando obter os dados...
      result = await connection.execute("SELECT * FROM AEROPORTO");
      dadosAeroporto = result.rows;
    }catch(erro){
      if(erro instanceof Error){
        console.log(`O detalhamento do erro é: ${erro.message}`)
      }else{
        console.log("Erro desconhecido.");
      }
      result = {
        error: "Erro ao obter aeroportos.",
      }
    }finally{
      if (connection){
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
      res.send(dadosAeroporto);
    }
  });