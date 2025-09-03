/* INPUTS */
const username = document.getElementById('username')
const email = document.getElementById('email')
const phone = document.getElementById('phone')
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
    window.location.href = '../perfil/index.html'
})


clear.onclick = ()=>{
    username.value = ''
    email.value = ''
    phone.value = ''
}

const signup = async()=>{
    const body = {
        user: username.value, 
        email: email.value,
        phone: phone.value, 
        password: senha.value, 
        role: 'NORMAL' 
    }

    if(!body.user || !body.email || !body.phone || !body.password){
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
        const data = await res.text()
        localStorage.setItem('token', data)
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
