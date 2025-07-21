const rua = document.getElementById('streen')
const bairro = document.getElementById('neighborhood')
const cep = document.getElementById('cep')
const clientName = document.getElementById('client')
const phone = document.getElementById('phone')

const addressByCep = ()=>{
    
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json()).then(data=>{
        console.log(data)
        rua.innerText = data.logradouro
    }).catch(e => console.error(e.message))
}

document.addEventListener('DOMContentLoaded', ()=>{
})
