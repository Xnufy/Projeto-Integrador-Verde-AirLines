// funcao que verifica se preencheu o modelo.
function preencheuNumVoo(){
  let resultado = false;
  const num_voo = document.getElementById("numVoo").value;
  if(num_voo.length > 0){
      resultado = true;
  }
  return resultado;
}

// funcao que verifica se selecionou ou não o fabricante.
function preencheuOrigem(){
  let resultado = false; 
  var listaFabricantes = document.getElementById("origem");
  var valorSelecionado = listaFabricantes.value;

  if (valorSelecionado.length > 0){
      resultado = true;
  }
  return resultado;
}

function preencheuDestino(){
  let resultado = false; 
  var listaFabricantes = document.getElementById("destino");
  var valorSelecionado = listaFabricantes.value;

  if (valorSelecionado.length > 0){
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

  if(!preencheuNumVoo()){
      showStatusMessage("Preencha o numero do voo...", true);
      return;
  } else
  showStatusMessage("", false);

  if(!preencheuOrigem()){
    showStatusMessage("Preencha a origem..", true);  
    return;
  } else
  showStatusMessage("", false);

  if(!preencheuDestino()){
     showStatusMessage("Preencha o destino...", true);
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
  const origem = document.getElementById("origem").value;
  const destino = document.getElementById("destino").value;
  const data = document.getElementById("data").value;
  const preco = document.getElementById("preco").value;

  // ESTUDAR O CONCEITO DE PROMISES.
  fetchInserir({
      idVoo: numVoo, 
      saidaVoo: origem, 
      chegadaVoo: destino,
      data: data,
      valor: Number(preco),
  })
      .then(resultado => {
        // obteve resposta, vamos simplesmente exibir como mensagem: 
        if(resultado.status === "SUCCESS"){
          showStatusMessage("Aeronave cadastrada... ", false);
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

function getIdVoo(){
  requestIdVoo()
  .then(customResponse => {
      // obteve resposta, vamos simplesmente exibir como mensagem:
      if(customResponse.status === "SUCCESS"){

          let idVoo = customResponse.payload + 1;

          document.getElementById("numVoo").value = String(idVoo);
      }else{
          // tratar corretamente o erro... (melhorar...)
          console.log(customResponse.messagem);
      }
      })
  .catch((e)=>{
  // FAZER O TRATAMENTO...
  console.log("Não foi possível exibir." + e);
  });
}

getIdVoo();
