const horariosBtn = document.getElementById('horariosBtn')
const popup = document.getElementById('popup')
const closePopup = document.getElementById('close-popup')





/* POPUP - HORÁRIO DE FUNCIONAMENTO */
horariosBtn.addEventListener('click', ()=>{
    overlay.classList.add('active')
    popup.classList.add('active')
})

closePopup.addEventListener('click', ()=>{
    overlay.classList.remove('active')
    popup.classList.remove('active')
})



document.addEventListener('DOMContentLoaded', ()=>{
    const days = ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO']
    const now = new Date()
    const dayWeek = days[now.getDay()]
    const currentHour = now.getHours()
    const currenttMinute = now.getMinutes()
    const totalMinutes = currentHour * 60 + currenttMinute
    const horarios = {
        'SEGUNDA': [1020, 1439],   
        'TERCA': null,             
        'QUARTA': [1020, 1439],
        'QUINTA': [1020, 1439],
        'SEXTA': null,
        'SÁBADO': [1020, 1439],
        'DOMINGO': [1020, 1439],
    }
    

    document.querySelectorAll('.day-row').forEach(row=>{
        const alert = document.getElementById('alert')
        const dayName = row.querySelector('.day-name').textContent.trim().toUpperCase()
        const time = horarios[dayName]
        

        if(dayName === dayWeek){
            if(time && totalMinutes >= time[0] && totalMinutes <= time[1]){
                alert.style.display = 'block'
                row.style.fontWeight = 'bold'
                row.style.color = 'green'
                alert.style.backgroundColor = 'green'
                alert.textContent = 'FUNCIONANDO ATÉ ÀS 23:59'
            }else{
                alert.style.display = 'block'
                row.style.fontWeight = 'bold'
                row.style.color = 'red'
                alert.textContent = 'AINDA NÃO ESTAMOS FUNCIONANDO'
            }
        }
        
        if(dayName === dayWeek && !time){
            alert.style.display = 'block'
            row.style.fontWeight = 'bold'
            row.style.color = 'red'
            alert.textContent = 'FECHADO HOJE'
        }
    })
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


/* EFEITO BACKGROUND EXPANSIVO AO CLICAR NO CARD */
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
        
        
        /* POPUP - FECHADO. CONSULTAR HORÁRIOS */
        const popupAlert = document.querySelector('.popup-alert')
        popupAlert.classList.add('active')

        setTimeout(()=>{
            popupAlert.classList.remove('active')
        }, 5000)
    })
})


