/* INPUTS */
const rua = document.getElementById('rua')
const cep = document.getElementById('cep')
const bairro = document.getElementById('bairro')
const complemento = document.getElementById('complemento')
/* BOTÕES */
const clear = document.getElementById('clear')
const send = document.getElementById('send')
/* BASE URL */
//const BASE_URL = 'https://max-menu-server.onrender.com'
//const BASE_URL = 'https://max-menu-server.vercel.app'
const BASE_URL = 'http://10.23.1.19:3003'
const token = localStorage.getItem('token')
/* PARÂMETROS DE NAVEGAÇÃO */
const params = new URLSearchParams(window.location.search)
const mode = params.get('mode')




if(mode === 'create'){
    document.querySelector('.back').style.display = 'none'
    document.querySelector('.fill').style.display = 'block'
    send.textContent = 'Registrar'
}else{
    send.textContent = 'Atualizar'
}


document.querySelector('.back').addEventListener('click', ()=>{
    window.history.back()
})


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

const cepByAddress = ()=>{
    
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

cep.addEventListener('blur', addressByCep)


clear.onclick = ()=>{
    rua.value = ''
    cep.value = ''
    bairro.value = ''
    complemento.value = ''
}

const registAddress = async()=>{
    const body = {
        street: rua.value,
        cep: cep.value, 
        neighbourhood: bairro.value, 
        complement: complemento.value
    }

    if(!body.street || !body.cep || !body.neighbourhood || !body.complement){
        window.alert('Preencha todos os campos')
        return
    }

    try{
        const res = await fetch(`${BASE_URL}/user/address`, {
            method:'PATCH',
            headers: {
                'Authorization': token,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        if(!res.ok){
            const error = await res.text()
            throw new Error(`Erro ao adicionar endereo: ${error}`)
        }
        if(mode === 'create'){
            window.location.href = '../../../index.html'
        }else{
            window.location.href = '../perfil/index.html'
        }
    }catch(e){
        window.alert(e)
    }
}

send.onclick = async()=>{
    try{
        await registAddress()
    }catch(e){
        console.error('Erro ao registrar endereço: ', e)
    }
}


document.addEventListener('DOMContentLoaded', ()=>{
    if(!token){
        window.location.href = '../../../index.html'
    }
})

