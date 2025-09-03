/* INPUTS */
const email = document.getElementById('email')
//const phone = document.getElementById('phone')
/* MOSTRAR OCULTAR SENHA */
const senha = document.getElementById('senha')
const mostrarSenha = document.querySelector('.mostrar-senha')
mostrarSenha.textContent = 'Mostrar'
/* BOTÕES */
const clear = document.getElementById('clear')
const send = document.getElementById('send')
/* BASE URL */
//const BASE_URL = 'https://max-menu-server.onrender.com'
//const BASE_URL = 'https://max-menu-server.vercel.app'
const BASE_URL = 'http://10.23.1.19:3003'
const token = localStorage.getItem('token')
const turnBack = document.querySelector('.back')




turnBack.addEventListener('click', ()=>{
    window.location.href = '../../../index.html'
})



mostrarSenha.addEventListener('click', ()=>{
    if(senha.type === 'password'){
        senha.type = 'text'
        mostrarSenha.textContent = 'Ocultar'
    }else{
        senha.type = 'password'
        mostrarSenha.textContent = 'Mostrar'
    }
})

clear.onclick = ()=>{
    email.value = ''
    /* phone.value = '' */
    senha.value = ''
}

const login = async()=>{
    const body = { 
        email: email.value,
        /* phone: phone.value, */ 
        password: senha.value
    }

    if(!body.email || !body.password){
        window.alert('Preencha todos os campos')
        return
    }
    
    try{
        const res = await fetch(`${BASE_URL}/user/login`, {
            method:'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(body)
        })
        
        if(!res.ok){
            const error = await res.text()
            throw new Error(error)
        }
        const data = await res.text()
        localStorage.setItem('token', data)
        window.location.href = '../../../index.html'
    }catch(e){
        console.error(e)
        window.alert(e)
    }
}

send.onclick = async() =>{
    try{
        await login()
    }catch(e){
        console.error('Erro ao cadastrar cliente: ', e)
    }
}


document.addEventListener('DOMContentLoaded', ()=>{
    if(token){
        window.location.href = '../../../index.html'
    }
})
