//função para saber se o nome foi preenchido
function preencheuAeroporto() {
  let resultado = false;
  var nomeAeroporto = document.getElementById("nomeAeroporto").value;

  if (nomeAeroporto.length > 0) resultado = true;

  return resultado;
}

//função para saber se a sigla do aeroporto foi preenchida
function preencheuSigla() {
  resultado = false;
  var sigla = document.getElementById("sigla").value;

  if (sigla.length > 0) resultado = true;

  return resultado;
}

//função para saber se a cidade do aeroporto foi preenchida
function preencheuCidade() {
  resultado = false;
  var cidade = document.getElementById("cidade").value;

  if (cidade.length > 0) resultado = true;

  return resultado;
}

//função para saber se o uf do aeroporto foi preenchido
function preencheuUf() {
  resultado = false;
  var uf = document.getElementById("uf").value;

  if (uf.length === 2) resultado = true;

  return resultado;
}

//função que printa o status da operação
function showStatusMessage(msg, error) {
  var pStatus = document.getElementById("status");
  if (error === true) pStatus.className = "statusError";
  else pStatus.className = "statusSuccess";
  pStatus.textContent = msg;
}

//faz a requisição dos aeroportos
function fetchInserir(body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch(`http://localhost:3000/inserirAeroporto`, requestOptions).then(
    (response) => response.json()
  );
}

//faz a inserção dos dados chamando as demais funções
function inserirAeroporto() {
  if (!preencheuAeroporto()) {
    showStatusMessage("Preencha o nome do aeroporto...", true);
    return;
  } else showStatusMessage("", false);

  if (!preencheuSigla()) {
    showStatusMessage("Preencha a sigla...", true);
    return;
  } else showStatusMessage("", false);

  if (!preencheuCidade()) {
    showStatusMessage("Preencha o nome da cidade...", true);
    return;
  } else showStatusMessage("", false);

  if (!preencheuUf()) {
    showStatusMessage("Preencha o nome da UF cidade...", true);
    return;
  } else showStatusMessage("", false);

  const sigla = document.getElementById("sigla").value;
  const nomeAeroporto = document.getElementById("nomeAeroporto").value;
  const cidade = document.getElementById("cidade").value;
  const uf = document.getElementById("uf").value;

  fetchInserir({
    sigla: sigla,
    nomeAeroporto: nomeAeroporto,
    nomeCidade: cidade,
    uf: uf,
  })
    .then((resultado) => {
      if (resultado.status === "SUCCESS")
        showStatusMessage("Aeroporto cadastrado...", false);
      else {
        showStatusMessage("Erro ao cadastrar aeroporto..." + message, true);
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
