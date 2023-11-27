function requestMapaAssento(idVoo) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch(`http://localhost:3000/reservaAssento/${idVoo}`, requestOptions)
    .then(response => response.json());
}

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
            var letraColuna = alfabeto[i % alfabeto.length];
            // Calcula o número da linha
            var numeroLinha = j + 1;

            // Concatena a letra da coluna com o número da linha para formar a referência do assento
            var referenciaAssento = letraColuna + numeroLinha;

            linhaAtual.innerHTML += 
            `
            <td>
                <button
                    class="btn iconAssento ${assentos[j * colunas + i].statusAssento}"
                    onclick="assentoClick(this);"
                    id="${referenciaAssento}">
                        <img src="../../assets/img/assento-verde.png" alt="" id="spanIcone">
                </button>
            </td>
            `;
        }
    }
}

function exibirAssentos() {
    // Obtenha a string da consulta da URL
    const queryString = window.location.search;

    // Crie um objeto URLSearchParams a partir da string da consulta
    const urlParams = new URLSearchParams(queryString);
    
    // parametros da URL
    var idVooIda = urlParams.get('idVooIda');
    var idVooVolta = urlParams.get('idVooVolta');
    var tipoVoo = urlParams.get('tipoVoo');
    var numPassageiros = urlParams.get('numPassageiros');

    if(tipoVoo === "ida" || tipoVoo === "idaVolta") {
        requestMapaAssento(idVooIda)
        .then(customResponse => {
            if(customResponse.status === "SUCCESS") {
                if(tipoVoo === "ida") {
                    montarMapaAssentos(JSON.parse(JSON.stringify(customResponse.payload)))
                }
            }
        })
    } 
}

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

    var btnsSelecionados = document.querySelectorAll('.selected');
    let count = 0;

    // guarda o id dos assentos selecionados
    let idAssentos = []

    btnsSelecionados.forEach((btn) => {
        count++;
        idAssentos.push(btn.id);
    })

    for (let i = 0; i < idAssentos.length; i++) {

    }

    const alerta = document.getElementById("alerta");
    if (count > numPassageiros || count < numPassageiros) {
        alerta.textContent = 
            `Escolha ${(numPassageiros > 1) ? numPassageiros + " assentos" : numPassageiros + " assento"}`
        alerta.style.display = "block";
        return;
    } else {
        alerta.style.display = "none";
        let stringAssentos = idAssentos.join(',');
    }
}

exibirAssentos();