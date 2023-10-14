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
function preencheuRegistro(){
    let resultado = false;
    const registro = document.getElementById("registro").value;
    if(registro.length > 0){
        resultado = true;
    }
    return resultado;
}

// funcao que verifica se selecionou ou não o fabricante.
function selecionouAeroporto(){
    let resultado = false; 
    var listaAeroportos = document.getElementById("comboAeroportos");
    var valorSelecionado = listaAeroportos.value;
    // se quiséssemos obter o TEXTO selecionado. 
    // var text = listaFabricantes.options[listaFabricantes.selectedIndex].text;
    if (valorSelecionado !== "0"){
        resultado = true;
    }
    return resultado;
}

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

// verifica se o campo linhas assentos é numerico e válido
function assentoLinhaValido(){
    let resultado = false;
    const strNumLinha = document.getElementById("num_linha").value;
    const assentosLinha = parseInt(strNumLinha);
    if (assentosLinha > 0){
        resultado = true;
    }
    return resultado; 
}

// verifica se o campo colunas assentos é numérico e válido
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
function showStatusMessage(msg, error) {
    var pStatus = document.getElementById("status");
    if (error === true)
        pStatus.className = "statusError";
    else
        pStatus.className = "statusSuccess";
    pStatus.textContent = msg;
}

function fetchInserir(body) {
    const url = new URL(window.location.href);
    const idAeronave = url.searchParams.get("idAeronave");

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    return fetch(`http://localhost:3000/alterarAeronave/${idAeronave}`, requestOptions)
    .then(response => response.json());
}

function alterarAeronave() {
    if(!preencheuModelo()){
        showStatusMessage("Preencha o modelo...", true);
        return;
    } else
    showStatusMessage("", false);

    if(!selecionouFabricante()){
      showStatusMessage("Selecione o fabricante...", true);  
      return;
    } else
    showStatusMessage("", false);

    if(!preencheuRegistro()){
       showStatusMessage("Preencha o registro da aeronave...", true);
       return;
    } else
    showStatusMessage("", false);

    if(!selecionouAeroporto()) {
        showStatusMessage("Selecione o aeroporto...", true);
        return
    } else
        showStatusMessage("", false);

    if(!anoFabricacaoValido()){
      showStatusMessage("Ano deve de 1990 até 2026...", true);
      return;
    } else
    showStatusMessage("", false);

    if(!assentoLinhaValido()){
        showStatusMessage("Preencha corretamente o número de linhas.", true);
        return;
    } else
    showStatusMessage("", false);

    if(!assentoColunaValido()){
      showStatusMessage("Preencha corretamente o número de colunas.", true);
      return;
    } else
    showStatusMessage("", false);

    // se chegou até aqui a execução do código, vamos cadastrar a aeronave. 
    // obtendo os dados: 
    const modelo = document.getElementById("modelo").value;
    const fabricante = document.getElementById("comboFabricantes").value;
    const registro = document.getElementById("registro").value;
    const anoFabricacao = document.getElementById("anoFabricacao").value;
    const assentosLinha = document.getElementById("num_linha").value;
    const assentosColuna = document.getElementById("num_coluna").value;
    const idAeroportoAeronave = document.getElementById("comboAeroportos").value;

    fetchInserir({
        modelo: modelo, 
        fabricante: fabricante, 
        anoFabricacao: anoFabricacao,
        idAeroportoAeronave: idAeroportoAeronave,
        linhasAssentos: assentosLinha,
        colunasAssentos: assentosColuna,
        registro: registro
    })
    .then(resultado => {
        if (resultado.status === "SUCCESS") {
            showStatusMessage("Aeronave atualizada com sucesso.", false);
        } else {
            showStatusMessage("Erro ao atualizar a aeronave: " + resultado.messagem, true);
            console.log(resultado.messagem);
        }
    })
    .catch(() => {
        showStatusMessage("Erro técnico ao atualizar a aeronave. Contate o suporte.", true);
        console.log("Falha grave ao atualizar a aeronave");
    });
}