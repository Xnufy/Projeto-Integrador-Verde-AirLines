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
  const requestOptions = 
  {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
  };

  return fetch('http://localhost:3000/inserirVoo', requestOptions)
  .then(request => request.json())
}


function inserirVoo(){
  console.log("Entrou na função.")

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
  const id_trecho = document.getElementById("comboTrecho").value;
  const data = document.getElementById("data").value;
  const preco = document.getElementById("preco").value;

  // ESTUDAR O CONCEITO DE PROMISES.
  fetchInserir({
      trecho: id_trecho,
      data: data,
      valor: Number(preco),
  })
      .then(resultado => {
        // obteve resposta, vamos simplesmente exibir como mensagem: 
        if(resultado.status === "SUCCESS"){
          showStatusMessage("Voo cadastrado... ", false);
        }else{
          showStatusMessage("Erro ao cadastrar aeronave...: " + message, true);
          console.log(resultado.message);
        }
      })
      .catch(()=>{
        showStatusMessage("Erro técnico ao cadastrar... Contate o suporte.", true);
        console.log("Falha grave ao cadastrar.")
      });
}

function requestIdVoo() {
  const requestOptions = {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  };
  return fetch('http://localhost:3000/lastIdVoo', requestOptions)
  .then(T => T.json())
}
