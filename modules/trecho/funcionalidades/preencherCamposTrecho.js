var selectElementComboOrigem = document.getElementById("comboAeroportos");
var selectElementComboDestino = document.getElementById("comboAeroportosDestino");
var responseAeroportos;

selectElementComboOrigem.addEventListener("change", function () {
  // Obtém o valor da opção selecionada
  var selectedOption =
    selectElementComboOrigem.options[selectElementComboOrigem.selectedIndex]
      .value;

  // Exibe um alerta com a opção selecionada
  // alert("Você escolheu: " + selectedOption);
  preencherComboBoxDestino(
    JSON.parse(JSON.stringify(responseAeroportos)),
    selectedOption
  );
});

selectElementComboDestino.addEventListener("change", function () {
  // Obtém o valor da opção selecionada
  var selectedOption =
    selectElementComboDestino.options[selectElementComboDestino.selectedIndex]
      .value;

  // Exibe um alerta com a opção selecionada
  // alert("Você escolheu: " + selectedOption);
  preencherComboBox(
    JSON.parse(JSON.stringify(responseAeroportos)),
    selectedOption
  );
});

function requestListaDeAeroportos() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch("http://localhost:3000/listarAeroportos", requestOptions).then(
    (response) => response.json()
  );
}

function preencherComboBox(aeroportos, idAeroportoDestino) {
  var comboBox = document.querySelector("#comboAeroportos");
  var selectedOption =
    comboBox.options[comboBox.selectedIndex]
      .value;
  comboBox.innerHTML = "";

  let aeroporto = "";
  // creating all cells
  for (let i = 0; i < aeroportos.length; i++) {
    aeroporto = aeroportos[i];
    if (aeroporto.idAeroporto != idAeroportoDestino) {
      const option = document.createElement("option");
      option.value = aeroporto.idAeroporto;
      option.text = aeroporto.nomeAeroporto;
      if(selectedOption == aeroporto.idAeroporto){
        option.selected = true;
      }
      console.log(aeroporto.idAeroporto);

      // adicionando a linha que representa o aeroporto.
      comboBox.appendChild(option);
    }
  }
}

function preencherComboBoxDestino(aeroportos, idAeroportoOrigem) {
  var comboBoxDestino = document.querySelector("#comboAeroportosDestino");
  var selectedOption = comboBoxDestino.options[comboBoxDestino.selectedIndex].value;
  comboBoxDestino.innerHTML = "";

  let aeroporto = "";
  // creating all cells
  for (let i = 0; i < aeroportos.length; i++) {
    aeroporto = aeroportos[i];
    if (aeroporto.idAeroporto != idAeroportoOrigem) {
      const option = document.createElement("option");
      option.value = aeroporto.idAeroporto;
      option.text = aeroporto.nomeAeroporto;
      if (selectedOption == aeroporto.idAeroporto) {
        option.selected = true;
      }
      console.log(aeroporto.idAeroporto);

      // adicionando a linha que representa o aeroporto.
      comboBoxDestino.appendChild(option);
    }
  }
}

function exibirAeroportos() {
  return requestListaDeAeroportos().then((customResponse) => {
    if (customResponse.status === "SUCCESS") {
      preencherComboBox(customResponse.payload , null);
      preencherComboBoxDestino(customResponse.payload, null);
      responseAeroportos = customResponse.payload;
    } else {
      console.log(customResponse.messagem);
    }
  });
}

function requestListaDeTrecho(idTrecho) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch(
    `http://localhost:3000/listarTrechos/${idTrecho}`,
    requestOptions
  ).then((response) => response.json());
}

function preencherInput(trechos) {
  if (trechos.length > 0) {
    var selectOrigem = document.getElementById("comboAeroportos");
    var selectDestino = document.getElementById("comboAeroportosDestino");

    const primeiroTrecho = trechos[0];
    selectOrigem.value = primeiroTrecho.origem;
    selectDestino.value = primeiroTrecho.destino;
    // Percorre as opções e remove a opção com o valor correspondente
    for (var i = 0; i < selectOrigem.options.length; i++) {
      if (selectOrigem.options[i].value == primeiroTrecho.destino) {
        selectOrigem.remove(i);
        break; // Pode parar de percorrer após encontrar e remover a opção
      }
    }

    for (var i = 0; i < selectDestino.options.length; i++) {
      if (selectDestino.options[i].value == primeiroTrecho.origem) {
        selectDestino.remove(i);
        break; // Pode parar de percorrer após encontrar e remover a opção
      }
    }
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
