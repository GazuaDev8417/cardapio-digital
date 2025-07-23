const cartIcon = document.querySelector('.cart-icon')
//const BASE_URL = 'https://max-menu-server.vercel.app'
const BASE_URL = 'http://localhost:3003'

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

const addProductToCart = (product)=>{
    const body = {
        product: product.product,
        price: product.price,
        quantity: product.quantity,
        total: product.total,
        client: userId,
        product_id: product.id,
        category: product.category
    }
    
    fetch(`${BASE_URL}/products/cart`, {
        method:'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(body)
    }).then(async res=>{
        if(!res.ok){
            return await res.text().then(error => console.log(error))
        }
        return await res.text()
    }).then(data=>{
        console.log(data)        
    }).catch(e => console.error(e.message))
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

function formatPhone(input) {
  let digits = input.value.replace(/\D/g, ''); // só números
  
  // Aplica a máscara de acordo com a quantidade de dígitos
  let formatted = '';

  if (digits.length <= 2) {
    formatted = digits; // ainda digitando DDD
  } else if (digits.length <= 7) {
    formatted = `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  } else if (digits.length <= 11) {
    formatted = `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  } else {
    formatted = `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`; // limite
  }

  input.value = formatted;
}


