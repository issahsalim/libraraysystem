loader = document.querySelector('.loader')
preloader = document.querySelector('.preloader')
btn = document.getElementById('btn')
const message = `Hi you are all paying 10cedis each`;
i = 0;
const renderMessage = () => {
    if (i < message.length) {
        loader.innerHTML += message.charAt(i);
        i++
        setTimeout(renderMessage, 100)
    } else {
        btn.style.display = 'block'
    }
}

renderMessage()
btn.addEventListener('click', () => {
    preloader.style.display = 'none'  
    preloader.classList.add('preloader-removal')

})