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



document.addEventListener('DOMContentLoaded', ()=>{
    const days = ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', , 'QUINTA', 'SEXTA', 'SÁBADO']
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
            if(totalMinutes >= time[0] && totalMinutes <= time[1]){
                row.style.fontWeight = 'bold'
                row.style.color = 'green'
                alert.style.backgroundColor = 'green'
                alert.textContent = 'ABERTO'
            }else{
                row.style.fontWeight = 'bold'
                row.style.color = 'red'
                alert.style.display = 'block'
                alert.textContent = 'AINDA NÃO ESTAMOS FUNCIONANDO'
            }
        }
        
        if(dayName === dayWeek && !time){
            row.style.fontWeight = 'bold'
            row.style.color = 'red'
            alert.textContent = 'FECHADO HOJE'
        }
    })
})