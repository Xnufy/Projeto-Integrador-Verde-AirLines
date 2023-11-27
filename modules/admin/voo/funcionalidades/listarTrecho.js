

/***
 * Função que busca os aeroportos chamando o serviço.
 */
function requestListaDeTrechos() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch("http://localhost:3000/listarTrecho", requestOptions).then(
    (T) => T.json()
  );
}

function preencherComboBox(trechos) {
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
  console.log("Entrou no exibir...");
  requestListaDeTrechos()
    .then((customResponse) => {
      // obteve resposta, vamos simplesmente exibir como mensagem:
      if (customResponse.status === "SUCCESS") {
        // vamos obter o que está no payload e chamar a função .
        console.log("Deu certo a busca de aeroportos");
        // agora chamar a função de exibição dos dados em tabela...
        // no payload voltou o Array com as aeroportos.
        // DEVEMOS antes, conferir se o ARRAY não está vazio. Faça essa mudança.
        console.log("Payload:" + JSON.stringify(customResponse.payload));
        console.log(customResponse.payload);
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

exibirTrechos();
