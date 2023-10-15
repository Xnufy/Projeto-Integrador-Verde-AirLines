

/***
 * Função que busca os aeroportos chamando o serviço.
 */
function requestListaDeAeroportos() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch("http://localhost:3000/listarTrecho", requestOptions).then(
    (T) => T.json()
  );
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
  console.log("Entrou no exibir...");
  requestListaDeAeroportos()
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

exibirAeroportos();
