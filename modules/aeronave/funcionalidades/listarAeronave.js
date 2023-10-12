var rowCabecalho = document.querySelector('#cabecalhoTabela');
        var linha = document.querySelector("#aeronaves-list");
        

        fetch("http://localhost:3000/listarAeronaves")
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Erro ao obter os dados.");
                }
                
                
                return response.json(); // Parse a resposta como JSON
            })
            .then(function (data) {

                numeroAeronaves = data.length;
                document.getElementById("titlePage").innerHTML = `<h1>Listar Aeronave(Qtde:${numeroAeronaves})</h1>`;

                if (numeroAeronaves > 0) {
                    // Inserção dos títulos do cabeçalho após recuperar os dados da requisição
                    rowCabecalho.innerHTML += "<th>ID Aeronave</th>";
                    rowCabecalho.innerHTML += "<th>Modelo</th>";
                    rowCabecalho.innerHTML += "<th>Fabricante</th>";
                    rowCabecalho.innerHTML += "<th>Ano de Fabricação</th>";
                    rowCabecalho.innerHTML += "<th>Nº Linhas</th>";
                    rowCabecalho.innerHTML += "<th>Nº Colunas</th>";
                }
                
                // Agora 'data' contém os dados retornados pelo servidor
                // Limpe a tabela de aeronaves antes de preenchê-la
                linha.innerHTML = '';

                // Itere sobre os dados e crie as linhas da tabela
                data.forEach(function (aeronave) {
                    var row = document.createElement("tr");

                    // Crie as células da tabela com os dados da aeronave
                    var numIdenCell = document.createElement("td");
                    numIdenCell.textContent = aeronave[0];

                    var modeloCell = document.createElement("td");
                    modeloCell.textContent = aeronave[1];

                    var fabricanteCell = document.createElement("td");
                    fabricanteCell.textContent = aeronave[2];

                    var anoFabricacaoCell = document.createElement("td");
                    anoFabricacaoCell.textContent = aeronave[3];

                    var linhasCell = document.createElement("td");
                    linhasCell.textContent = aeronave[5];

                    var colunasCell = document.createElement("td");
                    colunasCell.textContent = aeronave[6];


                    // Adicione as células à linha da tabela
                    row.appendChild(numIdenCell);
                    row.appendChild(modeloCell);
                    row.appendChild(fabricanteCell);
                    row.appendChild(anoFabricacaoCell);
                    row.appendChild(linhasCell);
                    row.appendChild(colunasCell);

                    // Adicione a linha à tabela
                    linha.appendChild(row);
                });           

            })
            .catch(function (error) {
                console.error(error);
            });