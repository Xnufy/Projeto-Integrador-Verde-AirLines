/**
 * Função que realiza uma requisição para buscar os voos com as escolhas do usuário:
 * data de ida e/ou de volta, local de partida, local de chegada.
 * @param {*} body - corpo da requisição
 * @returns Retorna um JSON contendo os voos com os filtros escolhidos pelo usuário.
 */
function requestPassagem(dataVoo, localOrigem, localDestino, numPassageiros) {
    // Remova a configuração do corpo para solicitações GET
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch(`http://localhost:3000/listarPassagens?dataVoo=${dataVoo}&localOrigem=${localOrigem}&localDestino=${localDestino}&numPassageiros=${numPassageiros}`, requestOptions)
    .then(response => response.json());
}

function buscarPassagemVolta(dataVoo, localOrigem, localDestino, numPassageiros, tipoVoo, idVooIda) {
    const voosDisponiveis = `voosDisponiveis.html?dataVoo=${dataVoo}&localOrigem=${localOrigem}&localDestino=${localDestino}&numPassageiros=${numPassageiros}&tipoVoo=${tipoVoo}&idVooIda=${idVooIda}`;
    window.location.href = voosDisponiveis;
}

/**
 * Função que recebe o array e o índice e vai retorno a duração do voo. Retorna a quantidade
 * de dias, horas e minutos se houver todos esses dados.
 * @param {*} viagens - retorno dos dados da requisição.
 * @param {*} i - índice para acessar o item específico do array.
 * @returns - retorna a duração do voo.
 */
function duracaoVoo(viagens, i) {
    // obtendo as datas de partida e chegada da requisição
    var dataPartidaString = viagens[i].data_partida;
    var dataChegadaString = viagens[i].data_chegada;

    // obtendo as horas de partida e chegada da requisição
    var horaPartidaString = viagens[i].horaPartida;
    var horaChegadaString = viagens[i].horaChegada;

    // separando as partes da data até encontrar "/" e depois
    // armazenando-as em um array
    var partesDataPartida = dataPartidaString.split('/');
    var partesDataChegada = dataChegadaString.split('/');

    // separando as partes da hora até encontrar ":" e depois
    // armazenando-as em um array
    var partesHoraPartida = horaPartidaString.split(':');
    var partesHoraChegada = horaChegadaString.split(':');

    // atribuindo para cada variável dia seu respectivo valor
    var diaPartida = Number(partesDataPartida[0]);
    var diaChegada = Number(partesDataChegada[0]);

    // atriubindo as partes do horário ida/chegada para cada variável
    var horaPartida = Number(partesHoraPartida[0]);
    var minutoPartida = Number(partesHoraPartida[1]);
    var horaChegada = Number(partesHoraChegada[0]);
    var minutoChegada = Number(partesHoraChegada[1]);

    // chega no mesmo dia
    if (diaChegada - diaPartida === 0)
    {
        var duracaoMin = (horaChegada - horaPartida) * 60 + (minutoChegada - minutoPartida);
        var horas = Math.floor(duracaoMin/60);
        var min = duracaoMin % 60;

        if(horas > 0 && min > 0)
            return horas + "h " + min + "min";
        else if (horas <= 0 && min > 0)
            return min + "min";
        else
            return horas + "h";
    }
    // chega no outro dia 
    else {
        var diferencaDia = diaChegada - diaPartida;
        var duracaoMin = (horaChegada - horaPartida) * 60 + (minutoChegada - minutoPartida);
        var horas = Math.floor(duracaoMin/60);
        var min = duracaoMin % 60;

        if(horas > 0 && min > 0)
            return diferencaDia + "d " + horas + "h " + min + "min";
        else if (horas <= 0 && min > 0)
            return diferencaDia + "d " + min + "min";
        else
            return diferencaDia + "d " + horas + "h";
    }
}

/**
 * Função que recebe os dados do voo e monta a estrutura HTML, com classes CSS
 * do Bootstrap e outras personalizadas pela equipe.
 * @param {*} viagens - recebe os dados de cada viagem/voo
 */
