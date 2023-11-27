function preencheuIdTrecho() {
  let resultado = false;
  var listarAeroportos = document.getElementById("comboTrecho");
  var valorSelecionado = listarAeroportos.value;
  // se quiséssemos obter o TEXTO selecionado.
  // var text = listaOrigens.options[listaOrigens.selectedIndex].text;
  if (valorSelecionado !== "0") {
    resultado = true;
  }
  return resultado;
}
// funcao para verificar se preencheu o registro de referencia.
function preencheuDataPartida() {
  let resultado = false;
  const registro = document.getElementById("dataPartida").value;
  if (registro.length > 0) {
    resultado = true;
  }
  return resultado;
}

function preencheuHoraPartida() {
  let resultado = false;
  const registro = document.getElementById("horaPartida").value;
  if (registro.length > 0) {
    resultado = true;
  }
  return resultado;
}

function preencheuDataChegada() {
  let resultado = false;
  const registro = document.getElementById("dataChegada").value;
  if (registro.length > 0) {
    resultado = true;
  }
  return resultado;
}

function preencheuHoraChegada() {
  let resultado = false;
  const registro = document.getElementById("horaChegada").value;
  if (registro.length > 0) {
    resultado = true;
  }
  return resultado;
}

function preencheuIdAeronave() {
  let resultado = false;
  const registro = document.getElementById("comboAeronaves").value;
  if (registro.length > 0) {
    resultado = true;
  }
  return resultado;
}

// funcao que verifica se selecionou ou não o fabricante.
function preencheuValor() {
  let resultado = false;
  var listaAeroportos = document.getElementById("preco");
  var valorSelecionado = listaAeroportos.value;
  // se quiséssemos obter o TEXTO selecionado.
  // var text = listaFabricantes.options[listaFabricantes.selectedIndex].text;
  if (valorSelecionado.length > 0) {
    resultado = true;
  }
  return resultado;
}

// funcao para exibir mensagem de status... seja qual for.
function showStatusMessage(msg, error) {
  var pStatus = document.getElementById("status");
  if (error === true) {
    pStatus.className = "statusError";
  } else {
    pStatus.className = "statusSuccess";
  }
  pStatus.textContent = msg;
}

function fetchInserir(body) {
  const url = new URL(window.location.href);
  const idVoo = url.searchParams.get("idVoo");

  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch(
    `http://localhost:3000/alterarVoo/${idVoo}`, requestOptions
  ).then((response) => response.json());
}

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

  // obtendo os dados:
  const id_trecho = document.getElementById("comboTrecho").value;
  const dataPartida = document.getElementById("dataPartida").value;
  const horaPartida = document.getElementById("horaPartida").value;
  const dataChegada = document.getElementById("dataChegada").value;
  const horaChegada = document.getElementById("horaChegada").value;
  const id_aeronave = document.getElementById("comboAeronaves").value;
  const preco = document.getElementById("preco").value;

  // ESTUDAR O CONCEITO DE PROMISES.
  fetchInserir({
    trecho: id_trecho,
    data_partida: dataPartida,
    horaPartida: horaPartida,
    data_chegada: dataChegada,
    horaChegada: horaChegada,
    idAeronave: id_aeronave,
    valor: Number(preco),
  })
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
