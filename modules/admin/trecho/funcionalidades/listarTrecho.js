//faz a requisição dos valores dos trechos
function requestListaDeTrecho() {
    const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    };
    return fetch(`http://localhost:3000/listarTrecho`, requestOptions)
    .then(T => T.json())
}

//faz requisição dos trechos para excluir um trecho
function requestExcluirTrecho(body) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    return fetch(`http://localhost:3000/excluirTrecho`, requestOptions)
    .then(T => T.json())
}

//função para excluir um trecho ao clicar no botão de excluir
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

//funçãp que redireciona ao clicar no botão de alterar
//faz a busca do trecho pelo id
function redirecionaParaAlterar(idTrecho) {
    const alterarTrechoHTML = `alterarTrecho.html?idTrecho=${idTrecho}`;

    window.location.href = alterarTrechoHTML;
}

//função que preenche a tabela 
function preencherTabela(trechos) {
    var rowCabecalho = document.querySelector("#cabecalhoTabela");

    let numeroTrecho = trechos.length;
    document.getElementById("titlePage").innerHTML = <h1>Listar Trecho (Qtde:${numeroTrecho})</h1>;

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
    //cria a tabela baseada no comprimento
    for (let i = 0; i < trechos.length; i++) {

        trecho = trechos[i];
        console.log("Dados do trecho: " + trecho);
        // row representa a linha da tabela (um novo tr)
        const row = document.createElement("tr");

        if (i % 2 == 0)
            row.className = "evenRow";
        else
            row.className = "oddRow";

        //preenche as informações na tabela junto com os ícones de alterar e deletar
        row.innerHTML = 
            `<td>${trecho.idTrecho}</td>
            <td>${trecho.nomeAeroportoOrigem}</td>
            <td>${trecho.nomeAeroportoDestino}</td>
            <td>
                <img 
                    src="../../../assets/img/delete_icon.png" 
                    class="deletarIcon"
                    onclick="excluirTrecho(${trecho.idTrecho});"/>
            </td>
            <td> 
                <img src="../../../assets/img/alterar_icon.svg" 
                    class="alterarIcon" 
                    onclick="redirecionaParaAlterar(${trecho.idTrecho});"/>
            </td>`
    
        // adicionando a linha que representa o trecho. 
        tblBody.appendChild(row);
    }
}

//função que exibe os status das operações de busca
function exibirTrecho() {
    console.log('Entrou no exibir...')
    requestListaDeTrecho()
    .then(customResponse => {
        if(customResponse.status === "SUCCESS"){
            console.log("Deu certo a busca de trechos");
            console.log('Payload:' + JSON.stringify(customResponse.payload));
            console.log(customResponse.payload);
            preencherTabela(JSON.parse(JSON.stringify(customResponse.payload)))
        }else{
            console.log(customResponse.messagem);
        }
        })
    .catch((e)=>{
    console.log("Não foi possível exibir." + e);
    });
}

exibirTrecho();