/***
 * Função que busca as aeronaves chamando o serviço.
 */
function requestListaDeAeronaves() {
    const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    };
    return fetch('http://localhost:3000/listarAeronaves', requestOptions)
    .then(T => T.json())
}

/*** 
Função que requisita a exclusão de uma Aeronave
*/

function requestExcluirAeronave(body) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    return fetch('http://localhost:3000/excluirAeronave', requestOptions)
    .then(T => T.json())
}


function excluirAeronave(idAeronave) {
    console.log('Clicou no excluir aeronave: ' + idAeronave);
    requestExcluirAeronave({idAeronave: idAeronave})
        .then(customResponse => {
            if(customResponse.status === "SUCCESS") {
                location.reload();
            } else
                console.log(customResponse.messagem);
        })
        .catch((e) => {
            console.log("Não foi possível excluir." + e);
        })
}

function preencherTabela(aeronaves) {
    var rowCabecalho = document.querySelector("#cabecalhoTabela");

    let numeroAeronaves = aeronaves.length;
    document.getElementById("titlePage").innerHTML = `<h1>Listar Aeronave (Qtde:${numeroAeronaves})</h1>`;

    if(numeroAeronaves > 0) {
        rowCabecalho.innerHTML += "<th>ID Aeronave</th>";
        rowCabecalho.innerHTML += "<th>Modelo</th>";
        rowCabecalho.innerHTML += "<th>Fabricante</th>";
        rowCabecalho.innerHTML += "<th>Ano de Fabricação</th>";
        rowCabecalho.innerHTML += "<th>Registro</th>";
        rowCabecalho.innerHTML += "<th>Excluir</th>";
        rowCabecalho.innerHTML += "<th>Alterar</th>";
    }
    // acessando a referencia pelo id do tbody
    const tblBody = document.getElementById("aeronaves-list");

    let aeronave = "";
    // creating all cells
    for (let i = 0; i < aeronaves.length; i++) {

        aeronave = aeronaves[i];
        console.log("Dados da aeronave: " + aeronave);
        // row representa a linha da tabela (um novo tr)
        const row = document.createElement("tr");

        if (i % 2 == 0)
            row.className = "evenRow";
        else
            row.className = "oddRow";

        row.innerHTML = 
            `<td>${aeronave.idAeronave}</td>
            <td>${aeronave.modelo}</td>
            <td>${aeronave.fabricante}</td>
            <td>${aeronave.anoFabricacao}</td>
            <td>${aeronave.registro}</td>
            <td>
                <img 
                    src="../../assets/img/delete_icon.png" 
                    class="deletarIcon"
                    onclick="excluirAeronave(${aeronave.idAeronave});"/>
            </td>
            <td>
                <img src="../../assets/img/alterar_icon.svg" 
                    class="alterarIcon"
                    onclick="redirecionaParaAlterar(${aeronave.idAeronave});"/>
            </td>`
    
        // adicionando a linha que representa o aeroporto. 
        tblBody.appendChild(row);
    }
}

function exibirAeronave() {
    console.log('Entrou no exibir...')
    requestListaDeAeronaves()
    .then(customResponse => {
        // obteve resposta, vamos simplesmente exibir como mensagem:
        if(customResponse.status === "SUCCESS"){
            // vamos obter o que está no payload e chamar a função .
            console.log("Deu certo a busca de aeroportos");
            // agora chamar a função de exibição dos dados em tabela... 
            // no payload voltou o Array com as aeroportos. 
            // DEVEMOS antes, conferir se o ARRAY não está vazio. Faça essa mudança.
            console.log('Payload:' + JSON.stringify(customResponse.payload));
            console.log(customResponse.payload);
            preencherTabela(JSON.parse(JSON.stringify(customResponse.payload)))
        }else{
            // tratar corretamente o erro... (melhorar...)
            console.log(customResponse.messagem);
        }
        })
    .catch((e)=>{
    // FAZER O TRATAMENTO...
    console.log("Não foi possível exibir." + e);
    });
}

exibirAeronave();