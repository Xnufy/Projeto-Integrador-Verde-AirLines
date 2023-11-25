function preencheuOrigem(){
    let resultado = false; 
    var listarAeroportos = document.getElementById("comboAeroportos");
    var valorSelecionado = listarAeroportos.value;
    // se quiséssemos obter o TEXTO selecionado. 
    // var text = listaOrigens.options[listaOrigens.selectedIndex].text;
    if (valorSelecionado !== "0"){
        resultado = true;
    }
    return resultado;
}

function preencheuDestino(){
    let resultado = false; 
    var listaAeroportosDestino = document.getElementById("comboAeroportosDestino");
    var valorSelecionado = listaAeroportosDestino.value;
    // se quiséssemos obter o TEXTO selecionado. 
    // var text = listaDestinos.options[listaDestinos.selectedIndex].text;
    if (valorSelecionado !== "0"){
        resultado = true;
    }
    return resultado;
}

function showStatusMessage(msg, error) {
    var pStatus = document.getElementById("status");
    if (error === true)
        pStatus.className = "statusError";
    else
        pStatus.className = "statusSuccess";
    pStatus.textContent = msg;
}

function fetchInserir(body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    return fetch('http://localhost:3000/inserirTrecho', requestOptions)
    .then(response => response.json())
}

function inserirTrecho() {
    if(!preencheuOrigem()) {
        showStatusMessage("Preencha a origem...", true);
        return;
    } else
        showStatusMessage("", false);
        
    if(!preencheuDestino()) {
        showStatusMessage("Preencha o destino...", true);
        return;
    } else
        showStatusMessage("", false);

    const origem = document.getElementById("comboAeroportos").value;
    const destino = document.getElementById("comboAeroportosDestino").value;

    fetchInserir({
        origem: origem,
        destino: destino
    })
    .then(resultado => {
        if(resultado.status === "SUCCESS") {
            showStatusMessage("Trecho cadastrado...", false);
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