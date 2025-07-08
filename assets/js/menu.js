const openMenu = document.getElementById('menuIcon')
const sidebar = document.getElementById('sidebar')
const overlay = document.getElementById('overlay')
const searchBtn = document.getElementById('searchBtn')
const inputContainer = document.getElementById('inputContainer')


/* MENU LATERAL E OVERLAY */
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

/* ROLAGEM DA TELA PELO MENU */
const navLinks = document.querySelectorAll('aside nav a')


navLinks.forEach(link=>{
    link.addEventListener('click', ()=>{
        sidebar.classList.remove('active')
        overlay.classList.remove('active')
    })
})