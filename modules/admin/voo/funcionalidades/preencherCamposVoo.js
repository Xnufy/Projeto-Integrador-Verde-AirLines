function requestListaDeTrechos() {
  const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
  };
  return fetch('http://localhost:3000/listarTrecho', requestOptions)
      .then((response) => response.json());
}

function preencherComboBoxTrecho(trechos) {
  var comboBox = document.querySelector("#comboTrecho");

  let trecho = "";
  let currentGroup = null;

  for (let i = 0; i < trechos.length; i++) {
    trecho = trechos[i];

    if (currentGroup !== trecho.nomeAeroportoOrigem) {
      currentGroup = trecho.nomeAeroportoOrigem;
      const optgroup = document.createElement("optgroup");
      optgroup.label = "Origem: " + currentGroup;
      comboBox.appendChild(optgroup);
    }

    const option = document.createElement("option");
    option.value = trecho.idTrecho;
    option.text = "Chegada: " + trecho.nomeAeroportoDestino;
    comboBox.lastChild.appendChild(option);
  }
}

function exibirTrechos() {
  return requestListaDeTrechos().then((customResponse) => {
      if (customResponse.status === "SUCCESS") {
          preencherComboBoxTrecho(customResponse.payload);
      } else {
          console.log(customResponse.messagem);
      }
  });
}

function requestListaDeVoos(idVoo) {
  const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
  };
  return fetch(`http://localhost:3000/listarVoos/${idVoo}`, requestOptions)
      .then((response) => response.json());
}

function preencherInput(voos) {
  if (voos.length > 0) {
    var id_trecho = document.getElementById("comboTrecho");
    var dataPartida = document.getElementById("dataPartida");
    var horaPartida = document.getElementById("horaPartida");
    var dataChegada = document.getElementById("dataChegada");
    var horaChegada = document.getElementById("horaChegada");
    var aeronave = document.getElementById("comboAeronaves");
    var preco = document.getElementById("preco");

    var primeiroVoo = voos[0];

    function converterDataFormato(data) {
      // Divida a string da data pelos caracteres "/"
      const partes = data.split("/");

      // Partes[0] é o dia, Partes[1] é o mês e Partes[2] é o ano
      const dia = partes[0];
      const mes = partes[1];
      const ano = partes[2];

      // Crie um objeto Date com o formato desejado

      const dataFormatada = new Date(`${ano}-${mes}-${dia}`);

      // Use o método toISOString() para obter a data formatada como "yyyy-MM-dd"
      const dataFinal = dataFormatada.toISOString().split("T")[0];

      return dataFinal;
    }

    const dataPartidaFormatada = converterDataFormato(primeiroVoo.data_partida);
    const dataChegadaFormatada = converterDataFormato(primeiroVoo.data_partida);
    id_trecho.value = primeiroVoo.trecho;
    dataPartida.value = dataPartidaFormatada;
    horaPartida.value = primeiroVoo.horaPartida;
    dataChegada.value = dataChegadaFormatada;
    horaChegada.value = primeiroVoo.horaChegada;
    aeronave.value = primeiroVoo.idAeronave;
    preco.value = primeiroVoo.valor;
  }
}

function exibirVoo() {
  return exibirTrechos().then(() => {
      const url = new URL(window.location.href);
      const idVoo = url.searchParams.get("idVoo");

      requestListaDeVoos(idVoo)
          .then((customResponse) => {
              if (customResponse.status === "SUCCESS") {
                  console.log(customResponse.payload)
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

exibirVoo();