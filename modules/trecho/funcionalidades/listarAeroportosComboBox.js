/***
 * Função que busca os aeroportos chamando o serviço.
 */
function requestListaDeAeroportos() {
    const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    };
    return fetch('http://localhost:3000/listarAeroportos', requestOptions)
    .then(T => T.json())
}

function preencherComboBox(aeroportos) {
    var comboBox = document.querySelector("#comboAeroportos");

    let aeroporto = "";
    // creating all cells
    for (let i = 0; i < aeroportos.length; i++) {

        aeroporto = aeroportos[i];
        const option = document.createElement("option");
        option.value = aeroporto.idAeroporto;
        option.text = aeroporto.nomeAeroporto;
        console.log(aeroporto.idAeroporto);
    
        // adicionando a linha que representa o aeroporto. 
        comboBox.appendChild(option);
    }
}
function preencherComboBoxDestino(aeroportos) {
    var comboBoxDestino = document.querySelector("#comboAeroportosDestino");

    let aeroporto = "";
    // creating all cells
    for (let i = 0; i < aeroportos.length; i++) {

        aeroporto = aeroportos[i];
        const option = document.createElement("option");
        option.value = aeroporto.idAeroporto;
        option.text = aeroporto.nomeAeroporto;
        console.log(aeroporto.idAeroporto);
    
        // adicionando a linha que representa o aeroporto. 
        comboBoxDestino.appendChild(option);
    }
}

function exibirAeroportos() {
    console.log('Entrou no exibir...')
    requestListaDeAeroportos()
    .then(customResponse => {
        // obteve resposta, vamos simplesmente exibir como mensagem:
        if(customResponse.status === "SUCCESS"){
            // vamos obter o que está no payload e chamar a função .
            console.log("Deu certo a busca de aeroportos");
            // agora chamar a função de exibição dos dados em tabela... 
            // no payload voltou o Array com as aeroportos. 
            // DEVEMOS antes, conferir se o ARRAY não está vazio. Faça essa mudança.
            console.log('Payload:' + JSON.stringify(customResponse.payload));
            console.log(customResponse.payload);
            preencherComboBox(JSON.parse(JSON.stringify(customResponse.payload)))
            preencherComboBoxDestino(JSON.parse(JSON.stringify(customResponse.payload)))
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

exibirAeroportos();
