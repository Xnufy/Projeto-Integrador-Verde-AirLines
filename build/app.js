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
const moment_1 = __importDefault(require("moment"));
const conexaoOracle_1 = require("./conexaoOracle");
const Conversores_1 = require("./Conversores");
const Validadores_1 = require("./Validadores");
const Validadores_2 = require("./Validadores");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // { origin: 'http://127.0.0.1:5500' }
oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
//
//    REQUISIÇÕES AERONAVE
//
// LISTAR AERONAVES
app.get("/listarAeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = {
        status: "ERROR",
        messagem: "",
        payload: undefined
    };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(conexaoOracle_1.oraConnAttribs);
        let resultadoConsulta = yield connection.execute(`SELECT * FROM AERONAVES`);
        cr.status = "SUCCESS";
        cr.messagem = "Dados obtidos";
        cr.payload = ((0, Conversores_1.rowsToAeronaves)(resultadoConsulta.rows));
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
// CADASTRAR AERONAVES
app.put("/inserirAeronave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = {
        status: "ERROR",
        messagem: "",
        payload: undefined
    };
    const aeronave = req.body;
    console.log(aeronave);
    let [valida, mensagem] = (0, Validadores_2.aeronaveValida)(aeronave);
    if (!valida) {
        cr.messagem = mensagem;
        res.send(cr);
    }
    else {
        let connection;
        try {
            const inserirAeronave = `INSERT INTO AERONAVES
      (ID_AERONAVE, MODELO, FABRICANTE, ANO_FABRICACAO, ID_AEROPORTO_AERONAVE, LINHAS_ASSENTO, COLUNAS_ASSENTO, REGISTRO)
      VALUES
      (SEQ_AERONAVES.NEXTVAL, :1, :2, :3, :4, :5, :6, :7)`;
            const dados = [aeronave.modelo, aeronave.fabricante, aeronave.anoFabricacao,
                aeronave.idAeroportoAeronave, aeronave.linhasAssentos, aeronave.colunasAssentos, aeronave.registro];
            connection = yield oracledb_1.default.getConnection(conexaoOracle_1.oraConnAttribs);
            let resInsert = yield connection.execute(inserirAeronave, dados);
            // COMMIT DA INSERÇÃO DE DADOS
            yield connection.commit();
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
app.get("/listarAeroporto/:idAeroporto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = {
        status: "ERROR",
        messagem: "",
        payload: undefined
    };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(conexaoOracle_1.oraConnAttribs);
        // Parametro recebido na URL
        const idAeroporto = req.params.idAeroporto;
        let resultadoConsulta = yield connection.execute(`SELECT * FROM AEROPORTO WHERE ID_AEROPORTO = ${idAeroporto}`);
        const rowFetched = (0, Conversores_1.rowsToAeroportos)(resultadoConsulta.rows);
        if (rowFetched !== undefined && rowFetched.length === 1) {
            cr.status = "SUCCESS";
            cr.messagem = "Aeroporto encontrado";
            cr.payload = (0, Conversores_1.rowsToAeroportos)(resultadoConsulta.rows);
        }
        else
            cr.messagem = "Aeroporto não encontrado. Verifique se o ID do aeroporto está correto";
    }
    catch (e) {
        if (e instanceof Error) {
            cr.messagem = e.message;
            console.log(e.message);
        }
        else {
            cr.messagem = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        if (connection !== undefined)
            yield connection.close();
        res.send(cr);
    }
}));
app.put("/alterarAeroporto/:idAeroporto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idAeroporto = req.params.idAeroporto;
    console.log("Id do Aeroporto recebido: " + idAeroporto);
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
            connection = yield oracledb_1.default.getConnection(conexaoOracle_1.oraConnAttribs);
            const alterarAeroporto = `UPDATE AEROPORTO SET SIGLA = :1, NOME_AEROPORTO = :2, NOME_CIDADE = :3
      WHERE ID_AEROPORTO = ${idAeroporto}`;
            const dados = [aeroporto.sigla, aeroporto.nomeAeroporto, aeroporto.nomeCidade];
            let resUpdate = yield connection.execute(alterarAeroporto, dados);
            // COMMIT DA ATUALIZAÇÃO DE DADOS
            yield connection.commit();
            const rowsUpdated = resUpdate.rowsAffected;
            if (rowsUpdated !== undefined && rowsUpdated === 1) {
                cr.status = "SUCCESS";
                cr.messagem = "Aeroporto alterado.";
                console.log("Aeroporto atualizado.");
            }
            else
                cr.messagem = "Aeroporto não alterado. Verifique se o ID do aeroporto está correto";
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
    }
}));
///VOOS
app.put("/inserirVoo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let cr = {
        status: "ERROR",
        messagem: "",
        payload: undefined
    };
    const voo = req.body;
    console.log(voo);
    let [valida, mensagem] = (0, Validadores_1.aeroportoVoo)(voo);
    if (!valida) {
        cr.messagem = mensagem;
        res.send(cr);
    }
    else {
        let connection;
        try {
            const inserirVoo = `INSERT INTO VOOS
      (ID_VOO, SAIDA_VOO, CHEGADA_VOO, DATA, VALOR)
      VALUES
      (:1,:2,:3,:4,:5)`;
            //Formata o tipo da data.
            const new_date = (0, moment_1.default)(voo.data, 'YYYY-MM-DD').format('DD/MM/YYYY');
            const dados = [voo.idVoo, voo.saidaVoo, voo.chegadaVoo, new_date, (_a = voo.valor) === null || _a === void 0 ? void 0 : _a.toFixed(2)];
            connection = yield oracledb_1.default.getConnection(conexaoOracle_1.oraConnAttribs);
            let resInsert = yield connection.execute(inserirVoo, dados);
            // COMMIT DA INSERÇÃO DE DADOS
            yield connection.commit();
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
app.get("/listarVoos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = {
        status: "ERROR",
        messagem: "",
        payload: undefined
    };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(conexaoOracle_1.oraConnAttribs);
        let resultadoConsulta = yield connection.execute(`SELECT * FROM VOOS`);
        cr.status = "SUCCESS";
        cr.messagem = "Dados obtidos";
        cr.payload = ((0, Conversores_1.rowsToVoos)(resultadoConsulta.rows));
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
app.get("/lastIdVoo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = {
        status: "ERROR",
        messagem: "",
        payload: undefined
    };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(conexaoOracle_1.oraConnAttribs);
        let resultadoConsulta = yield connection.execute(`SELECT * FROM VOOS`);
        cr.status = "SUCCESS";
        cr.messagem = "Dados obtidos";
        let arrayVoos = ((0, Conversores_1.rowsToVoos)(resultadoConsulta.rows));
        let lastIdVoo = arrayVoos.length;
        cr.payload = lastIdVoo;
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
app.delete("/excluirVoo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idVoo = req.body.idVoo;
    console.log("Id do Aeroporto recebido: " + idVoo);
    let cr = {
        status: "ERROR",
        messagem: "",
        payload: undefined
    };
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(conexaoOracle_1.oraConnAttribs);
        const deletarAeroporto = `DELETE VOOS WHERE ID_VOO = :1`;
        const dados = [idVoo];
        let resDelete = yield connection.execute(deletarAeroporto, dados);
        // COMMIT DA DELEÇÃO DE DADOS
        yield connection.commit();
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.messagem = "Voo excluído.";
        }
        else
            cr.messagem = "Voo não excluído. Verifique se o ID do voo está correto";
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
