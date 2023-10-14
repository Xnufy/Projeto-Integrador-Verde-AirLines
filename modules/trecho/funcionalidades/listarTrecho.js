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

function preencherTabela(trechos) {
    var rowCabecalho = document.querySelector("#cabecalhoTabela");

    let numeroTrecho = trechos.length;
    document.getElementById("titlePage").innerHTML = `<h1>Listar Trechos (Qtde:${numeroTrecho})</h1>`;

    if(numeroTrecho > 0) {
        rowCabecalho.innerHTML += "<th>ID Trecho</th>";
        rowCabecalho.innerHTML += "<th>Origem</th>";
        rowCabecalho.innerHTML += "<th>Destino</th>";
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
            <td>${trecho.origem}</td>
            <td>${trecho.destino}</td>
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
    console.log('Entrou no exibir...')
    requestListaDeTrecho()
    .then(customResponse => {
        // obteve resposta, vamos simplesmente exibir como mensagem:
        if(customResponse.status === "SUCCESS"){
            // vamos obter o que está no payload e chamar a função .
            console.log("Deu certo a busca de aeroportos");
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