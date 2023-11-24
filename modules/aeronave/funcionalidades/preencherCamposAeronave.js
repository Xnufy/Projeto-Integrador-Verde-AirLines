function requestListaDeAeronave(idAeronave) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch(`http://localhost:3000/listarAeronave/${idAeronave}`, requestOptions)
        .then((response) => response.json());
}

function preencherInput(aeronaves) {
    if (aeronaves.length > 0) {
        var inputModelo = document.getElementById("modelo");
        var selectFabricante = document.getElementById("comboFabricantes");
        var inputRegistro = document.getElementById("registro");
        var inputAnoFabricacao = document.getElementById("anoFabricacao");
        var inputNumLinha = document.getElementById("num_linha");
        var inputNumColuna = document.getElementById("num_coluna");

        const primeiraAeronave = aeronaves[0];

        inputModelo.value = primeiraAeronave.modelo;
        selectFabricante.value = primeiraAeronave.fabricante;
        inputRegistro.value = primeiraAeronave.registro;
        inputAnoFabricacao.value = primeiraAeronave.anoFabricacao;
        inputNumLinha.value = primeiraAeronave.linhasAssentos;
        inputNumColuna.value = primeiraAeronave.colunasAssentos;
    }
}

function exibirAeronave() {
        const url = new URL(window.location.href);
        const idAeronave = url.searchParams.get("idAeronave");
        
        requestListaDeAeronave(idAeronave)
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
}

exibirAeronave();