function montarListagemPassagens(viagens,numPassageiros ) {
    var containerPrincipal = document.getElementById("container-principal");
    let numeroPassagens = viagens.length;
    var count = 0;
    for (let i = 0; i < viagens.length; i++) {
    if (viagens[i].numAssento - numPassageiros > 0) count++;
    }

    if (numeroPassagens > 0) {
        // div/row(boostrap) que guarda o cabeçalho da passagem
        const containerHeaderViagem = document.createElement("div");
        containerHeaderViagem.classList.add("row");
        containerHeaderViagem.setAttribute("id", "header-viagem");

        // div/col(bootstrap) que guarda o cabeçalho da passagem
        const col1 = document.createElement("div");
        col1.classList.add("col-lg-auto", "text-center", "text-lg-start");
        containerHeaderViagem.appendChild(col1);

        // linha que vai guada os textos do cabeçalho da passagem
        const linhaHeader = document.createElement("span");
        linhaHeader.classList.add("text-sm", "text-md", "text-lg");
        col1.appendChild(linhaHeader);

        // texto - nome da cidade do aeroporto de partida
        const cidadeAeroportoPartida = document.createElement("span");
        cidadeAeroportoPartida.textContent = viagens[0].cidade_aeroporto_partida + " - ";
        linhaHeader.appendChild(cidadeAeroportoPartida); 

        // texto - nome do aeroporto de partida
        const aeroportoPartida = document.createElement("span");
        aeroportoPartida.textContent = viagens[0].nomeSaidaVoo;
        linhaHeader.appendChild(aeroportoPartida)

        // texto - sigla do aeroporto de partida acompanhado de parênteses
        const siglaPartida1 = document.createElement("span");
        siglaPartida1.classList.add("text-sigla");
        siglaPartida1.textContent = " (" + viagens[0].sigla_aeroporto_partida + ") ";
        linhaHeader.appendChild(siglaPartida1);

        // ícone - ícone de seta(Boostrap)
        const iconSeta = document.createElement("i");
        iconSeta.classList.add("fa-solid", "fa-arrow-right");
        iconSeta.style.color = "#000000";
        linhaHeader.appendChild(iconSeta);

        // texto - nome da cidade do aeroporto de chegada
        const cidadeAeroportoChegada = document.createElement("span");
        cidadeAeroportoChegada.textContent = viagens[0].cidade_aeroporto_chegada + " - ";
        linhaHeader.appendChild(cidadeAeroportoChegada);

        // texto - nome do aeroporto de chegada
        const aeroportoChegada = document.createElement("span");
        aeroportoChegada.textContent = viagens[0].nomeChegadaVoo;
        linhaHeader.appendChild(aeroportoChegada);

        // texto - sigla do aeroporto de cehgada acompanhado de parênteses
        const siglaChegada1 = document.createElement("span");
        siglaChegada1.classList.add("text-sigla");
        siglaChegada1.textContent = " (" + viagens[0].sigla_aeroporto_chegada + ")  - ";
        linhaHeader.appendChild(siglaChegada1);

        // texto - data de partida
        const dataPartida = document.createElement("span");
        dataPartida.textContent = viagens[0].data_partida;
        linhaHeader.appendChild(dataPartida);
        
        // container que contém a quantidade de voos retornados pela requisição
        const containerVoosEcontrados = document.createElement("div");
        containerVoosEcontrados.classList.add("col-lg", "text-lg-end", "text-md-center", "text-center", "align-self-end");
        containerHeaderViagem.appendChild(containerVoosEcontrados);

        // texto - número de voos encontrados
        const linhaVoosEncontrados = document.createElement("span");
        linhaVoosEncontrados.classList.add("text-duracao");
        if (viagens.length > 1)
            linhaVoosEncontrados.textContent = count + " voos encontrados";
        else
            linhaVoosEncontrados.textContent = count + " voo encontrado";
        containerVoosEcontrados.appendChild(linhaVoosEncontrados);
        
        // acrescenta todo contéudo que tava em container para a div principal
        containerPrincipal.appendChild(containerHeaderViagem);

        // linha horizontal para separar contéudo do cabeçalho com o conteúdo dos voos
        const hrHeader = document.createElement("hr");
        hrHeader.classList.add("mt-3", "mb-3");
        containerPrincipal.appendChild(hrHeader);

        // loop para acessar todos os voos, montar e preencher a estrutura
        for (let i = 0; i < viagens.length; i++) {
            if (viagens[i].numAssento - numPassageiros > 0){
                // container que guarda todo o conteudo de cada voo
                const containerDadosVoo = document.createElement("div");
                containerDadosVoo.classList.add("dados-voo", "row", "container-sm", "container-md", "container-lg");

                // container/col(bootstrap) vai guarda os dados do voo de partida
                const colDadosPartida = document.createElement("div");
                colDadosPartida.classList.add("col-6", "col-lg-2", "d-flex", "flex-column");
                containerDadosVoo.appendChild(colDadosPartida);

                // span que ta dentro da col que guarda os dados do voo de partida
                const linhaPartida = document.createElement("span");
                
                // span que guarda hora de partida
                const horaPartida = document.createElement("span");
                horaPartida.classList.add("text-hora");
                horaPartida.textContent = viagens[i].horaPartida;
                linhaPartida.appendChild(horaPartida);

                // ícone font-awesome - aviao de partida
                const iconAviaoPartida = document.createElement("i");
                iconAviaoPartida.classList.add("fa-solid", "fa-plane-departure");
                linhaPartida.appendChild(iconAviaoPartida);

                // texto - sigla aeroporto de partida
                const siglaPartida2 = document.createElement("span");
                siglaPartida2.classList.add("text-sigla");
                siglaPartida2.textContent = viagens[i].sigla_aeroporto_partida;

                // texto - duração do voo
                const txtDuracao = document.createElement("span");
                txtDuracao.classList.add("text-duracao");
                txtDuracao.textContent = "Duração: " + duracaoVoo(viagens, i);

                // todos os dados são adicionados na col que tem os dados do voo de partida
                colDadosPartida.appendChild(linhaPartida);
                colDadosPartida.appendChild(siglaPartida2);
                colDadosPartida.appendChild(txtDuracao);    

                // col que o numero do voo é uma linha pontilhada
                const colNumVoo = document.createElement("div");
                colNumVoo.classList.add("col-lg-auto", "d-flex", "flex-column", "text-center", "align-self-center", "d-none", "d-lg-block");
                containerDadosVoo.appendChild(colNumVoo);

                // linha pontilhada
                const spanDashedLine = document.createElement("span");
                const dashedLine = document.createElement("hr")
                dashedLine.classList.add("dashed-line");
                spanDashedLine.appendChild(dashedLine);
                colNumVoo.appendChild(spanDashedLine);
                
                // span que guarda o número de voo
                const spanNumVoo = document.createElement("span");
                spanNumVoo.classList.add("text-sigla");
                spanNumVoo.textContent = "Voo " + viagens[i].idVoo;
                colNumVoo.appendChild(spanNumVoo);

                // container/col(bootstrap) vai guarda os dados do voo de chegada
                const colDadosChegada = document.createElement("div");
                colDadosChegada.classList.add("col-6","col-lg-auto", "d-flex", "flex-column", "text-end", "text-lg-start");
                containerDadosVoo.appendChild(colDadosChegada);

                // span que ta dentro da col que guarda os dados do voo de chegada
                const linhaChegada = document.createElement("span");

                // icone font-awesome avião chegando
                const iconAviaoChegada = document.createElement("i");
                iconAviaoChegada.classList.add("fa-solid", "fa-plane-arrival");
                linhaChegada.appendChild(iconAviaoChegada);

                // texto - hora de chegada
                const horaChegada = document.createElement("span");
                horaChegada.classList.add("text-hora");
                horaChegada.textContent = viagens[i].horaChegada;
                linhaChegada.appendChild(horaChegada);
                
                // texto - sigla aeroporto chegada
                const siglaChegada2 = document.createElement("span");
                siglaChegada2.classList.add("text-sigla");
                siglaChegada2.textContent = viagens[i].sigla_aeroporto_chegada

                // todos os dados realcionados ao voo de chegada são adicionados no col
                colDadosChegada.appendChild(linhaChegada);
                colDadosChegada.appendChild(siglaChegada2);

                // container/col que vai guarda dados pertinentes ao valor do voo
                const colValor = document.createElement("div");
                colValor.classList.add("col-lg", "d-flex", "flex-column", "text-end", "align-self-lg-center");
                colValor.setAttribute("id", "container-valor")
                containerDadosVoo.appendChild(colValor);

                // span que engloba os dados do valor
                const spanValor = document.createElement("span");
                colValor.appendChild(spanValor);

                // span que guarda o "R$" com classes estilizidas
                const simboloReal = document.createElement("span");
                simboloReal.classList.add("text-preco", "simbolo-real");
                simboloReal.textContent = "R$";
                spanValor.appendChild(simboloReal);

                // span que guarda o botão de confirmar voo
                const spanBtn = document.createElement("span");
                colValor.appendChild(spanBtn);
                const btnConfirmarCompra = document.createElement("button");
                btnConfirmarCompra.type = "button";
                btnConfirmarCompra.classList.add("btn", "btn-success");
                btnConfirmarCompra.setAttribute("id", viagens[i].idVoo);
                btnConfirmarCompra.textContent = "Escolher Voo";
                spanBtn.appendChild(btnConfirmarCompra);

                // texto - valor do voo
                const preco = document.createElement("span");
                preco.classList.add("text-preco");
                preco.textContent = viagens[i].valor.toFixed(2).replace('.', ',');
                spanValor.appendChild(preco);

                containerDadosVoo.setAttribute("id", viagens[i].idVoo);
                containerPrincipal.appendChild(containerDadosVoo);
            }
        }
    }
}

