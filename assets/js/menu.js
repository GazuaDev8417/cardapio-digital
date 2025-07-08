const openMenu = document.getElementById('menuIcon')
const sidebar = document.getElementById('sidebar')
const overlay = document.getElementById('overlay')
const searchBtn = document.getElementById('searchBtn')
const inputContainer = document.getElementById('inputContainer')



openMenu.addEventListener('click', ()=>{
    sidebar.classList.add('active')
    overlay.classList.add('active')
})

overlay.addEventListener('click', ()=>{
    sidebar.classList.remove('active')
    overlay.classList.remove('active')
    popup.classList.remove('active')
})

searchBtn.addEventListener('click', ()=>{
    inputContainer.classList.toggle('active')
})