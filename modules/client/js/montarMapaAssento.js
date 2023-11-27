/**
 * Função que recebe como parâmetro o id do voo e retorna a listagem
 * dos assentos desse voo.
 * @param {*} idVoo - id do voo.
 * @returns - Retorna os assentos de determinado voo.  
 */
function requestMapaAssento(idVoo) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch(`http://localhost:3000/reservaAssento/${idVoo}`, requestOptions)
    .then(response => response.json());
}

/**
 * Função que monta de forma automática a tabela que representa o mapa de assentos
 * de determinado voo. 
 * @param {*} assentos - objeto de respostas contendo status, mensagem e o conteúdo
 *
 */
function montarMapaAssentos(assentos) {
    var linhas = assentos[0].numLinhasAssento;
    var colunas = assentos[0].numColunasAssento;

    const alfabeto = ['A', 'B', 'C', 'D', 'E', 'F', 'G',
                      'H', 'I', 'J', 'K', 'L', 'M', 'N',
                      'O', 'P', 'Q', 'R', 'S', 'T', 'U',
                      'V', 'W', 'X', 'Y', 'Z']

    var corpoTbl = document.getElementById("corpoTbl");
    var linhaCabecalho = document.getElementById("linhaCabecalhoTbl");

    // preenchendo cabeçalho da tabela
    for (let i = 1; i <= linhas; i++) {
        linhaCabecalho.innerHTML += `<th scope="row">${i}</th>`;
    }

    // preenchendo corpo da tabela
    for (let i = 0; i < colunas; i++) {
        corpoTbl.innerHTML += 
        `<tr id="${"linha" + i}">
            <td>${alfabeto[i]}</td>
        </tr>
        `;
        
        var linhaAtual = document.getElementById("linha" + i);

        for (let j = 0; j < linhas; j++) {
            // Calcula a letra da coluna considerando o alfabeto
            var letraColuna = alfabeto[i];
            // Calcula o número da linha
            var numeroLinha = j + 1;

            // Concatena a letra da coluna com o número da linha para formar a referência do assento
            var referenciaAssento = letraColuna + numeroLinha;

            linhaAtual.innerHTML += 
            `
            <td>
                <button
                    class="btn iconAssento ${assentos[j * colunas + i].statusAsssento}"
                    onclick="assentoClick(this);"
                    id="${referenciaAssento}">
                        <img src="../../assets/img/assento-verde.png" alt="" id="spanIcone">
                </button>
            </td>
            `
        }
    }
}

/**
 * Função que engloba a requisição e montagem do mapa de assentos. Nela há
 * uma condicional que dita o tipo de parâmetro que será enviado para a
 * requisição, que é o tipo do voo.
 */
function exibirAssentos() {
    // Obtenha a string da consulta da URL
    const queryString = window.location.search;

    // Crie um objeto URLSearchParams a partir da string da consulta
    const urlParams = new URLSearchParams(queryString);
    
    // parametros da URL
    var idVooIda = urlParams.get('idVooIda');
    var idVooVolta = urlParams.get('idVooVolta');
    var tipoVoo = urlParams.get('tipoVoo');

    if(tipoVoo === "ida" || tipoVoo === "idaVolta") {
        requestMapaAssento(idVooIda)
        .then(customResponse => {
            if(customResponse.status === "SUCCESS") {
                montarMapaAssentos(JSON.parse(JSON.stringify(customResponse.payload)));
                mudaStatusAssento();
            }
        })
    } else {
        requestMapaAssento(idVooVolta)
        .then(customResponse => {
            if(customResponse.status === "SUCCESS") {
                montarMapaAssentos(JSON.parse(JSON.stringify(customResponse.payload)));
                mudaStatusAssento();
            }
        })
    }
}

/**
 * Função que muda o status do assento com base no retorno do status do assento
 * que vem do backend.
 */
