function preencheuAeroporto() {
    let resultado = false;
    var nomeAeroporto = document.getElementById('nomeAeroporto').value;
    
    if (nomeAeroporto.length > 0)
        resultado = true;

    return resultado;
}

function preencheuSigla() {
    resultado = false;
    var sigla = document.getElementById('sigla').value;

    if(sigla.length > 0)
        resultado = true;

    return resultado;
}

function preencheuCidade() {
    resultado = false;
    var cidade = document.getElementById('cidade').value;

    if(cidade.length > 0)
        resultado = true;

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

    return fetch('http://localhost:3000/inserirAeroporto', requestOptions)
    .then(response => response.json())
}

function inserirAeroporto() {
    if(!preencheuAeroporto()) {
        showStatusMessage("Preencha o nome do aeroporto...", true);
        return;
    } else
        showStatusMessage("", false);
        
    if(!preencheuSigla()) {
        showStatusMessage("Preencha a sigla...", true);
        return;
    } else
        showStatusMessage("", false);

    if(!preencheuCidade()) {
        showStatusMessage("Preencha o nome da cidade...", true);
        return;
    } else
        showStatusMessage("", false);

    const sigla = document.getElementById("sigla").value;
    const nomeAeroporto = document.getElementById("nomeAeroporto").value;
    const cidade = document.getElementById("cidade").value;

    fetchInserir({
        sigla: sigla,
        nomeAeroporto: nomeAeroporto,
        nomeCidade: cidade
    })
    .then(resultado => {
        if(resultado.status === "SUCCESS")
            showStatusMessage("Aeroporto cadastrado...", false);
        else {
            showStatusMessage("Erro ao cadastrar aeroporto..." + message, true);
            console.log(resultado.message);
        }
    })
    .catch(() => {
        showStatusMessage("Erro técnico ao cadastrar... Contate o suporte.", true);
        console.log("Falha grave ao cadastrar");
    }) 
}