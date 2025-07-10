const openMenu = document.getElementById('menuIcon')
const sidebar = document.getElementById('sidebar')
const overlay = document.getElementById('overlay')
const searchBtn = document.getElementById('searchBtn')
const inputContainer = document.getElementById('inputContainer')
const search = document.getElementById('search')


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
/* MOSTRAR INPUT DE BUSCA */
searchBtn.addEventListener('click', ()=>{
    inputContainer.classList.toggle('active')
    search.focus()
})

/* ROLAGEM DA TELA PELO MENU */
const navLinks = document.querySelectorAll('aside nav a')


navLinks.forEach(link=>{
    link.addEventListener('click', ()=>{
        sidebar.classList.remove('active')
        overlay.classList.remove('active')
    })
})