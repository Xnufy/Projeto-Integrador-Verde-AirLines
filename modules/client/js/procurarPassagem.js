/**
 * Função que verifica se o combo box que contém as origens
 * foi selecionado.
**/
function selecionouOrigem() {
    let resultado = false;
    var origem = document.getElementById('selectOrigem').value;
    
    if (origem !== '')
        resultado = true;

    return resultado;
}

/**
 * Função que verifica se o combo box que contém os destinos
 * foi selecionado.
 */
function selecionouDestino() {
    resultado = false;
    var destino = document.getElementById('selectDestino').value;

    if(destino !== '')
        resultado = true;

    return resultado;
}

/**
 * Função que verifica se algum dos rádios foram ativados.
 */

function selecionouTipoVoo() {
    resultado = false;
    var radioIda = document.getElementById('radioIda');
    var radioIdaVolta = document.getElementById('radioIdaVolta');

    if(radioIda.checked || radioIdaVolta.checked)
        resultado = true;

    return resultado;
}

/**
 * Função que verifica se o usuário selecionou a data, tanto a de ida
 * quanto a de volta. a validação depende de qual rádio foi ativado.
 * @returns {number} `0` = o campo de data ida não foi preenchido.
 *                   `1` = o campo de data volta não foi preenchido.
 *                   `2` = os campos data foram preenchidos.
 */
function selecionouData() {
    var resultado = 2;
    var radioIda = document.getElementById('radioIda');
    var radioIdaVolta = document.getElementById('radioIdaVolta');
    var dataIda = document.getElementById('dataIda');
    var dataVolta = document.getElementById('dataVolta');

    if (radioIda.checked && dataIda.value === '') {
        resultado = 0;
    } else if (radioIdaVolta.checked) {
        if (dataIda.value === '') {
            resultado = 0;
        } else if (dataVolta.value === '') {
            resultado = 1;
        }
    }

    return resultado;
}

/**
 * Função que verifica se as datas escolhidas são validas.
 * @returns {boolean} `true` caso a data de volta seja maior que a data de ida.
 *                    `false` caso a data de volta seja menor que a de ida.
 */
function validaData() {
    var resultado = true;
    var radioIdaVolta = document.getElementById('radioIdaVolta');
    var dataIda = document.getElementById('dataIda').value;
    var dataVolta = document.getElementById('dataVolta').value;

    if (radioIdaVolta.checked && new Date(dataVolta).getTime() < new Date(dataIda).getTime()) {
        resultado = false;
    }

    return resultado;
}

/**
 * Função que verifica se o campo passageiros foi preenchido. Além disso, valida
 * se o número lá inserido foi positivo maior que zero.
 * @returns {number} `0` o campo não foi preenchido.
 *                   `1` o campo preenchido contém um valor negativo ou igual a zero.
 *                   `2` o campo foi preenchido corretamente
 */
function preencheuNumeroPassageiros() {
    var resultado = 0;
    var passageiros = document.getElementById('passageirosInput').value;

    if (passageiros === '')   
        resultado = 0;
    else if (Number(passageiros) <= 0)
        resultado = 1;
    else
        resultado = 2;

    return resultado;
}

/**
 * Função que exibe uma mensagem personalizada para o usuário.
 * @param {string} msg - mensagem que vai ser exibida para o usuário 
 * @param {boolean} error - `true` se há erro. `false` não há erro.
 */
function showStatusMessage(msg, error) {
    var pStatus = document.getElementById("status");
    if (error === true)
        pStatus.className = "statusError";
    else 
        pStatus.className = "statusSuccess";

    pStatus.textContent = msg;
}

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
 * Função que utiliza da requisição requestPassagem para realizar as buscas de acordo com o filtro
 * do usuário. O usuário receberá um retorno se foi encontrado a requisição ou se deu erro.
 * @param {*} dataVoo - data do voo de ida selecionado pelo usuário.
 * @param {*} localOrigem - local de origem selecionado pelo usuário.
 * @param {*} localDestino - local de destino selecionado pelo usuário.
 * @param {*} numPassageiros  - número de bilhetes que serão comprados/número de passageiros a ser alocados.
 * @param {*} tipoVoo - tipo de voo, se é ida ou se é ida e volta.
 * @param {*} dataVolta - data de volta, caso o voo for ida e volta.
 */
