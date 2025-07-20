const cartIcon = document.querySelector('.cart-icon')
const BASE_URL = 'https://max-menu-server.vercel.app'
//const BASE_URL = 'http://localhost:3003'

/* FUNÇÕES */
const getProductById = (id, element)=>{
    const card = element.closest('.card')
    const title = card.querySelector('.card-title').textContent.toUpperCase()
    const price = card.querySelector('.card-price').textContent
    const encodedTitle = encodeURIComponent(title)
    const encodedPrice = encodeURIComponent(price)


    fetch(`${BASE_URL}/product/${id}`).then(res => res.json())
        .then(data=>{
            window.location.href = `assets/pages/pedidos/index.html?id=${id}&title=${encodedTitle}&price=${encodedPrice}`
        }).catch(e => e.message || 'Erro ao buscar produto')
}


const getCartFromClient = ()=>{
    const client = localStorage.getItem('userId')
    fetch(`${BASE_URL}/clients/cart/${client}`)
        .then(res =>{
            if(!res.ok){
                res.text().then(error => console.log(error))
            }

            return res.json()
        })
        .then(data =>{}).catch(e => console.error(e.message))
}

getCartFromClient()
