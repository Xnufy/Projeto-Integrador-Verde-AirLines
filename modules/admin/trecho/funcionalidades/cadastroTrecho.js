//função para listar os aeroportos disponíveis para origem
function preencheuOrigem() {
  let resultado = false;
  var listarAeroportos = document.getElementById("comboAeroportos");
  var valorSelecionado = listarAeroportos.value;
  if (valorSelecionado !== "0") {
    resultado = true;
  }
  return resultado;
}

//função para listar os aeroportos disponíveis para destino
function preencheuDestino() {
  let resultado = false;
  var listaAeroportosDestino = document.getElementById(
    "comboAeroportosDestino"
  );
  var valorSelecionado = listaAeroportosDestino.value;
  if (valorSelecionado !== "0") {
    resultado = true;
  }
  return resultado;
}

//printa a mensagem de erro, caso exista
function showStatusMessage(msg, error) {
  var pStatus = document.getElementById("status");
  if (error === true) pStatus.className = "statusError";
  else pStatus.className = "statusSuccess";
  pStatus.textContent = msg;
}

//função de requisição de valores
function fetchInserir(body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch(`http://localhost:3000/inserirTrecho`, requestOptions).then(
    (response) => response.json()
  );
}

//função para inserir um novo trecho no banco de dados
function inserirTrecho() {
  if (!preencheuOrigem()) {
    showStatusMessage("Preencha a origem...", true);
    return;
  } else showStatusMessage("", false);

  if (!preencheuDestino()) {
    showStatusMessage("Preencha o destino...", true);
    return;
  } else showStatusMessage("", false);

  //envia os valores para o banco
  const origem = document.getElementById("comboAeroportos").value;
  const destino = document.getElementById("comboAeroportosDestino").value;

  fetchInserir({
    origem: origem,
    destino: destino,
  })
    //status se deu certo ou não
    .then((resultado) => {
      if (resultado.status === "SUCCESS")
        showStatusMessage("Trecho cadastrado...", false);
      else {
        showStatusMessage("Erro ao cadastrar trecho..." + message, true);
        console.log(resultado.message);
      }
    })
    .catch(() => {
      showStatusMessage(
        "Erro técnico ao cadastrar... Contate o suporte.",
        true
      );
      console.log("Falha grave ao cadastrar");
    });
}
