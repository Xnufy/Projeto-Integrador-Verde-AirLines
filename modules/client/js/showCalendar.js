// radios
var radioIda = document.getElementById("radioIda");
var radioIdaVolta = document.getElementById("radioIdaVolta");

// container que contem a div que contem os calendarios
var containerCalendario = document.querySelector(".container-calendario");

// container calendario da data de ida
var calendarioIda = document.querySelector(".calendario-ida");

// container calendario da data de volta
var calendarioVolta = document.querySelector(".calendario-volta");

// container que contem o campo para colocar o numero de passageiros
var containerPassageiros = document.querySelector(".container-qtd-passageiros");

// evento de mudança nos rádios
// radio - opcao ida - ativado
function selecionaIda()
{
  radioIda.addEventListener("change", function() {
    containerPassageiros.style.display = "none";
    if (radioIda.checked) {
      containerCalendario.style.display = "flex";
      calendarioIda.style.display = "block";
      calendarioVolta.style.display = "none";

      const dateControlIda = document.querySelector('.calendario-ida input[type="date"]');
      dateControlIda.value = "0000-00-00";

      calendarioIda.addEventListener("change", event => {
        if(event.target.value)
          containerPassageiros.style.display = "block";
        else
          containerPassageiros.style.display = "none";
      });
    }
  });
}

// radio - opcao ida e volta - ativado
function selecionaIdaVolta()
{
  radioIdaVolta.addEventListener("change", function() {
    containerPassageiros.style.display = "none";
    if (radioIdaVolta.checked) {
      containerCalendario.style.display = "flex";
      calendarioIda.style.display = "block";
      calendarioVolta.style.display = "block";
      
      const dateControlIda = document.querySelector('.calendario-ida input[type="date"]');
      const dateControlVolta = document.querySelector('.calendario-volta input[type="date"]');
      dateControlIda.value = "0000-00-00";
      dateControlVolta.value = "0000-00-00";


      calendarioIda.addEventListener("change", event => {
        if (event.target.value) {
          calendarioVolta.addEventListener("change", event => {
            if (event.target.value) {
              containerPassageiros.style.display = "block";
            } else {
              containerPassageiros.style.display = "none";
            }
          });
        } else {
          containerPassageiros.style.display = "none";
        }
      });
    }
    else
      containerPassageiros.style.display = "none";
  });
}

selecionaIda();
selecionaIdaVolta();