const rua = document.getElementById('street')
const bairro = document.getElementById('neighborhood')
const cep = document.getElementById('cep')
const clientName = document.getElementById('client')
const phone = document.getElementById('phone')
const obs = document.getElementById('obs-content')
const ref = document.getElementById('referencia')
const cancelBtn = document.querySelector('.back-shopping')
const endBtn = document.querySelector('.end-orders')
const token = localStorage.getItem('token')
//const BASE_URL = 'https://max-menu-server.onrender.com'
//const BASE_URL = 'https://max-menu-server.vercel.app'
const BASE_URL = 'http://localhost:3003'



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

const clearForm = ()=>{
    rua.value = ''
    bairro.value = ''
    cep.value = ''
    clientName.value = ''
    phone.value = ''
    ref.value = ''
}

const groupedProducts = async() => {
  try {
    const res = await fetch(`${BASE_URL}/products/flavors`, {
      headers: {
        'Authorization': token
      },
      credentials: 'include'
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Erro na resposta:', errorText);
      throw new Error(errorText);
    }

    const data = await res.json();

    let totalGeral = 0;
    let mensagem = `📦 *Novo Pedido Recebido para:*\n${clientName.value.trim()}\n${rua.value.trim()},\n${bairro.value.trim()}\nCEP: ${cep.value},\n${phone.value}\nPonto de referência: ${ref.value}\n${obs.value !== '' ? `Obs.: ${obs.value}` : ''}\n`;

    data.forEach(({ product, items }) => {
      const preco = parseFloat(product.price);
      const qtd = product.quantity;
      const totalProduto = parseFloat(product.total);
      totalGeral += totalProduto;

      mensagem += `*${product.product.toUpperCase()}* (R$ ${preco.toFixed(2)} x ${qtd} = R$ ${totalProduto.toFixed(2)})\n`;

      items.forEach(item => {
        const subtot = parseFloat(item.total);
        totalGeral += subtot;
        mensagem += `• ${item.flavor}: ${item.quantity} x R$ ${parseFloat(item.price).toFixed(2)} = R$ ${subtot.toFixed(2)}\n`;
      });

      mensagem += '\n';
    });

    mensagem += `🧾 *Total geral:* R$ ${totalGeral.toFixed(2)}`;

    return mensagem;

  } catch (e) {
    console.error('Erro na requisição:', e.message);
    throw e // importante relançar o erro se quiser que o chamador trate
  }
}


const getCartFromClient = async()=>{
  try{
    const res = await fetch(`${BASE_URL}/clients/cart`, {
      headers: { 'Authorization': token },
      credentials: 'include'
    })
    if(!res.ok){
      const errorText = await res.text()
      console.log(errorText)
      return
    }
    const data = await res.json()
    return data
  }catch(e){
    console.error(e.message)
  }  
}

const getProductCartFromClient = async()=>{
  try{
    const res = await fetch(`${BASE_URL}/products/cart`, {
      headers: { 'Authorization': token },
      credentials: 'include'
    })
    if(!res.ok){
      const errorText = await res.text()
      console.log(errorText)
      return
    }
    const data = await res.json()
    return data
  }catch(e){
    console.error(e.message)
  }  
}

const removeProductAndItsFlavor = async()=>{
  try{
    const res = await fetch(`${BASE_URL}/product/client`, {
      method: 'DELETE',
      headers: {
        'Authorization': token
      },
      credentials: 'include'
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Erro ao remover produtos:', errorText);
      return;
    }

    const data = await res.json();
    console.log('Produtos removidos com sucesso:', data);
    clearForm();  
  }catch(e){

  }
}

const singupClient = async(pedido)=>{
  const body = {
    pedido: pedido?.trim() || ''
  }

  try {
    const res = await fetch(`${BASE_URL}/regist/client`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(body),
      credentials: 'include'
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.log(errorText);
      return;
    }

    await removeProductAndItsFlavor();
    clearForm()
    localStorage.removeItem('token');
  } catch (e) {
    console.error(e.message);
  }
}

cancelBtn.addEventListener('click', async()=>{
    await removeProductAndItsFlavor();
    clearForm()
    localStorage.removeItem('token');
    window.location.href = '../../../index.html'
})

endBtn.addEventListener('click', async()=>{
    if (
        rua.value.trim() === '' ||
        bairro.value.trim() === '' ||
        cep.value.trim() === '' ||
        clientName.value.trim() === '' ||
        phone.value.trim() === '' ||
        ref.value.trim() === ''
    ) {
        window.alert('Por favor, preencha todos os campos.')
        return 
    }  
    
    const cart = await getCartFromClient()
    const products = await getProductCartFromClient()
    if(!cart || cart.length === 0){
      window.alert('Seu carrinho ainda está vazio')
      return
    } 
    console.log('Produtos', products)
    console.log('Sabores', cart)
    const produtos = cart
    const mensagemFormatada = await groupedProducts();
    const mensagemUrl = `📦 *Novo Pedido Recebido para:*\n${clientName.value.trim()}\n${rua.value.trim()},\n${bairro.value.trim()}\nCEP: ${cep.value},\n${phone.value}\nPonto de referência: ${ref.value}\n${obs.value !== '' ? `Obs.: ${obs.value}` : ''}`
    const url = `https://wa.me/5571982551522?text=${encodeURIComponent(mensagemUrl)}`
    
    
    /* window.open(url, '_blank')
    singupClient(mensagemFormatada) */
})

document.addEventListener('DOMContentLoaded', ()=>{
  if(!token){
      window.location.href = '../../../index.html'
      return
  }
})
