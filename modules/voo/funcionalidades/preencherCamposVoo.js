function requestListaDeAeroportos() {
  const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
  };
  return fetch('http://localhost:3000/listarTrecho', requestOptions)
      .then((response) => response.json());
}

function preencherComboBox(aeroportos) {
  var comboBox = document.querySelector("#comboTrecho");

  let aeroporto = "";
  let currentGroup = null;

  for (let i = 0; i < aeroportos.length; i++) {
    aeroporto = aeroportos[i];

    if (currentGroup !== aeroporto.nomeAeroportoOrigem) {
      currentGroup = aeroporto.nomeAeroportoOrigem;
      const optgroup = document.createElement("optgroup");
      optgroup.label = "Origem: " + currentGroup;
      comboBox.appendChild(optgroup);
    }

    const option = document.createElement("option");
    option.value = aeroporto.idTrecho;
    option.text = "Chegada: " + aeroporto.nomeAeroportoDestino;
    comboBox.lastChild.appendChild(option);
  }
}

function exibirAeroportos() {
  return requestListaDeAeroportos().then((customResponse) => {
      if (customResponse.status === "SUCCESS") {
          preencherComboBox(customResponse.payload);
      } else {
          console.log(customResponse.messagem);
      }
  });
}

function requestListaDeAeronave(idAeronave) {
  const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
  };
  return fetch(`http://localhost:3000/listarVoos/${idAeronave}`, requestOptions)
      .then((response) => response.json());
}

function preencherInput(voos) {
  if (voos.length > 0) {
      var numVoo = document.getElementById("numVoo");
      var id_trecho = document.getElementById("comboTrecho");
      var data = document.getElementById("data");
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
        const dataFinal = dataFormatada.toISOString().split('T')[0];
      
        return dataFinal;
      }

      const dataFormatada = converterDataFormato(primeiroVoo.data);

      numVoo.value = primeiroVoo.idVoo;
      id_trecho.value = primeiroVoo.trecho;
      data.value = dataFormatada;
      preco.value = primeiroVoo.valor;
  }
}

function exibirAeronave() {
  return exibirAeroportos().then(() => {
      const url = new URL(window.location.href);
      const idVoo = url.searchParams.get("idVoo");

      requestListaDeAeronave(idVoo)
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

exibirAeronave();