function requestListaDeAeroportos() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch('http://localhost:3000/listarAeroportos', requestOptions)
        .then((response) => response.json());
}

function preencherComboBox(aeroportos) {
    var comboBox = document.querySelector("#comboAeroportos");

    aeroportos.forEach((aeroporto) => {
        const option = document.createElement("option");
        option.value = aeroporto.idAeroporto;
        option.text = aeroporto.nomeAeroporto;
        comboBox.appendChild(option);
    });
}

function preencherComboBoxDestino(aeroportos) {
    var comboBoxDestino = document.querySelector("#comboAeroportosDestino");

    aeroportos.forEach((aeroporto) => {
        const option = document.createElement("option");
        option.value = aeroporto.idAeroporto;
        option.text = aeroporto.nomeAeroporto;
        comboBoxDestino.appendChild(option);
    });
}

function exibirAeroportos() {
    return requestListaDeAeroportos().then((customResponse) => {
        if (customResponse.status === "SUCCESS") {
            preencherComboBox(customResponse.payload);
            preencherComboBoxDestino(customResponse.payload);
        } else {
            console.log(customResponse.messagem);
        }
    });
}

function requestListaDeTrecho(idTrecho) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch(`http://localhost:3000/listarTrechos/${idTrecho}`, requestOptions)
        .then((response) => response.json());
}

function preencherInput(trechos) {
    if (trechos.length > 0) {
        var selectOrigem = document.getElementById("comboAeroportos");
        var selectDestino = document.getElementById("comboAeroportosDestino");

        const primeiroTrecho = trechos[0];
        selectOrigem.value = primeiroTrecho.origem;
        selectDestino.value = primeiroTrecho.destino;
    }
}

function exibirTrecho() {
    return exibirAeroportos().then(() => {
        const url = new URL(window.location.href);
        const idTrecho = url.searchParams.get("idTrecho");

        requestListaDeTrecho(idTrecho)
            .then((customResponse) => {
                if (customResponse.status === "SUCCESS") {
                    preencherInput(customResponse.payload);
                } else {
                    console.log(customResponse.message);
                }
            })
            .catch((e) => {
                console.log("Não foi possível exibir: " + e);
            });
    });
}

exibirTrecho();