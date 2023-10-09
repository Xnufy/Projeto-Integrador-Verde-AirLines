"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: 'http://127.0.0.1:5500' }));
// o código fornecido será ingênuo. 
app.get("/listarAeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // inicalizando o dotenv
    dotenv_1.default.config();
    // o resultado pode ser a lista de aeronaves ou erro.
    let result;
    let dadosAeronaves;
    // primeiro: construir o objeto de CONEXAO.
    const connection = yield oracledb_1.default.getConnection({
        user: process.env.NODE_ORACLEDB_USER,
        password: process.env.NODE_ORACLEDB_PASSWORD,
        connectionString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
    });
    console.log("Listando aeronaves...");
    try {
        // tentando obter os dados...
        result = yield connection.execute("SELECT * FROM AERONAVES");
        dadosAeronaves = result.rows;
    }
    catch (erro) {
        if (erro instanceof Error) {
            console.log(`O detalhamento do erro é: ${erro.message}`);
        }
        else {
            console.log("Erro desconhecido.");
        }
        result = {
            error: "Erro ao obter aeronaves.",
        };
    }
    finally {
        if (connection) {
            try {
                yield connection.close();
            }
            catch (err) {
                console.error(err);
            }
        }
        res.send(dadosAeronaves);
    }
}));
app.put("/incluirAeronave", (req, res) => {
    // incluir aeronave no Oracle.
});
app.delete("/excluirAeronave", (req, res) => {
    // excluir aeronave no Oracle.
});
app.listen(port, () => {
    console.log("Servidor HTTP rodando...");
});
app.get("/listarAeroportos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // inicalizando o dotenv
    dotenv_1.default.config();
    // o resultado pode ser a lista de aeronaves ou erro.
    let result;
    let dadosAeroporto;
    // primeiro: construir o objeto de CONEXAO.
    const connection = yield oracledb_1.default.getConnection({
        user: process.env.NODE_ORACLEDB_USER,
        password: process.env.NODE_ORACLEDB_PASSWORD,
        connectionString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
    });
    console.log("Listando aeroportos...");
    try {
        // tentando obter os dados...
        result = yield connection.execute("SELECT * FROM AEROPORTO");
        dadosAeroporto = result.rows;
    }
    catch (erro) {
        if (erro instanceof Error) {
            console.log(`O detalhamento do erro é: ${erro.message}`);
        }
        else {
            console.log("Erro desconhecido.");
        }
        result = {
            error: "Erro ao obter aeroportos.",
        };
    }
    finally {
        if (connection) {
            try {
                yield connection.close();
            }
            catch (err) {
                console.error(err);
            }
        }
        res.send(dadosAeroporto);
    }
}));
