const rua = document.getElementById('streen')
const bairro = document.getElementById('neighborhood')
const cep = document.getElementById('cep').innerText
console.log(cep)

const addressByCep = ()=>{
    
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json()).then(data=>{
        console.log(data)
        rua.innerText = data.logradouro
    }).catch(e => console.error(e.message))
}

document.addEventListener('DOMContentLoaded', ()=>{
})
