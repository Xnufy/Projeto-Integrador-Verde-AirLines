//pega os valores dos combo box de destino e origem
var selectElementComboOrigem = document.getElementById("comboAeroportos");
var selectElementComboDestino = document.getElementById("comboAeroportosDestino");
var responseAeroportos;

//pega o valor da combo box de origem selecionada 
selectElementComboOrigem.addEventListener("change", function () {
  var selectedOption =
    selectElementComboOrigem.options[selectElementComboOrigem.selectedIndex]
      .value;

  preencherComboBoxDestino(
    JSON.parse(JSON.stringify(responseAeroportos)),
    selectedOption
  );
});

//pega o valor da combo box de destino selecionada
selectElementComboDestino.addEventListener("change", function () {
  var selectedOption =
    selectElementComboDestino.options[selectElementComboDestino.selectedIndex]
      .value;

  // Exibe um alerta com a opção selecionada
  preencherComboBox(
    JSON.parse(JSON.stringify(responseAeroportos)),
    selectedOption
  );
});

//faz a requisição dos aeroportos para o combo box
function requestListaDeAeroportos() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch(`http://localhost:3000/listarAeroportos`, requestOptions).then(
    (response) => response.json()
  );
}

//função para prencher o combo box do aeroporto de origem
function preencherComboBox(aeroportos, idAeroportoDestino) {
  var comboBox = document.querySelector("#comboAeroportos");
  var selectedOption =
    comboBox.options[comboBox.selectedIndex]
      .value;
  comboBox.innerHTML = "";

  let aeroporto = "";
  for (let i = 0; i < aeroportos.length; i++) {
    aeroporto = aeroportos[i];
    //ignora o aeroporto de destino selecionado
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

//função para preencher o combo box do aeroporto de destino
function preencherComboBoxDestino(aeroportos, idAeroportoOrigem) {
  var comboBoxDestino = document.querySelector("#comboAeroportosDestino");
   var selectedOption = comboBoxDestino.options[comboBoxDestino.selectedIndex].value;
  comboBoxDestino.innerHTML = "";

  let aeroporto = "";

  for (let i = 0; i < aeroportos.length; i++) {
    aeroporto = aeroportos[i];
    //ignora o aeroporto de origem selecionado
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

//função para preencher os aeroportos no combo box
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

//faz a requisição dos trechos
function requestListaDeTrecho(idTrecho) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
return fetch(`http://localhost:3000/listarTrechos/${idTrecho}`,
    requestOptions
  ).then((response) => response.json());
}

//função para remover um trecho
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

//função que exibe pelo terminal status da operação
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