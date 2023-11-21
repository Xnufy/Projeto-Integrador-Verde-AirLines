var selectElementComboOrigem = document.getElementById("selectOrigem");
var responseAeroportos;

// Adiciona um ouvinte de evento de mudança (change) ao elemento select
selectElementComboOrigem.addEventListener("change", function () {
  // Obtém o valor da opção selecionada
  var selectedOption = 
    selectElementComboOrigem.options[selectElementComboOrigem.selectedIndex].value;

  preencherComboBoxDestino(
    JSON.parse(JSON.stringify(responseAeroportos)),
    selectedOption
  );

  
});
/***
 * Função que busca os aeroportos chamando o serviço.
 */
function requestListaDeAeroportos() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch("http://localhost:3000/listarAeroportos", requestOptions).then(
    (T) => T.json()
  );
}

function preencherComboBox(aeroportos) {
  var comboBoxOrigem = document.querySelector("#selectOrigem");

  let aeroporto = "";
  // creating all cells
  for (let i = 0; i < aeroportos.length; i++) {
    aeroporto = aeroportos[i];
    const option = document.createElement("option");
    option.value = aeroporto.idAeroporto;
    option.text = aeroporto.nomeAeroporto;

    // adicionando a linha que representa o aeroporto.
    comboBoxOrigem.appendChild(option);
  }
}
function preencherComboBoxDestino(aeroportos, idAeroportoOrigem) {
  var comboBoxDestino = document.querySelector("#selectDestino");
  comboBoxDestino.innerHTML = "";

  let aeroporto = "";
  // creating all cells
  for (let i = 0; i < aeroportos.length; i++) {
    aeroporto = aeroportos[i];
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

function exibirAeroportos() {
  requestListaDeAeroportos()
    .then((customResponse) => {
      // obteve resposta, vamos simplesmente exibir como mensagem:
      if (customResponse.status === "SUCCESS") {
        preencherComboBox(JSON.parse(JSON.stringify(customResponse.payload)));
        responseAeroportos = customResponse.payload;
      } else {
        // tratar corretamente o erro... (melhorar...)
        console.log(customResponse.messagem);
      }
    })
    .catch((e) => {
      // FAZER O TRATAMENTO...
      console.log("Não foi possível exibir." + e);
    });
}

exibirAeroportos();