function mudaStatusAssento() {
    var assentos = document.querySelectorAll('.btn.iconAssento');
    assentos.forEach(assento => {
        if (assento.classList.contains("ocupado")) {
            assento.classList.add("disabled");
            var imgElement = assento.querySelector('#spanIcone');
            imgElement.src = "../../assets/img/assento-vermelho.png"; // Atualize o caminho conforme necessário
        }
    });
}


/**
 * Função que muda o contéudo do botão de acordo com o clique,
 *  manipulando a classe. Caso o botão não esteja selecionado,
 * se ele for clicado será adicionado uma classe e personalizado
 * o seu contéudo, caso contrário,  a classe e removida e retorna
 * para o conteúdo padrão
 * @param {*} button - objeto botão que realiza a ação. 
 */
function assentoClick(button) {
    var imgElement = button.querySelector('#spanIcone');
    if (button.classList.contains('selected')) {
        imgElement.src = "../../assets/img/assento-verde.png";
        button.classList.remove("selected")
    } else {
        imgElement.src = "../../assets/img/assento-azul.png";
        button.classList.add("selected");
    }
}

/**
 * Função que é acionada quando o usuário confirma os assentos
 * selecionados. Nela há uma verificação se o número de assentos
 * selecionados estão de acordo com o número de passagens escolhidas
 * anteriormente. Se for um voo de ida, após essa função ele vai ser
 * encaminhado para a página de pagamento. Senão, ele escolherá os
 * assentos do voo de volta, posteriormente após essa escolha ele vai
 * para a página de pagamento.
 * @returns 
 */
function confirmarAssentos() {
    // Obtenha a string da consulta da URL
    const queryString = window.location.search;

    // Crie um objeto URLSearchParams a partir da string da consulta
    const urlParams = new URLSearchParams(queryString);
    
    // parametros da URL
    var idVooIda = urlParams.get('idVooIda');
    var idVooVolta = urlParams.get('idVooVolta');
    var tipoVoo = urlParams.get('tipoVoo');
    var numPassageiros = urlParams.get('numPassageiros');
    var assentosIda = urlParams.get('assentosIda');

    // guarda os botões com a classe selected
    var btnsSelecionados = document.querySelectorAll('.selected');
    let count = 0;

    // guarda o id dos assentos selecionados
    let idAssentos = []

    // percorre cada botão e joga para o array os ids dele(que são a
    // referência do assento, ou a numeração)
    btnsSelecionados.forEach((btn) => {
        count++;
        idAssentos.push(btn.id);
    })

    // transformar o array dos ids armazenados em uma string separada por vírgula
    let stringAssentos = idAssentos.join(',');

    // exibe um alerta caso o usuário escolha a quantidade inadequada de assentos
    const alerta = document.getElementById("alerta");
    if (count > numPassageiros || count < numPassageiros) {
        alerta.textContent = 
            `Escolha ${(numPassageiros > 1) ? numPassageiros + " assentos" : numPassageiros + " assento"}`
        alerta.style.display = "block";
        return;
    } else {
        alerta.style.display = "none";
    }

    // condicional para cada tipo de voo
    if (tipoVoo === "ida") {
        const pagePagamento = `pagamento.html?idVoo=${idVooIda}&assentosIda=${stringAssentos}`
        window.location.href = pagePagamento;
    } else if (tipoVoo === "idaVolta") {
        const mapaAssentosPage = `mapaAssentos.html?idVooIda=${idVooIda}&idVooVolta=${idVooVolta}&tipoVoo=volta&assentosIda=${stringAssentos}&numPassageiros=${numPassageiros}`
        window.location.href = mapaAssentosPage;
    } else {
        const pagePagamento = `pagamento.html?idVooIda=${idVooIda}&idVooVolta=${idVooVolta}&tipoVoo=volta&assentosIda=${assentosIda}&assentosVolta=${stringAssentos}&numPassageiros=${numPassageiros}`
        window.location.href = pagePagamento;
    }
}

exibirAssentos();