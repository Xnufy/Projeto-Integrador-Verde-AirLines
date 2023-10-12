function requestListaDeAeroportos() {
    const url = new URL(window.location.href);
    const idAeroporto = url.searchParams.get("idAeroporto");
    console.log("Valor de idAeroporto: " + idAeroporto);
    
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch(`http://localhost:3000/listarAeroporto/${idAeroporto}`, requestOptions)
    .then(response => response.json());
}

function preencherInput(aeroportos) {
    if (aeroportos.length > 0) {
        var inputNomeAeroporto = document.getElementById("nomeAeroporto");
        var inputSigla = document.getElementById("sigla");
        var inputNomeCidade = document.getElementById("cidade");

        const primeiroAeroporto = aeroportos[0];

        inputSigla.value = primeiroAeroporto.sigla;
        inputNomeAeroporto.value = primeiroAeroporto.nomeAeroporto;
        inputNomeCidade.value = primeiroAeroporto.nomeCidade;
    }
}

function exibirAeroporto() {
    requestListaDeAeroportos()
    .then(customResponse => {
        if (customResponse.status === "SUCCESS") {
            preencherInput(customResponse.payload);
        } else {
            console.log(customResponse.message);
        }
    })
    .catch((e) => {
        console.log("Não foi possível exibir: " + e);
    });
}

function preencheuAeroporto() {
    var nomeAeroporto = document.getElementById('nomeAeroporto').value;
    return nomeAeroporto.length > 0;
}

function preencheuSigla() {
    var sigla = document.getElementById('sigla').value;
    return sigla.length > 0;
}

function preencheuCidade() {
    var cidade = document.getElementById('cidade').value;
    return cidade.length > 0;
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
    const url = new URL(window.location.href);
    const idAeroporto = url.searchParams.get("idAeroporto");

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    return fetch(`http://localhost:3000/alterarAeroporto/${idAeroporto}`, requestOptions)
    .then(response => response.json());
}

function alterarAeroporto() {
    if (!preencheuAeroporto() || !preencheuSigla() || !preencheuCidade()) {
        showStatusMessage("Preencha todos os campos corretamente.", true);
    } else {
        showStatusMessage("Aguarde, atualizando o aeroporto...", false);

        const sigla = document.getElementById("sigla").value;
        const nomeAeroporto = document.getElementById("nomeAeroporto").value;
        const cidade = document.getElementById("cidade").value;

        fetchInserir({
            sigla: sigla,
            nomeAeroporto: nomeAeroporto,
            nomeCidade: cidade
        })
        .then(resultado => {
            if (resultado.status === "SUCCESS") {
                showStatusMessage("Aeroporto atualizado com sucesso.", false);
            } else {
                showStatusMessage("Erro ao atualizar o aeroporto: " + resultado.message, true);
                console.log(resultado.message);
            }
        })
        .catch(() => {
            showStatusMessage("Erro técnico ao atualizar o aeroporto. Contate o suporte.", true);
            console.log("Falha grave ao atualizar o aeroporto");
        });
    }
}

exibirAeroporto();
