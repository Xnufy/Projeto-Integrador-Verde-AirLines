let comboAeroportos = document.querySelector('#comboTrecho');
comboAeroportos.style.color = 'rgb(117, 117, 117)';

comboAeroportos.addEventListener('change', function() {
    if (comboAeroportos.value === '0') {
        comboAeroportos.style.color = 'rgb(117, 117, 117)';
    } else {
        comboAeroportos.style.color = 'black';
    }
});
