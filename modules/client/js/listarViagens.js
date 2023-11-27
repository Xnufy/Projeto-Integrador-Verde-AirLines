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

/**
 * Função que vai redirecionar o usuário para a listagem dos voos de volta disponíveis.
 * Com base nos parâmetros vai ser montado a url da próxima página que o usuário vai acessar.
 * @param {*} dataVoo - no caso será a data voo de volta
 * @param {*} localOrigem - nome do aeroporto de partida
 * @param {*} localDestino - nome do aeroporto de chegada
 * @param {*} numPassageiros - número de bilhetes que vão ser comprados
 * @param {*} tipoVoo - tipo do voo: 'ida', 'idaVolta' ou 'volta'
 * @param {*} idVooIda - id do voo de ida escolhido
 */
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
 * @param {*} numPassageiros - número de passageiros a serem alocados ou número de bilhetes que vão ser comprados
 */
function montarListagemPassagens(viagens,numPassageiros ) {
    var containerPrincipal = document.getElementById("container-principal");
    let numeroPassagens = viagens.length;
    
    // verifica na requisição os voos que tem assentos disponiveis
    // com base no número de bilhetes que o usuário deseja.
    // Armazena em count, o número de voos com os assentos disponiveis
    var count = 0;
    for (let i = 0; i < viagens.length; i++) {
        if (viagens[i].numAssento - numPassageiros > 0) count++;
    }

    if (numeroPassagens > 0) {
        containerPrincipal.innerHTML += 
		`
		<div class="container-lg container-sm containder-md]">
		  <div class="row">
			<div class="col-lg-auto text-center text-lg-start">
                <span class="text-sm text-md text-lg">
                    ${viagens[0].cidade_aeroporto_partida} -
                    ${viagens[0].nomeSaidaVoo}
                    <span class="text-sigla">(${viagens[0].sigla_aeroporto_partida})</span>
                    <i class="fa-solid fa-arrow-right"></i>
                    ${viagens[0].cidade_aeroporto_chegada} - ${viagens[0].nomeChegadaVoo}
                    <span class="text-sigla">(${viagens[0].sigla_aeroporto_chegada})</span>
                    - ${viagens[0].data_partida}
                </span>
			</div>
			<div class="col-lg text-lg-end text-md-center text-center align-self-end">
                <span class="text-duracao">
					${(viagens.length > 1) ? count + " voos encontrados" : count + " voo encontrado"}
				</span>
			</div>
		  </div>
		  <hr class="mt-3 mb-3" />
		`

        // loop para acessar todos os voos, montar e preencher a estrutura
        for(let i = 0; i < viagens.length; i++) {
			if(viagens[i].numAssento - numPassageiros > 0) {
				containerPrincipal.innerHTML += 
				`
				<div class="row dados-voo container-sm container-md container-lg">
					<div class="col-6 col-lg-2 d-flex flex-column">
					  <span
						><span class="text-hora" id="hora-partida">${viagens[i].horaPartida}</span
						><i class="fa-solid fa-plane-departure" style="color: #000000"></i
					  ></span>
					  <span class="text-sigla" id="sigla-partida">${viagens[i].sigla_aeroporto_partida}</span>
					  <span class="text-duracao">${"Duração: " + duracaoVoo(viagens, i)}</span>
					</div>
					<div class="col-lg-auto d-flex flex-column text-center align-self-center d-none d-lg-block">
					  <span><hr class="dashed-line" /></span>
					  <span class="text-sigla">${"Voo " + viagens[i].idVoo}</span>
					</div>
					<div class="col-6 col-lg-auto d-flex flex-column text-end text-lg-start">
					  <span
						><i class="fa-solid fa-plane-arrival" style="color: #000000"></i>
						<span class="text-hora" id="hora-chegada">${viagens[i].horaChegada}</span>
					  </span>
					  <span class="text-sigla" id="sigla-chegada">${viagens[i].sigla_aeroporto_chegada}</span>
					</div>
					<div class="col-lg d-flex flex-column text-end align-self-lg-center">
						<span>
							<span class="text-preco simbolo-real">R$</span>
							<span class="text-preco">${viagens[i].valor.toFixed(2).replace('.', ',')}</span>
						</span>
						<span>
							<button type="button" class="btn btn-success" id="${viagens[i].idVoo}">
								Escolher Voo
							</button>
						</span>
					  
					</div>
				  </div>
				</div>
			    `
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