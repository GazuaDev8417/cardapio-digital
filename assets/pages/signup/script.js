/* INPUTS */
const username = document.getElementById('username')
const email = document.getElementById('email')
const phone = document.getElementById('phone')
/* MOSTRAR OCULTAR SENHA */
const senha = document.getElementById('senha')
const mostrarSenha = document.querySelector('.mostrar-senha')
mostrarSenha.textContent = 'Mostrar'
/* BOTÕES */
const clear = document.getElementById('clear')
const send = document.getElementById('send')
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
    username.value = ''
    email.value = ''
    phone.value = ''
    senha.value = ''
}

const signup = async()=>{
    const body = {
        username: username.value, 
        email: email.value,
        phone: phone.value, 
        senha: senha.value, 
        role: 'ADM' 
    }

    if(!body.username || !body.email || !body.phone || !body.senha){
        window.alert('Preencha todos os campos')
        return
    }
    
    try{
        const res = await fetch(`${BASE_URL}/user/signup`, {
            method:'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(body)
        })
        
        if(!res.ok){
            const error = await res.text()
            throw new Error(`Erro ao cadastrar cliente: ${error}`)
        }
        const text = await res.text()
        const data = text ? JSON.parse(text) : {}
        localStorage.setItem('token', data.token)
        window.location.href = '../endereco/index.html?mode=create'
    }catch(e){
        console.error(e)
        window.alert(e)
    }
}

send.onclick = async() =>{
    try{
        await signup()
    }catch(e){
        console.error('Erro ao cadastrar cliente: ', e)
    }
}


document.addEventListener('DOMContentLoaded', ()=>{
    if(token){
        window.location.href = '../../../index.html'
    }
})
