const turnBack = document.querySelector('.back')
const logout = document.querySelector('.logout')
const token = localStorage.getItem('token')
const params = new URLSearchParams(window.location.search)
const mode = params.get('mode')



if(mode === 'delivery'){
    turnBack.addEventListener('click', ()=>{
        window.history.back()
    })
}else{
    turnBack.addEventListener('click', ()=>{
        window.location.href = '../../../index.html'
    })
}

logout.addEventListener('click', ()=>{
    const decide = window.confirm('Tem certeza que deseja sair da sua conta?')
    if(decide){
        localStorage.clear()
        window.location.href = '../../../index.html'
    }
})


const formatPhoneNumber = (phone)=>{
    const digits = phone.replace(/\D/g, '')

    if(digits.length <= 10){
        return digits.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3')
    }

    return digits.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3')
}


const renderProfile = (data)=>{
    if(!data) return
    /* DADOS CADASTRAIS */
    document.getElementById('username').innerText = data.user.split(' ')[0]
    document.getElementById('client').innerText = data.user
    document.getElementById('cep').innerText = data.cep
    document.getElementById('phone').innerText = formatPhoneNumber(data.phone)
    document.getElementById('email').innerText = data.email
    /* document.getElementById('emailOnTop').innerText = data.email */
    /* ENDEREÇO */
    document.getElementById('street').innerText = data.street
    document.getElementById('neighbourhood').innerText = data.neighbourhood
    document.getElementById('complement').innerText = data.complement    
}


document.getElementById('updateProfile').addEventListener('click', ()=>{
    window.location.href = '../edituser/index.html'
})

document.getElementById('updateAddress').addEventListener('click', ()=>{
    window.location.href = '../endereco/index.html?mode=update'
})

document.getElementById('delUser').addEventListener('click', async()=>{
    const decide = window.confirm('Essa operação é irreversível! Tem certeza que deseja excluir sua conta?')

    if(!decide) return

    try{
        const res = await fetch(`${BASE_URL}/del-user`, {
            method:'DELETE',
            headers: { 'Authorization': token }
        })

        if(!res.ok){
            const error = await res.text()
            throw new Error(`Erro ao excluir conta: ${error}`)
        }

        localStorage.clear()
        window.location.href = '../../../index.html'
    }catch(e){
        console.error(e)
    }
})


document.addEventListener('DOMContentLoaded', async()=>{
    if(!token){
        window.location.href = '../../../index.html'
        return
    }

    const profile = await getProfile()
    
    if(!profile){
        window.alert('Não foi possível carregar os dados do cliente. Efetue login novamente')
        localStorage.clear()
        window.location.href = '../login/index.html'
        return
    }

    renderProfile(profile)
})