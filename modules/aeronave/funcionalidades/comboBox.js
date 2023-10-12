let comboFabricantes = document.querySelector('#comboFabricantes');
comboFabricantes.style.color = 'rgb(117, 117, 117)';

comboFabricantes.addEventListener('change', function() {
    if (comboFabricantes.value === '0') {
        comboFabricantes.style.color = 'rgb(117, 117, 117)';
    } else {
        comboFabricantes.style.color = 'black';
    }
});

let comboSigla = document.querySelector('#comboSigla');
comboSigla.style.color = 'rgb(117, 117, 117)';

comboSigla.addEventListener('change', function() {
    if (comboSigla.value === '0') {
        comboSigla.style.color = 'rgb(117, 117, 117)';
    } else {
        comboSigla.style.color = 'black';
    }
});