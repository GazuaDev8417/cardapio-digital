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

/* MECANISMO DE BUSCA */
const inputTerm = document.getElementById('search')


inputTerm.addEventListener('input', ()=>{
    const term = inputTerm.value.trim().toLowerCase()
    const cards = document.querySelectorAll('.card')

    cards.forEach(card=>{
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || ''
        const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || ''
        const price = card.querySelector('.card-price')?.textContent.toLowerCase() || ''

        const match = title.includes(term) || desc.includes(term) || price.includes(term)

        if(term === ''){
            card.classList.remove('hidden', 'highlight')
        }else if(match){
            card.classList.remove('hidden')
            card.classList.add('highlight')
        }else{
            card.classList.add('hidden')
            card.classList.remove('highlight')
        }
    })


    const sections = document.querySelectorAll('section.products')
    
    sections.forEach(section=>{
        const visibleCards = section.querySelectorAll('.card:not(.hidden)')
    
        if(visibleCards.length === 0){
            section.classList.add('hidden')
        }else{
            section.classList.remove('hidden')
        }
    })
})

