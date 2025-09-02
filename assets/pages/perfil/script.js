const turnBack = document.querySelector('.back')
const logout = document.querySelector('.logout')
//const BASE_URL = 'https://max-menu-server.onrender.com'
const BASE_URL = 'http://10.23.1.19:3003'
const token = localStorage.getItem('token')



turnBack.addEventListener('click', ()=>{
    window.history.back()
})

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


const getProfile = async()=>{
    try{
        const res = await fetch(`${BASE_URL}/user`, {
            headers: { 'Authorization': token }
        })

        if(!res.ok){
            const error = await res.text()
            throw new Error(`Erro ao buscar dados do cliente: ${error}`)
        }

        return await res.json()
    }catch(e){
        console.error(e)
    }
}

const renderProfile = (data)=>{
    if(!data) return
    /* DADOS CADASTRAIS */
    document.getElementById('username').innerText = data.user.split(' ')[0]
    document.getElementById('client').innerText = data.user
    document.getElementById('phone').innerText = formatPhoneNumber(data.phone)
    document.getElementById('email').innerText = data.email
    /* document.getElementById('emailOnTop').innerText = data.email */
    /* ENDEREÇO */
    document.getElementById('street').innerText = data.street
    document.getElementById('neighbourhood').innerText = data.neighbourhood
    document.getElementById('complement').innerText = data.complement    
}


document.getElementById('updateAddress').addEventListener('click', ()=>{
    window.location.href = '../endereco/index.html?mode=update'
})


document.addEventListener('DOMContentLoaded', async()=>{
    if(!token){
        window.location.href = '../../../index.html'
        return
    }

    const profile = await getProfile()
    console.log(profile)
    if(!profile){
        document.querySelector('.sectionOne')
            .innerHTML = '<p>Não foi possível carregar os dados do cliente.</p>'
        return
    }

    renderProfile(profile)
})