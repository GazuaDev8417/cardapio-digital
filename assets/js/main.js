const horariosBtn = document.getElementById('horariosBtn')
const popup = document.getElementById('popup')
const closePopup = document.getElementById('close-popup')
/* VARIAVEIS DE HORÁRIOS E DIAS */
const days = ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO']
const now = new Date()
const dayWeek = days[now.getDay()]
const currentHour = now.getHours()
const currenttMinute = now.getMinutes()
const totalMinutes = currentHour * 60 + currenttMinute
const horarios = {
    'SEGUNDA': [1020, 1439],   
    'TERCA': [1020, 1439],             
    'QUARTA': [1020, 1439],
    'QUINTA': [1020, 1439],
    'SEXTA': [1020, 1439],
    'SÁBADO': [1020, 1439],
    'DOMINGO': [1020, 1439],
}

const displayProducts = ()=>{
    fetch(`${BASE_URL}/products`).then(res => res.json())
        .then(data =>{
            localStorage.setItem('productsList', JSON.stringify(data))
            const sections = {
                pizza: document.querySelector('#pizza .menu-container'),
                acai: document.querySelector('#acai .menu-container'),
                lanche: document.querySelector('#lanche .menu-container'),
                porcao: document.querySelector('#porcao .menu-container'),
                pirao: document.querySelector('#pirao .menu-container'),
                bebida: document.querySelector('#bebida .menu-container'),
            }
            
            Object.values(sections).forEach(container => container.innerHTML = '')
            data.map(d=>{
                const section = sections[d.category]
                if(section){
                    const cardHtml = document.createElement('div')
                    cardHtml.classList.add('card')
                    cardHtml.setAttribute('data-id', d.id)
                    cardHtml.innerHTML +=`
                        <img src="assets/imgs/${d.category}/cards/${d.image}" alt="Imagem do produto">
                        <div class="card-content">
                            <div class="card-title">${d.product}</div>
                            <div class="card-desc">${d.description}</div>
                            <div class="card-price">R$ ${parseFloat(d.price).toFixed(2)}</div>
                        </div>
                    `

                    document.querySelectorAll('.day-row').forEach(row=>{
                        const dayName = row.querySelector('.day-name').textContent.trim().toUpperCase()
                        const time = horarios[dayName]
                        
                        cardHtml.addEventListener('click', (e) =>{
                            if(dayName === dayWeek){
                                if(totalMinutes >= time[0] && totalMinutes < time[1]){
                                    localStorage.setItem('title', d.product)
                                    localStorage.setItem('productId', d.id)
                                    localStorage.setItem('category', d.category)
                                    
                                    if(d.category === 'bebida'){
                                        addProductToCart(d)
                                        window.location.href = 'assets/pages/carrinho/index.html'
                                    }else{
                                        window.location.href = 'assets/pages/pedidos/index.html'
                                    }

                                }else{                
                                    popupAlert.classList.add('active')
                                    setTimeout(()=>{
                                        popupAlert.classList.remove('active')
                                    }, 3000)
                                }
                            }
                        })
                    })
                    
                    section.appendChild(cardHtml)
                }
            }).join('')
            
            const cards = document.querySelectorAll('.carousel .card')

            cards.forEach(card=>{
                card.addEventListener('click', (e)=>{
                    card.classList.remove('effect')

                    const rect = card.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top

                    card.style.setProperty('--ripple-x', `${x}px`)
                    card.style.setProperty('--ripple-y', `${y}px`)

                    requestAnimationFrame(()=>{
                        card.classList.add('effect')
                    })

                    
                    setTimeout(()=>{
                        card.classList.remove('effect')            
                    }, 500)
                })
            })
    }).catch(e => console.error(e))
}


document.addEventListener('DOMContentLoaded', ()=>{   

    generateToken()
    /* ============= RENDERIZAÇÃO DOS PRODUTOS ==================== */
    displayProducts()
})  

/* POPUP - HORÁRIO DE FUNCIONAMENTO */
horariosBtn.addEventListener('click', ()=>{
    overlay.classList.add('active')
    popup.classList.add('active')
})

closePopup.addEventListener('click', ()=>{
    overlay.classList.remove('active')
    popup.classList.remove('active')
})

/* ALERT - SE ESTÁ OU NÃO FUNCIONANDO */
document.querySelectorAll('.day-row').forEach(row=>{
    const alert = document.getElementById('alert')
    const dayName = row.querySelector('.day-name').textContent.trim().toUpperCase()
    const time = horarios[dayName]
    

    if(dayName === dayWeek){
        if(totalMinutes >= time[0] && totalMinutes < time[1]){
            alert.style.display = 'block'
            row.style.fontWeight = 'bold'
            row.style.color = 'green'
            alert.style.backgroundColor = 'green'
            alert.textContent = 'FUNCIONANDO ATÉ ÀS 23:59'
        }else{
            alert.style.display = 'block'
            row.style.fontWeight = 'bold'
            row.style.color = 'red'
            alert.textContent = 'ABRIMOS ÀS 17:00'
        }
    }
    
    /* if(dayName === dayWeek && !time){
        alert.style.display = 'block'
        row.style.fontWeight = 'bold'
        row.style.color = 'red'
        alert.textContent = 'FECHADO HOJE'
    } */
})

/* CARROSSEL - CARDS DE PRODUTOS */
const wrapper = document.querySelectorAll('.carousel-wrapper')

wrapper.forEach(item=>{
    const carousel = item.querySelector('.carousel')
    const leftBtn = item.querySelector('.left')
    const rightBtn = item.querySelector('.right')


    leftBtn.addEventListener('click', ()=>{
        carousel.scrollBy({ left: -300, behavior: 'smooth' })
    })

    rightBtn.addEventListener('click', ()=>{
        carousel.scrollBy({ left: 300, behavior: 'smooth' })
    })
})



