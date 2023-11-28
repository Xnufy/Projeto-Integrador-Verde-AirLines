/***
 * Função que busca os voos chamando o serviço.
 */
function requestVoos(idVoo) {
    const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    };
    return fetch(`http://localhost:3000/listarVoos/${idVoo}`, requestOptions)
    .then(T => T.json())
}

function fetchInserir(body) {
    const requestOptions = 
    {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    return fetch('http://localhost:3000/confirmarPagamento', requestOptions)
    .then(request => request.json())
}

/**
 * Função que verifica se o usuário preencheu CPF
 * @returns true caso preencheu CPF. false caso não preencheu CPF
 */
function preencheuCpf(){
    let resultado = false;
    const cpf = document.getElementById("cpfInput").value;
    if(cpf.length > 0){
        resultado = true;
    }
    return resultado;
}

/**
 * Função que verifica se o usuário preencheu o nome.
 * @returns true caso preencheu nome. false caso não preencheu nome.
 */
function preencheuNome(){
    let resultado = false;
    const nome = document.getElementById("nomeCompletoInput").value;
    if(nome.length > 0){
        resultado = true;
    }
    return resultado;
}

/**
 * Função que verifica se o usuário preencheu o email.
 * @returns true caso preencheu email. false caso não preencheu nome.
 */
function preencheuEmail(){
    let resultado = false;
    const email = document.getElementById("emailInput").value;
    if(email.length > 0){
        resultado = true;
    }
    return resultado;
}

/**
 * Função que verifica se o usuário selecionou a forma de pagamento
 * @returns true caso selecionou. false caso não selecionou.
 */
function selecionouFormaPagamento() {
    var formasPagamento = document.querySelectorAll('.forma-pagamento');
    let resultado = false;

    formasPagamento.forEach(function(formaPagamento) {
        if (formaPagamento.classList.contains('ativado')) {
            resultado = true;
        }
    });

    return resultado;
}

/**
 * Função que mostra o status da mensagem para o usuário.
 * @param {*} msg - texto da mensagem para ser mostrada ao usuário
 * @param {*} error - true caso o erro, false caso não tenha erro.
 */
function showStatusMessage(msg, error){
    var pStatus = document.getElementById("status");
    if (error === true){
        pStatus.className = "statusError";
    }else{
        pStatus.className = "statusSuccess";
    }
    pStatus.textContent = msg;
}

/**
 * Função que muda o estado de cada opção de pagamento.
 * Verifica qual forma de pagamento o usuário selecionou
 * e troca a classe dela.
 * @param {*} formaPagamento - elemento selecionado 
 */
function selecionarFormaPagamento(formaPagamento) {
    // Remove a classe 'ativado' de todos os elementos
    var todosElementos = document.querySelectorAll('.forma-pagamento');
    todosElementos.forEach(function(elemento) {
        elemento.style.backgroundColor = "white";
        elemento.classList.remove('ativado');
    });
    // Troca o status caso ele esteja ativado
    if(!formaPagamento.classList.contains('ativado')) {
        formaPagamento.style.backgroundColor = "#e5dfdf";
        formaPagamento.classList.add('ativado');
    }
}

/**
 * Função que mostra o valor total da passagem. É realizado
 * uma requisição passando como parametro o id do voo. Caso
 * o voo seja de ida o valor da passagem vai ser o valor do
 * voo pela quantidade de passagens que ele comprou. Já no
 * voo de ida e volta vai ser o valor da passagem pela
 * quantidade de passagens que ele comprou duas vezes.
 */
function mostrarValor() {
    // Obtenha a string da consulta da URL
    const queryString = window.location.search;

    // Crie um objeto URLSearchParams a partir da string da consulta
    const urlParams = new URLSearchParams(queryString);

    // Obtenha os valores dos parâmetros da URL
    var numPassageiros = urlParams.get('numPassageiros');
    var tipoVoo = urlParams.get('tipoVoo');
    var idVooIda = urlParams.get('idVooIda');

    var valorTotal = document.getElementById("valorTotal");

    console.log("teste")
    if(tipoVoo === "ida") {
        requestVoos(idVooIda)
        .then((customResponse) => {
            if (customResponse.status === "SUCCESS") {
              var responseVoos = customResponse.payload;
              var valor = responseVoos[0].valor * numPassageiros;
              valorTotal.textContent = valor.toFixed(2).replace('.', ',')
            }
          })
          .catch((e) => {
            showStatusMessage("Não foi possível exibir: " + e);
          });
    } else {
        requestVoos(idVooIda)
        .then((customResponse) => {
            if (customResponse.status === "SUCCESS") {
              var responseVoos = customResponse.payload;
              var valor = (responseVoos[0].valor * numPassageiros) * 2;
              valorTotal.textContent = valor.toFixed(2).replace('.', ',')
            } else {
              // tratar corretamente o erro... (melhorar...)
              console.log(customResponse.messagem);
            }
          })
          .catch((e) => {
            showStatusMessage("Não foi possível exibir: " + e);
          });
    }
}

function confirmarPagamento() {
    // Obtenha a string da consulta da URL
    const queryString = window.location.search;

    // Crie um objeto URLSearchParams a partir da string da consulta
    const urlParams = new URLSearchParams(queryString);

    // Obtenha os valores dos parâmetros da URL
    var numPassageiros = urlParams.get('numPassageiros');
    var assentosIda = urlParams.get('assentosIda');
    var assentosVolta = urlParams.get('assentosVolta');
    var tipoVoo = urlParams.get('tipoVoo');
    var idVooIda = urlParams.get('idVooIda');
    var idVooVolta = urlParams.get('idVooVolta');
    
    var arrayIdAssentos = assentosIda.split(",");
    var arrayIdAssentos = assentosVolta.split(",");
    
    if(!preencheuCpf()){
        showStatusMessage("Preencha o CPF", true);
        return;
    } else
    showStatusMessage("", false);

    if(!preencheuNome()){
        showStatusMessage("Preencha o nome", true);
        return;
    } else
    showStatusMessage("", false);

    if(!preencheuEmail()){
        showStatusMessage("Preencha o email", true);
        return;
    } else
    showStatusMessage("", false);

    if (!selecionouFormaPagamento()) {
        showStatusMessage("Selecione uma forma de pagamento", true);
        return;
    } else {
        showStatusMessage("", false);
    }

}

mostrarValor()
