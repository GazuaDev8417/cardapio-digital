/* INPUTS */
const username = document.getElementById('username')
const email = document.getElementById('email')
const phone = document.getElementById('phone')
const address = document.getElementById('address')
const complement = document.getElementById('complement')
/* MOSTRAR OCULTAR SENHA */
const senha = document.getElementById('senha')
const mostrarSenha = document.querySelector('.mostrar-senha')
mostrarSenha.textContent = 'Mostrar'


const addressByCep = ()=>{
    
    fetch(`https://viacep.com.br/ws/${cep?.value}/json/`)
    .then(async res=>{
        if(!res.ok){
            return await res.text().then(error => console.log(error))
        }
        return await res.json()
    }).then(data=>{
        rua.value = data.logradouro
        bairro.value = data.bairro
        cep.value = data.cep
    }).catch(e => console.error(e.message))
}


mostrarSenha.addEventListener('click', ()=>{
    if(senha.type === 'password'){
        senha.type = 'text'
        mostrarSenha.textContent = 'Ocultar'
    }else{
        senha.type = 'password'
        mostrarSenha.textContent = 'Mostrar'
    }
})