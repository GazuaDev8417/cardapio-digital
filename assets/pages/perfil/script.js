const turnBack = document.querySelector('.back')
const logout = document.querySelector('.logout')
const token = localStorage.getItem('token')
const params = new URLSearchParams(window.location.search)
const mode = params.get('mode')
const userId = params.get('userId')
const userRole = params.get('role')



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
    const decide = window.confirm(
        'Essa operação irá deletar seus dados e seus pedidos. E é irreversível! Tem certeza que deseja excluir sua conta?'
    )

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

/* HISTÓRICO DE PRODUTOS */
const groupedProducts = async() => {
    const data = userRole === 'ADM' ? await fetchDataProductsByClient(userId) : await fetchDataProducts()
    const container = document.getElementById('main-container')
    
    data.forEach(group => {     
        const { product, items } = group

        // Container principal de um produto
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('item-container');

        // Bloco de informações do produto
        const productDiv = document.createElement('div');
        
        productDiv.classList.add('product');
        productDiv.innerHTML = `
        <strong>Nome do produto:</strong> ${product.product}<br>
        <strong>Preço:</strong> R$ ${product.price}<br>
        <strong>Quantidade:</strong> ${product.quantity}<br>
        <strong>Total:</strong> R$ ${product.total}<br>
        <strong>Pedido feito às:</strong> ${product.moment.split('às')[1]}
        `;
        itemContainer.appendChild(productDiv)
        /* CONTAINER DOS SABORES */
        const itemsDiv = document.createElement('div');
        itemsDiv.classList.add('items');

        items.forEach(flavor => {
        // Card individual de cada sabor
        const itemCard = document.createElement('div');
        itemCard.classList.add('items-card');

        // Informações do sabor
        const flavorDiv = document.createElement('div');
        flavorDiv.classList.add('flavor');
        flavorDiv.innerHTML = `
            <strong>Sabor:</strong> ${flavor.flavor}<br>
            <strong>Preço:</strong> ${!flavor.price || Number(flavor.price) === 0 ? 'Incluso' : 'R$ ' + flavor.price}<br>
            <strong>Quantidade:</strong> ${flavor.quantity}<br>
            <strong>Total:</strong> R$ ${flavor.total}
        `;
        itemCard.appendChild(flavorDiv)
        
        // Adicionar o item-card à lista de sabores
        itemsDiv.appendChild(itemCard);
        });
        // Adicionar os sabores ao container principal
        itemContainer.appendChild(itemsDiv);

        // Adicionar o item-container ao DOM
        container.appendChild(itemContainer);
    })
}

document.addEventListener('DOMContentLoaded', async()=>{
    if(!token){
        window.location.href = '../../../index.html'
        return
    }

    const profile = userRole === 'ADM' ? await getProfileByAdm(userId) : await getProfile()
    console.log(profile.role)
    if(!profile){
        window.alert('Não foi possível carregar os dados do cliente. Efetue login novamente')
        localStorage.clear()
        window.location.href = '../login/index.html'
        return
    }else if(profile.role === 'ADM'){
        document.getElementById('delUser').style.display = 'none'
    }

    renderProfile(profile)
    groupedProducts()
})