/***
 * Função que busca as aeronaves chamando o serviço.
 */
function requestVoos() {
  const requestOptions = {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  };
  return fetch('http://localhost:3000/listarVoos', requestOptions)
  .then(T => T.json())
}

/*** 
Função que requisita a exclusão de uma Aeronave
*/

function requestExcluirVoo(body) {
  const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
  };
  return fetch('http://localhost:3000/excluirVoo', requestOptions)
  .then(T => T.json())
}


function excluirVoo(idVoo) {
  console.log('Clicou no excluir aeronave: ' + idVoo);
  requestExcluirVoo({idVoo: idVoo})
      .then(customResponse => {
          if(customResponse.status === "SUCCESS") {
              location.reload();
          } else
              console.log(customResponse.messagem);
      })
      .catch((e) => {
          console.log("Não foi possível excluir." + e);
      })
}

function preencherTabela(voos) {
  var rowCabecalho = document.querySelector("#cabecalhoTabela");

  let numeroVoos = voos.length;
  document.getElementById("titlePage").innerHTML = `<h1>Listar voos (Qtde:${numeroVoos})</h1>`;

  if(numeroVoos > 0) {
      rowCabecalho.innerHTML += "<th>ID Voo</th>";
      rowCabecalho.innerHTML += "<th>Saida</th>";
      rowCabecalho.innerHTML += "<th>Chegada</th>";
      rowCabecalho.innerHTML += "<th>Data</th>";
      rowCabecalho.innerHTML += "<th>Valor</th>";
      rowCabecalho.innerHTML += "<th>Excluir</th>";
      rowCabecalho.innerHTML += "<th>Alterar</th>";
  }
  // acessando a referencia pelo id do tbody
  const tblBody = document.getElementById("voos-list");

  let voo = "";
  // creating all cells
  for (let i = 0; i < voos.length; i++) {

      voo = voos[i];
      console.log("Dados da aeronave: " + voo);
      // row representa a linha da tabela (um novo tr)
      const row = document.createElement("tr");

      const number_formatted = voo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      if (i % 2 == 0)
          row.className = "evenRow";
      else
          row.className = "oddRow";

      row.innerHTML = 
          `<td>${voo.idVoo}</td>
          <td>${voo.chegadaVoo}</td>
          <td>${voo.saidaVoo}</td>
          <td>${voo.data}</td>
          <td>${number_formatted}</td>
          <td>
              <img 
                  src="../../assets/img/delete_icon.png" 
                  class="deletarIcon"
                  onclick="excluirVoo(${voo.idVoo});"/>
          </td>
          <td>
              <img src="../../assets/img/alterar_icon.svg" 
                  class="alterarIcon"
                  onclick="redirecionaParaAlterar(${voo.idVoo});"/>
          </td>`
  
      // adicionando a linha que representa o aeroporto. 
      tblBody.appendChild(row);
  }
}

function exibirVoo() {
  console.log('Entrou no exibir...')
  requestVoos()
  .then(customResponse => {
      // obteve resposta, vamos simplesmente exibir como mensagem:
      if(customResponse.status === "SUCCESS"){
          // vamos obter o que está no payload e chamar a função .
          console.log("Deu certo a busca de Voos");
          // agora chamar a função de exibição dos dados em tabela... 
          // no payload voltou o Array com as aeroportos. 
          // DEVEMOS antes, conferir se o ARRAY não está vazio. Faça essa mudança.
          console.log('Payload:' + JSON.stringify(customResponse.payload));
          console.log(customResponse.payload);
          preencherTabela(JSON.parse(JSON.stringify(customResponse.payload)))
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

exibirVoo();