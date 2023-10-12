import {ConnectionAttributes} from "oracledb";
import dotenv from "dotenv";

// já configurando e preparando o uso do dotenv para 
// todos os serviços.
dotenv.config();

export const oraConnAttribs: ConnectionAttributes = {
  user: process.env.NODE_ORACLEDB_USER,
  password: process.env.NODE_ORACLEDB_PASSWORD,
  connectionString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
}