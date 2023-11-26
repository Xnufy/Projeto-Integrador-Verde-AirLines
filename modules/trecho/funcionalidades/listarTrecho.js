/***
 * Função que busca os trechos chamando o serviço.
 */
function requestListaDeTrecho() {
    const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    };
    return fetch('http://localhost:3000/listarTrecho', requestOptions)
    .then(T => T.json())
}

function requestExcluirTrecho(body) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    return fetch('http://localhost:3000/excluirTrecho', requestOptions)
    .then(T => T.json())
}


function excluirTrecho(idTrecho) {
    console.log('Clicou no excluir trecho: ' + idTrecho);
    requestExcluirTrecho({idTrecho: idTrecho})
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

function redirecionaParaAlterar(idTrecho) {
    const alterarTrechoHTML = `alterarTrecho.html?idTrecho=${idTrecho}`;

    window.location.href = alterarTrechoHTML;
}

function preencherTabela(trechos) {
    var rowCabecalho = document.querySelector("#cabecalhoTabela");

    let numeroTrecho = trechos.length;
    document.getElementById("titlePage").innerHTML = `<h1>Listar Trechos (Qtde:${numeroTrecho})</h1>`;

    if(numeroTrecho > 0) {
        rowCabecalho.innerHTML += "<th>ID Trecho</th>";
        rowCabecalho.innerHTML += "<th>Origem</th>";
        rowCabecalho.innerHTML += "<th>Destino</th>";
        rowCabecalho.innerHTML += "<th>Deletar</th>";
        rowCabecalho.innerHTML += "<th>Alterar</th>";
    }
    // acessando a referencia pelo id do tbody
    const tblBody = document.getElementById("trecho-list");

    let trecho = "";
    // creating all cells
    for (let i = 0; i < trechos.length; i++) {

        trecho = trechos[i];
        console.log("Dados do trecho: " + trecho);
        // row representa a linha da tabela (um novo tr)
        const row = document.createElement("tr");

        if (i % 2 == 0)
            row.className = "evenRow";
        else
            row.className = "oddRow";

        row.innerHTML = 
            `<td>${trecho.idTrecho}</td>
            <td>${trecho.nomeAeroportoOrigem}</td>
            <td>${trecho.nomeAeroportoDestino}</td>
            <td>
                <img 
                    src="../../assets/img/delete_icon.png" 
                    class="deletarIcon"
                    onclick="excluirTrecho(${trecho.idTrecho});"/>
            </td>
            <td> 
                <img src="../../assets/img/alterar_icon.svg" 
                    class="alterarIcon" 
                    onclick="redirecionaParaAlterar(${trecho.idTrecho});"/>
            </td>`
    
        // adicionando a linha que representa o trecho. 
        tblBody.appendChild(row);
    }
}

function exibirTrecho() {
    requestListaDeTrecho()
    .then(customResponse => {
        // obteve resposta, vamos simplesmente exibir como mensagem:
        if(customResponse.status === "SUCCESS"){
            // vamos obter o que está no payload e chamar a função .
            console.log("Deu certo a busca de trechos");
            // agora chamar a função de exibição dos dados em tabela... 
            // no payload voltou o Array com os trechos. 
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

exibirTrecho();