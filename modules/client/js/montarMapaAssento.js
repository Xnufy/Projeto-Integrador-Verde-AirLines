function assentoHover(element) {
    element.setAttribute("src", "../../assets/img/assento-amarelo.png")
}

function assentoDefault(element) {
    element.setAttribute("src", "../../assets/img/assento-azul.png")
}

function requestMapaAssento(idVoo) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch(`http://localhost:3000/reservaAssento/${idVoo}`, requestOptions)
    .then(response => response.json());
}