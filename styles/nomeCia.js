const div = document.getElementById('nomeCia');
const texto = div.innerText;
div.innerHTML = ''; // Limpa o conteúdo da div

for (let i = 0; i < texto.length; i++) {
    const span = document.createElement('span');
    span.innerText = texto[i];
    span.style.fontFamily = 'HelveticaNowText-ExtraBold';
    if (i === 3)
        span.style.color = '#358421';
    else
        span.style.color = '#082401';
    div.appendChild(span);
}