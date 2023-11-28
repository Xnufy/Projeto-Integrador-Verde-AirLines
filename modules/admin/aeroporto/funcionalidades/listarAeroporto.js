//Função que busca os aeroportos chamando o serviço.
function requestListaDeAeroportos() {
    const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    };
    return fetch('http://localhost:3000/listarAeroportos', requestOptions)
    .then(T => T.json())
}


//Função que requisita a exclusão de um Aeroporto
function requestExcluirAeroporto(body) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    return fetch('http://localhost:3000/excluirAeroporto', requestOptions)
    .then(T => T.json())
}

//função que printa no terminal o status da exclusão de um aeroporto
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

//redireciona para a página de alterar aeroporto 
function redirecionaParaAlterar(idAeroporto) {
    const alterarAeroportoHTML = `alterarAeroporto.html?idAeroporto=${idAeroporto}`;

    window.location.href = alterarAeroportoHTML;
}

//preenche a tabela com as informações dos aeroportos
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
    const tblBody = document.getElementById("aeroportos-list");

    let aeroporto = "";
    //for das informações da tabela
    for (let i = 0; i < aeroportos.length; i++) {

        aeroporto = aeroportos[i];
        console.log("Dados do aeroporto: " + aeroporto);
        const row = document.createElement("tr");

        if (i % 2 == 0)
            row.className = "evenRow";
        else
            row.className = "oddRow";

        //preenche as informações junto com os ícones de alterar e deletar
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

//exibe os status das operaçõs pelo terminal
function exibirAeroporto() {
    console.log('Entrou no exibir...')
    requestListaDeAeroportos()
    .then(customResponse => {
        if(customResponse.status === "SUCCESS"){
            console.log("Deu certo a busca de aeroportos");
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

exibirAeroporto();