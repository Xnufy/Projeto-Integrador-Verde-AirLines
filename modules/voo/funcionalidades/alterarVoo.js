function preencheuIdTrecho(){
  let resultado = false; 
  var listarAeroportos = document.getElementById("comboTrecho");
  var valorSelecionado = listarAeroportos.value;
  // se quiséssemos obter o TEXTO selecionado. 
  // var text = listaOrigens.options[listaOrigens.selectedIndex].text;
  if (valorSelecionado !== "0"){
      resultado = true;
  }
  return resultado;
}
// funcao para verificar se preencheu o registro de referencia. 
function preencheuData(){
  let resultado = false;
  const registro = document.getElementById("data").value;
  if(registro.length > 0){
      resultado = true;
  }
  return resultado;
}

// funcao que verifica se selecionou ou não o fabricante.
function preencheuValor(){
  let resultado = false; 
  var listaAeroportos = document.getElementById("preco");
  var valorSelecionado = listaAeroportos.value;
  // se quiséssemos obter o TEXTO selecionado. 
  // var text = listaFabricantes.options[listaFabricantes.selectedIndex].text;
  if (valorSelecionado.length > 0){
      resultado = true;
  }
  return resultado;
}

// funcao para exibir mensagem de status... seja qual for. 
function showStatusMessage(msg, error){
  var pStatus = document.getElementById("status");
  if (error === true){
      pStatus.className = "statusError";
  }else{
      pStatus.className = "statusSuccess";
  }
  pStatus.textContent = msg;
}

function fetchInserir(body) {
  const url = new URL(window.location.href);
  const idVoo = url.searchParams.get("idVoo");

  const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
  };

  return fetch(`http://localhost:3000/alterarVoo/${idVoo}`, requestOptions)
  .then(response => response.json());
}

function alterarVoo() {
  if(!preencheuIdTrecho()){
    showStatusMessage("Preencha o Trecho...", true);
    return;
  } else
  showStatusMessage("", false);

  if(!preencheuData()) {
      showStatusMessage("Preencha a data...", true);
      return
  } else
      showStatusMessage("", false);

  if(!preencheuValor()) {
      showStatusMessage("Preencha o valor...", true);
      return
  } else
      showStatusMessage("", false);

  // se chegou até aqui a execução do código, vamos cadastrar a aeronave. 
  // obtendo os dados: 
  const numVoo = document.getElementById("numVoo").value;
  const id_trecho = document.getElementById("comboTrecho").value;
  const data = document.getElementById("data").value;
  const preco = document.getElementById("preco").value;

  // ESTUDAR O CONCEITO DE PROMISES.
  fetchInserir({
      idVoo: numVoo, 
      trecho: id_trecho,
      data: data,
      valor: Number(preco),
  })
  .then(resultado => {
      if (resultado.status === "SUCCESS") {
          showStatusMessage("Aeronave atualizada com sucesso.", false);
      } else {
          showStatusMessage("Erro ao atualizar: " + resultado.messagem, true);
          console.log(resultado.messagem);
      }
  })
  .catch(() => {
      showStatusMessage("Erro técnico ao atualizar a aeronave. Contate o suporte.", true);
      console.log("Falha grave ao atualizar a aeronave");
  });
}