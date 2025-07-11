


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
        console.log(visibleCards)
    
        if(visibleCards.length === 0){
            section.classList.add('hidden')
        }else{
            section.classList.remove('hidden')
        }
    })
})

