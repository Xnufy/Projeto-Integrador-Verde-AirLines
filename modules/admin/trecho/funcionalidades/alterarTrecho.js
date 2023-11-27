// funcao que verifica se selecionou ou não o fabricante.
function selecionouOrigem(){
    let resultado = false; 
    var listaOrigens = document.getElementById("comboAeroportos");
    var valorSelecionado = listaOrigens.value;
    // se quiséssemos obter o TEXTO selecionado. 
    // var text = listaFabricantes.options[listaFabricantes.selectedIndex].text;
    if (valorSelecionado !== "0"){
        resultado = true;
    }
    return resultado;
}

// funcao que verifica se selecionou ou não o fabricante.
function selecionouDestino(){
    let resultado = false; 
    var listaDestinos = document.getElementById("comboAeroportosDestino");
    var valorSelecionado = listaDestinos.value;
    // se quiséssemos obter o TEXTO selecionado. 
    // var text = listaFabricantes.options[listaFabricantes.selectedIndex].text;
    if (valorSelecionado !== "0"){
        resultado = true;
    }
    return resultado;
}

// funcao para exibir mensagem de status... seja qual for. 
function showStatusMessage(msg, error) {
    var pStatus = document.getElementById("status");
    if (error === true)
        pStatus.className = "statusError";
    else
        pStatus.className = "statusSuccess";
    pStatus.textContent = msg;
}

function fetchInserir(body) {
    const url = new URL(window.location.href);
    const idTrecho = url.searchParams.get("idTrecho");

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    return fetch(`http://localhost:3000/alterarTrecho/${idTrecho}`, requestOptions)
    .then(response => response.json());
}

function alterarTrecho() {
    if(!selecionouOrigem()){
    showStatusMessage("Selecione a Origem...", true);  
    return;
    } else
    showStatusMessage("", false);

    if(!selecionouDestino()) {
        showStatusMessage("Selecione o Destino...", true);
        return
    } else
        showStatusMessage("", false);

    // se chegou até aqui a execução do código, vamos cadastrar a aeronave. 
    // obtendo os dados: 
    const origem = document.getElementById("comboAeroportos").value;
    const destino = document.getElementById("comboAeroportosDestino").value;

    fetchInserir({
        origem: origem, 
        destino: destino
    })
    .then(resultado => {
        if(resultado.status === "SUCCESS") {
            showStatusMessage("Trecho atualizado.", false);
        } else if (resultado.status === "ERROR") {
            showStatusMessage(resultado.messagem, true);
        }
    })
    .catch((e) => {
        showStatusMessage("Falha grave ao cadastrar. Verifique sua conexão ou tente novamente mais tarde.", true);
        console.log("Falha grave ao cadastrar", e);
        }
    );
}