/**
 * Função que vai exibir todos os dados na página. Busca todos os parâmetros
 * da URL da página que fora montado anteriormente quando o usuário escolheu
 * os filtros do voo. Depois disso, é realizado a requisição, consecutivamente,
 * a montagem dos dados da passagem.
 */
function exibirViagens() {
    // Obtenha a string da consulta da URL
    const queryString = window.location.search;

    // Crie um objeto URLSearchParams a partir da string da consulta
    const urlParams = new URLSearchParams(queryString);

    // Obtenha os valores dos parâmetros da URL
    const dataVoo = urlParams.get('dataVoo');
    const localOrigem = urlParams.get('localOrigem');
    const localDestino = urlParams.get('localDestino');
    var numPassageiros = urlParams.get('numPassageiros');
    var tipoVoo = urlParams.get('tipoVoo');
    var dataVolta = urlParams.get('dataVolta');
    var idVooIda = urlParams.get('idVooIda');

    requestPassagem(dataVoo, localOrigem, localDestino, numPassageiros)
    .then(customResponse => {
        if (customResponse.status === "SUCCESS") {
            montarListagemPassagens(JSON.parse(JSON.stringify(customResponse.payload)), numPassageiros);

            // Obtenha os botões após a montagem da lista de passagens
            var btnsConfirmarCompra = document.querySelectorAll(".btn.btn-success");

            if (tipoVoo === "idaVolta") {
                btnsConfirmarCompra.forEach(btn => {
                    btn.addEventListener("click", e => {
                        buscarPassagemVolta(dataVolta, localDestino, localOrigem, numPassageiros, "volta", e.target.id);
                    });
                });
            } else if(tipoVoo === "ida") {
                btnsConfirmarCompra.forEach(btn => {
                    btn.addEventListener("click", e => {
                        const mapaAssentosPage = `mapaAssentos.html?idVooIda=${e.target.id}&tipoVoo=${tipoVoo}&numPassageiros=${numPassageiros}`;
                        // Redirecione para a página de mapa de assentos
                        window.location.href = mapaAssentosPage;
                    });
                });
            } else {
                btnsConfirmarCompra.forEach(btn => {
                    btn.addEventListener("click", e => {
                        const mapaAssentosPage = `mapaAssentos.html?idVooIda=${idVooIda}&idVooVolta=${e.target.id}&tipoVoo=idaVolta&numPassageiros=${numPassageiros}`;
                        // Redirecione para a página de mapa de assentos
                        window.location.href = mapaAssentosPage;
                    });
                });
            }
        } else {
            alert(customResponse.messagem);
            window.location.href = 'home.html';
        }
    })
    .catch(() => {
        alert("Erro: voltando à página principal");
        window.location.href = 'home.html';
    });

}

exibirViagens();