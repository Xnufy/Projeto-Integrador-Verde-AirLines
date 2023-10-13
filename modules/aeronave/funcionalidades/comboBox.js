let comboFabricantes = document.querySelector('#comboFabricantes');
comboFabricantes.style.color = 'rgb(117, 117, 117)';

comboFabricantes.addEventListener('change', function() {
    if (comboFabricantes.value === '0') {
        comboFabricantes.style.color = 'rgb(117, 117, 117)';
    } else {
        comboFabricantes.style.color = 'black';
    }
});

let comboAeroportos = document.querySelector('#comboAeroportos');
comboAeroportos.style.color = 'rgb(117, 117, 117)';

comboAeroportos.addEventListener('change', function() {
    if (comboAeroportos.value === '0') {
        comboAeroportos.style.color = 'rgb(117, 117, 117)';
    } else {
        comboAeroportos.style.color = 'black';
    }
});