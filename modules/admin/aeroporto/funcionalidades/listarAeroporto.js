/***
 * Função que busca os aeroportos chamando o serviço.
 */
function requestListaDeAeroportos() {
    const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    };
    return fetch('http://localhost:3000/listarAeroportos', requestOptions)
    .then(T => T.json())
}

/*** 
Função que requisita a exclusão de um Aeroporto
*/

function requestExcluirAeroporto(body) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    return fetch('http://localhost:3000/excluirAeroporto', requestOptions)
    .then(T => T.json())
}


function excluirAeroporto(idAeroporto) {
    console.log('Clicou no excluir aeroporto: ' + idAeroporto);
    requestExcluirAeroporto({idAeroporto: idAeroporto})
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

function redirecionaParaAlterar(idAeroporto) {
    const alterarAeroportoHTML = `alterarAeroporto.html?idAeroporto=${idAeroporto}`;

    window.location.href = alterarAeroportoHTML;
}

function preencherTabela(aeroportos) {
    var rowCabecalho = document.querySelector("#cabecalhoTabela");

    let numeroAeroportos = aeroportos.length;
    document.getElementById("titlePage").innerHTML = `<h1>Listar Aeroporto (Qtde:${numeroAeroportos})</h1>`;

    if(numeroAeroportos > 0) {
        rowCabecalho.innerHTML += "<th>ID Aeroporto</th>";
        rowCabecalho.innerHTML += "<th>Sigla</th>";
        rowCabecalho.innerHTML += "<th>Nome do Aeroporto</th>";
        rowCabecalho.innerHTML += "<th>Cidade</th>";
        rowCabecalho.innerHTML += "<th>UF</th>";
        rowCabecalho.innerHTML += "<th>Excluir</th>";
        rowCabecalho.innerHTML += "<th>Alterar</th>";
    }
    // acessando a referencia pelo id do tbody
    const tblBody = document.getElementById("aeroportos-list");

    let aeroporto = "";
    // creating all cells
    for (let i = 0; i < aeroportos.length; i++) {

        aeroporto = aeroportos[i];
        console.log("Dados do aeroporto: " + aeroporto);
        // row representa a linha da tabela (um novo tr)
        const row = document.createElement("tr");

        if (i % 2 == 0)
            row.className = "evenRow";
        else
            row.className = "oddRow";

        row.innerHTML = 
            `<td>${aeroporto.idAeroporto}</td>
            <td>${aeroporto.sigla}</td>
            <td>${aeroporto.nomeAeroporto}</td>
            <td>${aeroporto.nomeCidade}</td>
            <td>${aeroporto.uf}</td>
            <td>
                <img 
                    src="../../../assets/img/delete_icon.png" 
                    class="deletarIcon"
                    onclick="excluirAeroporto(${aeroporto.idAeroporto});"/>
            </td>
            <td>
                <img src="../../../assets/img/alterar_icon.svg" 
                    class="alterarIcon"
                    onclick="redirecionaParaAlterar(${aeroporto.idAeroporto});"/>
            </td>`
    
        // adicionando a linha que representa o aeroporto. 
        tblBody.appendChild(row);
    }
}

function exibirAeroporto() {
    requestListaDeAeroportos()
    .then(customResponse => {
        // obteve resposta, vamos simplesmente exibir como mensagem:
        if(customResponse.status === "SUCCESS"){
            // vamos obter o que está no payload e chamar a função .
            // agora chamar a função de exibição dos dados em tabela... 
            // no payload voltou o Array com as aeroportos. 
            // DEVEMOS antes, conferir se o ARRAY não está vazio. Faça essa mudança.
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

exibirAeroporto();