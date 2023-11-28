// Função que busca as aeronaves chamando o serviço.
function requestListaDeAeronaves() {
    const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    };
    return fetch('http://localhost:3000/listarAeronaves', requestOptions)
    .then(T => T.json())
}

 
//Função que requisita a exclusão de uma Aeronave

function requestExcluirAeronave(body) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    return fetch(`http://localhost:3000/excluirAeronave`, requestOptions)
    .then(T => T.json())
}

// função que exclui a aeronave
function excluirAeronave(idAeronave) {
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
// função que redireciona o navegador para a alteração de aeronave
function redirecionaParaAlterar(idAeronave) {
    const alterarAeronaveHTML = `alterarAeronave.html?idAeronave=${idAeronave}`;

    window.location.href = alterarAeronaveHTML;
}
// função que preenche a tabela aeronaves com os dados do BD
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
        rowCabecalho.innerHTML += "<th>Total de assentos</th>";
        rowCabecalho.innerHTML += "<th>Excluir</th>";
        rowCabecalho.innerHTML += "<th>Alterar</th>";
    }
    
    const tblBody = document.getElementById("aeronaves-list");

    let aeronave = "";
    
    for (let i = 0; i < aeronaves.length; i++) {

        aeronave = aeronaves[i];
        console.log("Dados da aeronave: " + aeronave);
        
        const row = document.createElement("tr");

        if (i % 2 == 0)
            row.className = "evenRow";
        else
            row.className = "oddRow";
// construção de cada linha da tabela para cada parâmetro
        row.innerHTML = 
            `<td>${aeronave.idAeronave}</td>
            <td>${aeronave.modelo}</td>
            <td>${aeronave.fabricante}</td>
            <td>${aeronave.anoFabricacao}</td>
            <td>${aeronave.registro}</td>
            <td>${aeronave.linhasAssentos * aeronave.colunasAssentos}</td>
            <td>
                <img 
                    src="../../../assets/img/delete_icon.png" 
                    class="deletarIcon"
                    onclick="excluirAeronave(${aeronave.idAeronave});"/>
            </td>
            <td>
                <img src="../../../assets/img/alterar_icon.svg" 
                    class="alterarIcon"
                    onclick="redirecionaParaAlterar(${aeronave.idAeronave});"/>
            </td>`
    
        // adicionando a linha que representa o aeroporto. 
        tblBody.appendChild(row);
    }
}
// função que lista as aeronaves através da requisição feita
function exibirAeronave() {
    console.log('Entrou no exibir...')
    requestListaDeAeronaves()
    .then(customResponse => {
        
        if(customResponse.status === "SUCCESS"){
            
            console.log("Deu certo a busca de aeronaves");
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

exibirAeronave();