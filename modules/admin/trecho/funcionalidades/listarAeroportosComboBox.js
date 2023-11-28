//Pega o aeroporto que foi selecionado no combo box de origem
var selectElementComboOrigem = document.getElementById("comboAeroportos");
var responseAeroportos;

// Adiciona um ouvinte de evento de mudança ao elemento select
selectElementComboOrigem.addEventListener("change", function () {
  // Obtém o valor da opção selecionada
  var selectedOption =
    selectElementComboOrigem.options[selectElementComboOrigem.selectedIndex]
      .value;

  preencherComboBoxDestino(
    JSON.parse(JSON.stringify(responseAeroportos)),
    selectedOption
  );
});

//Função que faz a requisição dos aeroportos
function requestListaDeAeroportos() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch(`http://localhost:3000/listarAeroportos`, requestOptions).then(
    (T) => T.json()
  );
}

//função que lista os aeroportos do combo box de origem
function preencherComboBox(aeroportos) {
  var comboBox = document.querySelector("#comboAeroportos");
  // Criando todas as células
  let aeroporto = "";
  for (let i = 0; i < aeroportos.length; i++) {
    aeroporto = aeroportos[i];
    const option = document.createElement("option");
    option.value = aeroporto.idAeroporto;
    option.text = aeroporto.nomeAeroporto;
    console.log(aeroporto.idAeroporto);

    // adicionando a linha que representa o aeroporto.
    comboBox.appendChild(option);
  }
}

//função que lista os aeroportos do combo box de destino
function preencherComboBoxDestino(aeroportos, idAeroportoOrigem) {
  var comboBoxDestino = document.querySelector("#comboAeroportosDestino");
  comboBoxDestino.innerHTML = "";

  let aeroporto = "";
  // creating all cells
  for (let i = 0; i < aeroportos.length; i++) {
    aeroporto = aeroportos[i];
    //exclui o aeroporto de origem
    if (aeroporto.idAeroporto != idAeroportoOrigem) {
      const option = document.createElement("option");
      option.value = aeroporto.idAeroporto;
      option.text = aeroporto.nomeAeroporto;
      console.log(aeroporto.idAeroporto);

      // adicionando a linha que representa o aeroporto.
      comboBoxDestino.appendChild(option);
    }
  }
}

//Função para mostrar os status das operações no terminal
function exibirAeroportos() {
  console.log("Entrou no exibir...");
  requestListaDeAeroportos()
    .then((customResponse) => {
      if (customResponse.status === "SUCCESS") {
        console.log("Deu certo a busca de aeroportos");
        // agora chamar a função de exibição dos dados em tabela
        console.log("Payload:" + JSON.stringify(customResponse.payload));
        console.log(customResponse.payload);
        preencherComboBox(JSON.parse(JSON.stringify(customResponse.payload)));
        responseAeroportos = customResponse.payload;
      } else {
        console.log(customResponse.messagem);
      }
    })
    .catch((e) => {
      console.log("Não foi possível exibir." + e);
    });
}

exibirAeroportos();
