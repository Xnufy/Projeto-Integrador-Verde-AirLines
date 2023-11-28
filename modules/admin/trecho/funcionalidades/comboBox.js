//Estiliza o combo box dos aeroportos do trecho
let comboAeroportos = document.querySelector("#comboAeroportos");
comboAeroportos.style.color = "rgb(117, 117, 117)";

comboAeroportos.addEventListener("change", function () {
  if (comboAeroportos.value === "0") {
    comboAeroportos.style.color = "rgb(117, 117, 117)";
  } else {
    comboAeroportos.style.color = "black";
  }
});

let comboAeroportosDestino = document.querySelector("#comboAeroportosDestino");
comboAeroportosDestino.style.color = "rgb(117, 117, 117)";

comboAeroportosDestino.addEventListener("change", function () {
  if (comboAeroportosDestino.value === "0") {
    comboAeroportosDestino.style.color = "rgb(117, 117, 117)";
  } else {
    comboAeroportosDestino.style.color = "black";
  }
});
