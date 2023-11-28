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

/**
 * Função que altera o mapa de assento alocando os passageiros,
 * adiciona o ticket no mapa de assento.
 * @param {*} body 
 * @returns 
 */
function fetchInserirCliente(body) {
    const requestOptions = 
    {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    return fetch('http://localhost:3000/inserirCliente', requestOptions)
    .then(request => request.json())
}

/**
 * Função que utiliza da requisição para adicionar os dados do cliente e do voo para
 * serem reservados.
 * @param {*} cpf - cpf do cliente que vai ser cadastrado para pegar o id do cliente
 * @param {*} idVoo - id do voo para adicionar em reserva o id do voo
 * @returns 
 */
function fetchInserirReserva(cpf, idVoo) {
    const requestOptions = 
    {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    };

    return fetch(`http://localhost:3000/inserirReserva/${cpf}?idVoo=${idVoo}`, requestOptions)
    .then(request => request.json())
}

/**
 * Função que atualiza no mapa de assentos de um determinado voo
 * o status "ocupado" quando o usuário compra a passagem
 * @param {*} idTicket - id do número da reserva do cliente
 * @param {*} refAssento - referência do assento
 * @param {*} idVoo - id do voo
 * @returns 
 */
function fetchInserirAlterarMapa(idTicket, refAssento, idVoo) {
    const requestOptions = 
    {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    };

    return fetch(`http://localhost:3000/alterarMapaAssento/${idTicket}?refAssento=${refAssento}&idVoo=${idVoo}`, requestOptions)
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
 * Função que retorna a forma de pagamento
 * @returns retorna a forma de pagamento:pix ou cartão de crédito
 */
function formaPagamento() {
    var todosElementos = document.querySelectorAll('.forma-pagamento');

    for (const elemento of todosElementos) {
        if (elemento.classList.contains('ativado')) {
            return elemento.id;
        }
    }
    return null;
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

    if(tipoVoo === "ida") {
        requestVoos(idVooIda)
        .then((customResponse) => {
            if (customResponse.status === "SUCCESS") {
              var responseVoos = customResponse.payload;
              var valor = responseVoos[0].valor * numPassageiros;
              valorTotal.textContent = valor.toFixed(2).replace('.', ',')
            }
        })
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
    }
}

/**
 * Função que verifica se todos os campos foram preenchidos e faz
 * a requisição de inserir cliente, reservar e atualizar o mapa de assentos.
 * @returns 
 */
function confirmarPagamento() {
    // Obtenha a string da consulta da URL
    const queryString = window.location.search;

    // Crie um objeto URLSearchParams a partir da string da consulta
    const urlParams = new URLSearchParams(queryString);

    // Obtenha os valores dos parâmetros da URL
    var assentosIda = urlParams.get('assentosIda');
    var assentosVolta = urlParams.get('assentosVolta');
    var tipoVoo = urlParams.get('tipoVoo');
    var idVooIda = urlParams.get('idVooIda');
    var idVooVolta = urlParams.get('idVooVolta');
    
    if (assentosIda !== null) var arrayIdAssentosIda = assentosIda.split(",");
    if (assentosVolta !== null) var arrayIdAssentosVolta = assentosVolta.split(",");    
    
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

    var tipoPagamento = formaPagamento();

    const cpf = document.getElementById("cpfInput").value;
    const nome = document.getElementById("nomeCompletoInput").value;
    const email = document.getElementById("emailInput").value;

    fetchInserirCliente({
        cpfCliente: cpf,
        nomeCliente: nome,
        emailCliente: email,
        formaPagamento: tipoPagamento,
    })
    .then((resultadoCliente) => {
        if (resultadoCliente.status === "SUCCESS") {
            if (tipoVoo === "ida") {
                fetchInserirReserva(cpf, idVooIda)
                .then((resultadoReserva) => {
                    for (let i = 0; i < arrayIdAssentosIda.length; i++) {
                        fetchInserirAlterarMapa(resultadoReserva.payload, arrayIdAssentosIda[i], idVooIda)
                    
                    }
                    var rootContainer = document.getElementById("rootContainer");
                    rootContainer.style.display = "none";

                    var alertView = document.getElementById("alertView");
                    alertView.className = "d-block container";
                })
                .catch((e) => {
                    showStatusMessage(e, true);
                });
            } else {
                fetchInserirReserva(cpf, idVooIda)
                .then((resultadoReservaVolta) => {
                    for (let i = 0; i < arrayIdAssentosIda.length; i++) {
                        fetchInserirAlterarMapa(resultadoReservaVolta.payload, arrayIdAssentosIda[i], idVooIda)
                    }
                })
                .catch((e) => {
                    showStatusMessage(e, true);
                });
                // Aqui, você provavelmente quer chamar a reserva de volta
                fetchInserirReserva(cpf, idVooVolta)
                .then((resultadoReservaVolta) => {
                    for (let i = 0; i < arrayIdAssentosVolta.length; i++) {
                        fetchInserirAlterarMapa(resultadoReservaVolta.payload, arrayIdAssentosVolta[i], idVooVolta);
                    }
                    // Ações comuns após a inserção do cliente
                    var rootContainer = document.getElementById("rootContainer");
                    rootContainer.style.display = "none";

                    var alertView = document.getElementById("alertView");
                    alertView.className = "d-block container";
                })
                .catch((e) => {
                    showStatusMessage(e, true);
                });
            }
        } else {
            showStatusMessage(resultadoCliente.messagem, true);
        }
    })
}

mostrarValor();
