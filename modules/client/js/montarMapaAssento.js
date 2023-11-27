function requestMapaAssento(idVoo) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch(`http://localhost:3000/reservaAssento/${idVoo}`, requestOptions)
    .then(response => response.json());
}

function montarMapaAssentos(assentos, idVoo) {
    var linhas = assentos[0].numLinhasAssento;
    var colunas = assentos[0].numColunasAssento;

    var containerAssentos = document.getElementById('assentos-container');
    

    for (let i = 1; i <= linhas; i++) {
        const ul = document.createElement('ul');
        ul.className = 'linha';
        for (let j = 1; j <= colunas; j++) {
            const li = document.createElement('li');
            li.id = `${i}${j}`;
            li.innerHTML = '<span><i class="fa-solid fa-couch"></i></span>';
            ul.appendChild(li);
        }
        divMapa.appendChild(ul);
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
    
    requestMapaAssento(idVoo)
    .then(customResponse => {
        if(customResponse.status === "SUCCESS") {
            if(tipoVoo === "ida") {console.log(2)}
            else if(tipoVoo === "idaVolta"){console.log(3)}
            else {

            }
        }
    })
}

function assentoHover(element) {
    var btnsDisponiveis = document.querySelectorAll(".livre")
    btnsDisponiveis.forEach( btn => {
            btn.setAttribute("src", "../../assents/img/assento-")
        }
    )
}

function assentoDefault(element) {
    element.setAttribute("src", "../../assets/img/assento-azul.png")
}
