/***
 * Função que busca os aeroportos chamando o serviço.
 */
function requestListaDeAeronaves() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch("http://localhost:3000/listarAeronaves", requestOptions).then(
    (T) => T.json()
  );
}

function preencherComboBoxAeronaves(aeronaves) {
  var comboBox = document.querySelector("#comboAeronaves");
  let aeronave = "";

  for (let i = 0; i < aeronaves.length; i++) {
    aeronave = aeronaves[i];
    const option = document.createElement("option");
    option.value = aeronave.idAeronave;
    option.text = aeronave.registro;
    comboBox.appendChild(option);
  }
}

function exibirAeronaves() {
  console.log("Entrou no exibir...");
  requestListaDeAeronaves()
    .then((customResponse) => {
      // obteve resposta, vamos simplesmente exibir como mensagem:
      if (customResponse.status === "SUCCESS") {
        // vamos obter o que está no payload e chamar a função .
        console.log("Deu certo a busca de aeronaves");
        // agora chamar a função de exibição dos dados em tabela...
        // no payload voltou o Array com as aeroportos.
        // DEVEMOS antes, conferir se o ARRAY não está vazio. Faça essa mudança.
        console.log("Payload:" + JSON.stringify(customResponse.payload));
        console.log(customResponse.payload);
        preencherComboBoxAeronaves(JSON.parse(JSON.stringify(customResponse.payload)));
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

exibirAeronaves();
