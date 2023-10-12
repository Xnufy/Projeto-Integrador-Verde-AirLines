"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oraConnAttribs = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// já configurando e preparando o uso do dotenv para 
// todos os serviços.
dotenv_1.default.config();
exports.oraConnAttribs = {
    user: process.env.NODE_ORACLEDB_USER,
    password: process.env.NODE_ORACLEDB_PASSWORD,
    connectionString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
};
