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
        var inputUf = document.getElementById("uf");

        const primeiroAeroporto = aeroportos[0];

        inputSigla.value = primeiroAeroporto.sigla;
        inputNomeAeroporto.value = primeiroAeroporto.nomeAeroporto;
        inputNomeCidade.value = primeiroAeroporto.nomeCidade;
        inputUf.value = primeiroAeroporto.uf;
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

function preencheuUf() {
    var uf = document.getElementById('uf').value;
    return uf.length === 2;
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

    if(!preencheuUf()) {
        showStatusMessage("Preencha o nome da UF cidade...", true);
        return;
    } else
        showStatusMessage("", false);
        

    const sigla = document.getElementById("sigla").value;
    const nomeAeroporto = document.getElementById("nomeAeroporto").value;
    const cidade = document.getElementById("cidade").value;
    const uf = document.getElementById("uf").value;

    fetchInserir({
        sigla: sigla,
        nomeAeroporto: nomeAeroporto,
        nomeCidade: cidade,
        uf: uf
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


exibirAeroporto();
