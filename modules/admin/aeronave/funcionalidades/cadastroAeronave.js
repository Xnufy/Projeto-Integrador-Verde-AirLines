// função que verifica se preencheu o modelo.
function preencheuModelo() {
  let resultado = false;
  const modeloInformado = document.getElementById("modelo").value;
  if (modeloInformado.length > 0) {
    resultado = true;
  }
  return resultado;
}

// função que verifica se selecionou ou não o fabricante.
function selecionouFabricante() {
  let resultado = false;
  var listaFabricantes = document.getElementById("comboFabricantes");
  var valorSelecionado = listaFabricantes.value;
  if (valorSelecionado !== "0") {
    resultado = true;
  }
  return resultado;
}

// função para verificar se preencheu o registro de referencia.
function preencheuRegistro() {
  let resultado = false;
  const registro = document.getElementById("registro").value;
  if (registro.length > 0) {
    resultado = true;
  }
  return resultado;
}

// verifica se o ano é valido
function anoFabricacaoValido() {
  let resultado = false;
  // obter o texto preenchido no campo anoFabricação
  var strAno = document.getElementById("anoFabricacao").value;
  const ano = parseInt(strAno);
  console.log("Ano aeronave: " + ano.toString());
  if (ano >= 1990 && ano <= 2026) {
    resultado = true;
  }
  return resultado;
}

// verifica se o campo linhas dos assentos é numerico e válido
function assentoLinhaValido() {
  let resultado = false;
  const strNumLinha = document.getElementById("num_linha").value;
  const assentosLinha = parseInt(strNumLinha);
  if (assentosLinha > 0) {
    resultado = true;
  }
  return resultado;
}

// verifica se o campo das colunas assentos é numérico e válido
function assentoColunaValido() {
  let resultado = false;
  const strNumColuna = document.getElementById("num_coluna").value;
  const assentosColuna = parseInt(strNumColuna);
  if (assentosColuna > 0) {
    resultado = true;
  }
  return resultado;
}

// função para exibir mensagem de status (ERRO ou NÃO)
function showStatusMessage(msg, error) {
  var pStatus = document.getElementById("status");
  if (error === true) {
    pStatus.className = "statusError";
  } else {
    pStatus.className = "statusSuccess";
  }
  pStatus.textContent = msg;
}
// requisição dos dados para inserir depois
function fetchInserir(body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch(`http://localhost:3000/inserirAeronave`, requestOptions).then(
    (request) => request.json()
  );
}
// verificação dos dados digitados
function inserirAeronave() {
  if (!preencheuModelo()) {
    showStatusMessage("Preencha o modelo...", true);
    return;
  } else showStatusMessage("", false);

  if (!selecionouFabricante()) {
    showStatusMessage("Selecione o fabricante...", true);
    return;
  } else showStatusMessage("", false);

  if (!preencheuRegistro()) {
    showStatusMessage("Preencha o registro da aeronave...", true);
    return;
  } else showStatusMessage("", false);

  if (!anoFabricacaoValido()) {
    showStatusMessage("Ano deve de 1990 até 2026...", true);
    return;
  } else showStatusMessage("", false);

  if (!assentoLinhaValido()) {
    showStatusMessage("Preencha corretamente o número de linhas.", true);
    return;
  } else showStatusMessage("", false);

  if (!assentoColunaValido()) {
    showStatusMessage("Preencha corretamente o número de colunas.", true);
    return;
  } else showStatusMessage("", false);

  // obtenção de dados e cadastro de aeronave
  const modelo = document.getElementById("modelo").value;
  const fabricante = document.getElementById("comboFabricantes").value;
  const anoFabricacao = document.getElementById("anoFabricacao").value;
  const assentosLinha = document.getElementById("num_linha").value;
  const assentosColuna = document.getElementById("num_coluna").value;
  const registro = document.getElementById("registro").value;

  // Inserção da aeronave
  fetchInserir({
    modelo: modelo,
    fabricante: fabricante,
    anoFabricacao: anoFabricacao,
    linhasAssentos: assentosLinha,
    colunasAssentos: assentosColuna,
    registro: registro,
  })
    .then((resultado) => {
      // resultado da operação (ERRO ou Não)
      if (resultado.status === "SUCCESS") {
        showStatusMessage("Aeronave cadastrada... ", false);
      } else if (resultado.status === "ERROR") {
        showStatusMessage(resultado.messagem, true);
        console.log(resultado.messagem);
      }
    })
    .catch(() => {
      showStatusMessage(
        "Erro técnico ao cadastrar... Contate o suporte.",
        true
      );
      console.log("Falha grave ao cadastrar.");
    });
}
