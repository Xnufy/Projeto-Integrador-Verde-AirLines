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
const cors_1 = __importDefault(require("cors"));
const conexaoOracle_1 = require("./conexaoOracle");
const Conversores_1 = require("./Conversores");
const Validadores_1 = require("./Validadores");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // { origin: 'http://127.0.0.1:5500' }
oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
//
//    REQUISIÇÕES AERONAVE
//
// o código fornecido será ingênuo. 
app.get("/listarAeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
app.put("/inserirAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
app.delete("/excluirAeronave", (req, res) => {
    // excluir aeronave no Oracle.
});
//
//    SERVIÇOS AEROPORTO
//
app.get("/listarAeroportos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = {
        status: "ERROR",
        messagem: "",
        payload: undefined
    };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(conexaoOracle_1.oraConnAttribs);
        let resultadoConsulta = yield connection.execute(`SELECT * FROM AEROPORTO`);
        cr.status = "SUCCESS";
        cr.messagem = "Dados obtidos";
        cr.payload = ((0, Conversores_1.rowsToAeroportos)(resultadoConsulta.rows));
    }
    catch (e) {
        if (e instanceof Error) {
            cr.messagem = e.message;
            console.log(e.message);
        }
        else
            cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
    }
    finally {
        if (connection !== undefined)
            yield connection.close();
        res.send(cr);
    }
}));
app.put("/inserirAeroporto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = {
        status: "ERROR",
        messagem: "",
        payload: undefined
    };
    const aeroporto = req.body;
    console.log(aeroporto);
    let [valida, mensagem] = (0, Validadores_1.aeroportoValida)(aeroporto);
    if (!valida) {
        cr.messagem = mensagem;
        res.send(cr);
    }
    else {
        let connection;
        try {
            const inserirAeroporto = `INSERT INTO AEROPORTO
      (ID_AEROPORTO, SIGLA, NOME_AEROPORTO, NOME_COMPANHIA, NOME_CIDADE)
      VALUES
      (SEQ_AEROPORTOS.NEXTVAL, :1, :2, 'Verde Airlines', :3)`;
            const dados = [aeroporto.sigla, aeroporto.nomeAeroporto, aeroporto.nomeCidade];
            connection = yield oracledb_1.default.getConnection(conexaoOracle_1.oraConnAttribs);
            let resInsert = yield connection.execute(inserirAeroporto, dados);
            // COMMIT DA INSERÇÃO DE DADOS
            yield connection.commit();
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
            }
            else
                cr.messagem = "Erro ao conectar ao oracle. Sem detalhes.";
        }
        finally {
            if (connection !== undefined)
                yield connection.close();
            res.send(cr);
        }
    }
}));
app.delete("/excluirAeroporto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idAeroporto = req.body.idAeroporto;
    console.log("Id do Aeroporto recebido: " + idAeroporto);
    let cr = {
        status: "ERROR",
        messagem: "",
        payload: undefined
    };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(conexaoOracle_1.oraConnAttribs);
        const deletarAeroporto = `DELETE AEROPORTO WHERE ID_AEROPORTO = :1`;
        const dados = [idAeroporto];
        let resDelete = yield connection.execute(deletarAeroporto, dados);
        // COMMIT DA DELEÇÃO DE DADOS
        yield connection.commit();
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.messagem = "Aeroporto excluído.";
        }
        else
            cr.messagem = "Aeroporto não excluído. Verifique se o ID do aeroporto está correto";
    }
    catch (e) {
        if (e instanceof Error) {
            cr.messagem = e.message;
            console.log(e.message);
        }
        else
            cr.messagem = "Erro ao conectar ao oracle. Sem detalhes";
    }
    finally {
        if (connection !== undefined)
            yield connection.close();
        res.send(cr);
    }
}));
app.listen(port, () => {
    console.log("Servidor HTTP rodando...");
});
