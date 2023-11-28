// função que faz a requisição das aeronaves
function requestListaDeAeronave(idAeronave) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch(`http://localhost:3000/listarAeronave/${idAeronave}`, requestOptions)
        .then((response) => response.json());
}
// função que verifica se há ao menos 1 aeronave na lista e preenche a tabela com as informações da primeira aeronave
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
// função que exibe detalhrs da aeronave baseado no ID dela
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