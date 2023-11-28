// função que verifica se preencheu o id do trecho
function preencheuIdTrecho() {
  let resultado = false;
  var listarAeroportos = document.getElementById("comboTrecho");
  var valorSelecionado = listarAeroportos.value;
  if (valorSelecionado !== "0") {
    resultado = true;
  }
  return resultado;
}
// funcao para verificar se preencheu a data da partida do voo
function preencheuDataPartida() {
  let resultado = false;
  const registro = document.getElementById("dataPartida").value;
  if (registro.length > 0) {
    resultado = true;
  }
  return resultado;
}
// função que verifica se preencheu a hora da partida do voo
function preencheuHoraPartida() {
  let resultado = false;
  const registro = document.getElementById("horaPartida").value;
  if (registro.length > 0) {
    resultado = true;
  }
  return resultado;
}
// função que verifica se preencheu a data da chegada do voo
function preencheuDataChegada() {
  let resultado = false;
  const registro = document.getElementById("dataChegada").value;
  if (registro.length > 0) {
    resultado = true;
  }
  return resultado;
}
// função que verifica se preencheu a hora da chegada do voo
function preencheuHoraChegada() {
  let resultado = false;
  const registro = document.getElementById("horaChegada").value;
  if (registro.length > 0) {
    resultado = true;
  }
  return resultado;
}
// função que verifica se preencheu o id da aeronave
function preencheuIdAeronave() {
  let resultado = false;
  const registro = document.getElementById("comboAeronaves").value;
  if (registro.length > 0) {
    resultado = true;
  }
  return resultado;
}

// funcao que verifica se preencheu o valor do voo
function preencheuValor() {
  let resultado = false;
  var listaAeroportos = document.getElementById("preco");
  var valorSelecionado = listaAeroportos.value;
  if (valorSelecionado.length > 0) {
    resultado = true;
  }
  return resultado;
}

// funcao para exibir mensagem de status (ERRO ou NÃO)
function showStatusMessage(msg, error) {
  var pStatus = document.getElementById("status");
  if (error === true) {
    pStatus.className = "statusError";
  } else {
    pStatus.className = "statusSuccess";
  }
  pStatus.textContent = msg;
}
// função que faz a requisição baseado no id do voo
function fetchInserir(body) {
  const url = new URL(window.location.href);
  const idVoo = url.searchParams.get("idVoo");

  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch(`http://localhost:3000/alterarVoo/${idVoo}`, requestOptions
  ).then((response) => response.json());
}
// função que verifica se os campos foram preenchidos
function alterarVoo() {
  if (!preencheuIdTrecho()) {
    showStatusMessage("Preencha o Trecho...", true);
    return;
  } else showStatusMessage("", false);

  if (!preencheuDataPartida()) {
    showStatusMessage("Preencha a data de partida...", true);
    return;
  } else showStatusMessage("", false);

  if (!preencheuHoraPartida()) {
    showStatusMessage("Preencha o horario de partida...", true);
    return;
  } else showStatusMessage("", false);

  if (!preencheuDataChegada()) {
    showStatusMessage("Preencha a data de chegada...", true);
    return;
  } else showStatusMessage("", false);

  if (!preencheuHoraChegada()) {
    showStatusMessage("Preencha o horario de chegada...", true);
    return;
  } else showStatusMessage("", false);

  if (!preencheuIdAeronave()) {
    showStatusMessage("Preencha a aeronave...", true);
    return;
  } else showStatusMessage("", false);

  if (!preencheuValor()) {
    showStatusMessage("Preencha o valor...", true);
    return;
  } else showStatusMessage("", false);

  // obtendo os dados
  const id_trecho = document.getElementById("comboTrecho").value;
  const dataPartida = document.getElementById("dataPartida").value;
  const horaPartida = document.getElementById("horaPartida").value;
  const dataChegada = document.getElementById("dataChegada").value;
  const horaChegada = document.getElementById("horaChegada").value;
  const id_aeronave = document.getElementById("comboAeronaves").value;
  const preco = document.getElementById("preco").value;

  // colocando os dados no sistema
  fetchInserir({
    trecho: id_trecho,
    data_partida: dataPartida,
    horaPartida: horaPartida,
    data_chegada: dataChegada,
    horaChegada: horaChegada,
    idAeronave: id_aeronave,
    valor: Number(preco),
  })
// verificação de erro 
    .then((resultado) => {
      if (resultado.status === "SUCCESS") {
        showStatusMessage("Voo atualizado com sucesso.", false);
      } else {
        showStatusMessage("Erro ao atualizar: " + resultado.messagem, true);
        console.log(resultado.messagem);
      }
    })
    .catch(() => {
      showStatusMessage(
        "Erro técnico ao atualizar o voo. Contate o suporte.",
        true
      );
      console.log("Falha grave ao atualizar o voo");
    });
}