function preencheuID(){
    let resultado = false;
    // obter o texto preenchido no campo anoFab
    var strId = document.getElementById("idAeronave").value;
    const id = parseInt(strId);
    if (id !== null && id > 0){
        resultado = true;
    }
    return resultado; 
}

// funcao que verifica se preencheu o modelo.
function preencheuModelo(){
    let resultado = false;
    const modeloInformado = document.getElementById("modelo").value;
    if(modeloInformado.length > 0){
        resultado = true;
    }
    return resultado;
}

// funcao que verifica se selecionou ou não o fabricante.
function selecionouFabricante(){
    let resultado = false; 
    var listaFabricantes = document.getElementById("comboFabricantes");
    var valorSelecionado = listaFabricantes.value;
    // se quiséssemos obter o TEXTO selecionado. 
    // var text = listaFabricantes.options[listaFabricantes.selectedIndex].text;
    if (valorSelecionado !== "0"){
        resultado = true;
    }
    return resultado;
}

// funcao para verificar se preencheu o registro de referencia. 
// function preencheuRegistro(){
//     let resultado = false;
//     const registro = document.getElementById("registro").value;
//     if(registro.length > 0){
//         resultado = true;
//     }
//     return resultado;
// }

// verifica se o ano é valido
function anoFabricacaoValido(){
    let resultado = false;
    // obter o texto preenchido no campo anoFab
    var strAno = document.getElementById("anoFabricacao").value;
    const ano = parseInt(strAno);
    console.log("Ano aeronave: " + ano.toString());
    if (ano >= 1990 && ano <= 2026){
        resultado = true;
    }
    return resultado; 
}

// verifica se o campo total de assentos é numerico e válido
function assentoLinhaValido(){
    let resultado = false;
    const strNumLinha = document.getElementById("num_linha").value;
    const assentosLinha = parseInt(strNumLinha);
    if (assentosLinha > 0){
        resultado = true;
    }
    return resultado; 
}

function assentoColunaValido(){
    let resultado = false;
    const strNumColuna = document.getElementById("num_coluna").value;
    const assentosColuna = parseInt(strNumColuna);
    if (assentosColuna > 0){
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

    return fetch('http://localhost:3000/inserirAeronave', requestOptions)
    .then(request => request.json())
}

  
function inserirAeronave(){
    if(!preencheuID()){
        showStatusMessage("Preencha o ID...", true);
        return;
    }

    if(!preencheuModelo()){
    showStatusMessage("Preencha o modelo...", true);
    return;
    }

    if(!selecionouFabricante()){
      showStatusMessage("Selecione o fabricante...", true);  
      return;
    }

    // if(!preencheuRegistro()){
    //   showStatusMessage("Preencha o registro da aeronave...", true);
    //   return;
    // }

    if(!anoFabricacaoValido()){
      showStatusMessage("Ano deve de 1990 até 2026...", true);
      return;
    }

    if(!assentoLinhaValido()){
        showStatusMessage("Preencha corretamente o número de linhas.", true);
        return;
      }

    if(!assentoColunaValido()){
      showStatusMessage("Preencha corretamente o número de colunas.", true);
      return;
    }

    // se chegou até aqui a execução do código, vamos cadastrar a aeronave. 
    // obtendo os dados: 
    const idAeronave = document.getElementById("idAeronave").value;
    const modelo = document.getElementById("modelo").value;
    const fabricante = document.getElementById("comboFabricantes").value;
    // const registro = document.getElementById("registro").value;
    const anoFabricacao = document.getElementById("anoFabricacao").value;
    const assentosLinha = document.getElementById("num_linha").value;
    const assentosColuna = document.getElementById("num_coluna").value;

    // ESTUDAR O CONCEITO DE PROMISES.
    fetchInserir({
        idAeronave: idAeronave,
        modelo: modelo, 
        fabricante: fabricante, 
        // registro: registro,
        anoFabricacao: anoFabricacao,
        siglaAeroporto: 'VCP',
        assentosLinha: assentosLinha,
        assentosColuna: assentosColuna,
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