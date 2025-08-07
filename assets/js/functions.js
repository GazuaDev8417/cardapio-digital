const cartIcon = document.querySelector('.cart-icon')
const popupAlert = document.querySelector('.popup-alert')
//const BASE_URL = 'https://max-menu-server.onrender.com'
const BASE_URL = 'https://max-menu-server.vercel.app'
//const BASE_URL = 'http://localhost:3003'

/* FUNÇÕES */
const generateToken = ()=>{
  const token = localStorage.getItem('token')
  if(token) return
  
  fetch(`${BASE_URL}/generate-user-id`)
    .then(res => res.text()).then(data=>{
      localStorage.setItem('token', data)
    }).catch(e => console.log(e.message))
}

const addProductToCart = (product)=>{
    const body = {
        product: product.product,
        price: product.price,
        quantity: product.quantity,
        total: product.total,
        product_id: product.id,
        category: product.category
    }
    
    fetch(`${BASE_URL}/products/cart`, {
        method:'POST',
        headers: {
          'Authorization': `${localStorage.getItem('token')}`,
          'Content-type': 'application/json'
        },
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


