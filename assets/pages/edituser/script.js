/* INPUTS */
const username = document.getElementById('username')
const email = document.getElementById('email')
const phone = document.getElementById('phone')
/* BOTÕES */
const clear = document.getElementById('clear')
const send = document.getElementById('send')
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

const updateClientData = async()=>{
    const body = {
        username: username.value, 
        email: email.value,
        phone: phone.value
    }

    if(!body.username  || !body.email || !body.phone){
        window.alert('Preencha todos os campos')
        return
    }
    
    try{
        const res = await fetch(`${BASE_URL}/user`, {
            method:'PATCH',
            headers: {
                'Content-type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(body)
        })
        
        if(!res.ok){
            const error = await res.text()
            throw new Error(`Erro ao atualizar dados do cliente: ${error}`)
        }
        window.location.href = '../perfil/index.html'
    }catch(e){
        console.error(e)
        window.alert(e)
    }
}

send.onclick = async() =>{
    try{
        await updateClientData()
    }catch(e){
        console.error('Erro ao cadastrar cliente: ', e)
    }
}

document.addEventListener('DOMContentLoaded', ()=>{
    if(!token){
        window.location.href = '../../../index.html'
    }
})