function buscarPassagem(dataVoo, localOrigem, localDestino, numPassageiros, tipoVoo, dataVolta) {
    if (tipoVoo === "ida") {
        requestPassagem(dataVoo, localOrigem, localDestino, localOrigem, numPassageiros)
        .then(responseIda => {
            if (responseIda.status === "SUCCESS") {
                const voosDisponiveis = `voosDisponiveis.html?dataVoo=${dataVoo}&localOrigem=${localOrigem}&localDestino=${localDestino}&numPassageiros=${numPassageiros}&tipoVoo=${tipoVoo}`;
                window.location.href = voosDisponiveis;
            } else {
                showStatusMessage("Voo de ida não foi encontrado.", true);
            }
        })
        .catch(() => {
            showStatusMessage("Erro ao buscar passagens: Tente novamente", true);
        });
    } else {
        requestPassagem(dataVoo, localOrigem, localDestino, numPassageiros)
        .then(responseIda => {
            if (responseIda.status === "SUCCESS") {
                // Se a passagem de ida for encontrada, procurar a de volta
                return requestPassagem(dataVolta, localDestino, localOrigem, numPassageiros);
            } else {
                showStatusMessage("Voo de ida não foi encontrado.", true);
            }
        })
        .then(responseVolta => {
            if (responseVolta.status === "SUCCESS") {
                const voosDisponiveis = `voosDisponiveis.html?dataVoo=${dataVoo}&localOrigem=${localOrigem}&localDestino=${localDestino}&numPassageiros=${numPassageiros}&tipoVoo=${tipoVoo}&dataVolta=${dataVolta}`;
                window.location.href = voosDisponiveis;
            } else {
                showStatusMessage("Voo de volta não foi encontrado.", true);
            }
        })
        .catch(() => {
            showStatusMessage("Erro ao buscar passagens: Tente novamente", true);
        });
    }
}


/**
 * Ao clicar no botão confirmar é validado todos os campos(é verificado se foi preenchido e se os valores são válidos).
 * Se os campos estiverem corretos a requisição é realizada. O usuário será redirecionado para outra página, lá estará
 * disponíveis os voos ou então será exibido uma mensagem de erro(não existem voos com aqueles filtros).
 */
function confirmarBusca() {
    var btnSubmit = document.getElementById('btn-submit');
    btnSubmit.addEventListener("click", e => {
        e.preventDefault();
    })

    if(!selecionouOrigem()) return;
    else    showStatusMessage("", false);
        
    if(!selecionouDestino())    return;
    else    showStatusMessage("", false);

    if(!selecionouTipoVoo())    return;
    else showStatusMessage("", false);

    var flagData = selecionouData();
    if(flagData === 0)  return;
    else if (flagData === 1)    return;

    if (!validaData()) {
        showStatusMessage("Data de volta inválida", true);
        return;
    }   else    showStatusMessage("", false);

    var flagPassageiros = preencheuNumeroPassageiros();
    if(flagPassageiros === 0)   return
    else if(flagPassageiros === 1) {
        showStatusMessage("Número de passageiros inválido", true);
        return;
    }
    else
        showStatusMessage("", false);

    var radioIda = document.getElementById('radioIda');
    var radioIdaVolta = document.getElementById('radioIdaVolta');

    const dataIda = document.getElementById('dataIda');
    const dataIdaAux = new Date(dataIda.value);
    var dataIdaFormatada = dataIdaAux.toLocaleDateString('pt-BR', {timeZone: 'UTC'});

    const dataVolta = document.getElementById('dataVolta');
    const dataVoltaAux = new Date(dataVolta.value)
    var dataVoltaFormatada = dataVoltaAux.toLocaleDateString('pt-BR', {timeZone: 'UTC'});

    const selectOrigem = document.getElementById('selectOrigem');
    const optionOrigem = selectOrigem.options[selectOrigem.selectedIndex];
    const localOrigem = optionOrigem.text;

    const selectDestino = document.getElementById('selectDestino');
    const optionDestino = selectDestino.options[selectDestino.selectedIndex];  
    const localDestino = optionDestino.text;

    const numPassageiros = document.getElementById('passageirosInput').value;

    if(radioIda.checked)
        buscarPassagem(dataIdaFormatada, localOrigem, localDestino, numPassageiros, "ida", dataVoltaFormatada);
    else 
        buscarPassagem(dataIdaFormatada, localOrigem, localDestino, numPassageiros, "idaVolta", dataVoltaFormatada);

}

(() => {
    "use strict";

    // Buscar todos os formulários nos quais queremos aplicar estilos de validação personalizados do Bootstrap
    const forms = document.querySelectorAll(".needs-validation");

    // Loop sobre eles e prevenir a submissão ao clicar no botão
    Array.from(forms).forEach((form) => {
        const btnSubmit = form.querySelector("[type='button']");

        btnSubmit.addEventListener(
            "click",
            (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add("was-validated");
            },
            false
        );
    });
})();
