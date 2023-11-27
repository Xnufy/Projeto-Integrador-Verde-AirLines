function confirmarPagamento() {
    // Obtenha a string da consulta da URL
    const queryString = window.location.search;

    // Crie um objeto URLSearchParams a partir da string da consulta
    const urlParams = new URLSearchParams(queryString);

    // Obtenha os valores dos parâmetros da URL
    var numPassageiros = urlParams.get('numPassageiros');
    var assentosIda = urlParams.get('assentosIda')
    var tipoVoo = urlParams.get('tipoVoo');
    var idVooIda = urlParams.get('idVooIda');
    var idVooIda = urlParams.get('idVooVolta');

    var arrayIdAssentos = assentosIda.split(",");
}

confirmarPagamento();