const horariosBtn = document.getElementById('horariosBtn')
const popup = document.getElementById('popup')
const closePopup = document.getElementById('close-popup')





horariosBtn.addEventListener('click', ()=>{
    overlay.classList.add('active')
    popup.classList.add('active')
})

closePopup.addEventListener('click', ()=>{
    overlay.classList.remove('active')
    popup.classList.remove('active')
})