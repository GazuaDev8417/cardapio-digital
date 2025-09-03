/* const rua = document.getElementById('street')
const bairro = document.getElementById('neighborhood')
const cep = document.getElementById('cep')
const clientName = document.getElementById('client')
const phone = document.getElementById('phone') */
const obs = document.getElementById('obs-content')
const ref = document.getElementById('referencia')
//const cancelBtn = document.querySelector('.back-shopping')
const endBtn = document.querySelector('.end-orders')
const token = localStorage.getItem('token')
//const BASE_URL = 'https://max-menu-server.onrender.com'
//const BASE_URL = 'https://max-menu-server.vercel.app'
const BASE_URL = 'http://localhost:3003'




/* INTEGRAÇÃO MERADO PAGO */
const mp = new MercadoPago('TEST-39d56206-34f1-40ff-93b5-f5be9b5c7a80', {
    locale: 'pt-BR'
});
/* CARTÃO */
const cardForm = mp.cardForm({
    amount: "100.50", // Valor do pagamento
    iframe: true,
    form: {
        id: "form-checkout",
        cardNumber: {
            id: "form-checkout__cardNumber",
            placeholder: "Número do cartão"
        },
        expirationDate: {
            id: "form-checkout__expirationDate",
            placeholder: "MM/YY"
        },
        securityCode: {
            id: "form-checkout__securityCode",
            placeholder: "CVC"
        },
        cardholderName: {
            id: "form-checkout__cardholderName",
            placeholder: "Nome e sobrenome"
        },
        cardholderEmail: {
            id: "form-checkout__cardholderEmail",
            placeholder: "E-mail"
        },
        installments: {
            id: "form-checkout__installments",
            placeholder: "Parcelas"
        },
        issuer: {
            id: "form-checkout__issuer",
            placeholder: "Banco emissor"
        },
    },
    callbacks: {
        onReady: function() {
            console.log('Formulário de cartão carregado.');
        },
        onFormMounted: function(error) {
            if (error) return console.warn("Form Mounted failed: ", error);
            console.log("Form Mounted");
        },
        onError: function(error) {
            console.error(error);
        },
        onSubmit: async function(event) {
            event.preventDefault();
            const formData = cardForm.get().formData
            const {
                token,
                paymentMethodId,
                issuerId,
                installments,
                cardholderEmail,
                cardholderName
            } = formData

            try {
                const res = await fetch('SUA_URL_DO_BACKEND/pay', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token,
                        paymentMethodId,
                        email: cardholderEmail,
                        installments: Number(installments)
                    })
                });

                const data = await res.json();
                console.log('Pagamento processado:', data);
                
                // Lógica de polling (igual à sua)
                const orderId = data.orderId;
                const interval = setInterval(async () => {
                    const statusRes = await fetch(`SUA_URL_DO_BACKEND/payments/status/${orderId}`);
                    const statusData = await statusRes.json();
                    if (statusData.status === 'approved') {
                        clearInterval(interval);
                        alert('Pagamento com cartão aprovado! 🎉');
                    }
                }, 5000);

            } catch (e) {
                console.error('Erro ao processar pagamento:', e);
                alert('Erro ao processar pagamento.');
            }
        }
    }
});
/* PIX */
document.getElementById('pix-button').addEventListener('click', async () => {
    try {
        const res = await fetch('http://localhost:3000/pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentMethodId: 'pix',
                email: 'email-do-usuario@exemplo.com', // E-mail do usuário
                items: [{
                    title: 'Produto',
                    quantity: 1,
                    unit_price: 100.50
                }]
            })
        });

        const data = await res.json();
        console.log('Resposta do Pix:', data);
        
        if (data.qr_code_base64) {
            const qrCodeContainer = document.getElementById('qr-code-container');
            qrCodeContainer.innerHTML = `
                <p>Escaneie o QR Code para pagar:</p>
                <img src="data:image/jpeg;base64,${data.qr_code_base64}" alt="QR Code Pix">
                <p>Ou use o código Pix Copia e Cola:</p>
                <textarea>${data.qr_code}</textarea>
            `;
        }

        // Lógica de polling (igual à sua)
        const orderId = data.orderId;
        const interval = setInterval(async () => {
            const statusRes = await fetch(`SUA_URL_DO_BACKEND/payments/status/${orderId}`);
            const statusData = await statusRes.json();
            if (statusData.status === 'approved') {
                clearInterval(interval);
                alert('Pagamento com Pix aprovado! 🎉');
            }
        }, 5000);

    } catch (e) {
        console.error('Erro ao processar pagamento Pix:', e);
        alert('Erro ao processar pagamento Pix.');
    }
});
/* ======================= */


/* const addressByCep = ()=>{
    
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
} */


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
    /* ENDEREÇO */
    document.getElementById('street').innerText = data.street
    document.getElementById('cep').innerText = data.cep
    document.getElementById('neighbourhood').innerText = data.neighbourhood
    document.getElementById('complement').innerText = data.complement    
}

document.getElementById('updateAddress').addEventListener('click', ()=>{
    window.location.href = '../endereco/index.html'
})


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

/* const singupClient = async(pedido)=>{
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
} */

/* cancelBtn.addEventListener('click', async()=>{
    await removeProductAndItsFlavor();
    clearForm()
    localStorage.removeItem('token');
    window.location.href = '../../../index.html'
}) */

endBtn.addEventListener('click', async()=>{
  window.alert('Lembrando que aqui você só notifica o seu pedido para o entregador. A realização de pagamento ainda fia pendente')
  /* if (
      rua.value.trim() === '' ||
      bairro.value.trim() === '' ||
      cep.value.trim() === '' ||
      clientName.value.trim() === '' ||
      phone.value.trim() === '' ||
      ref.value.trim() === ''
  ) {
      window.alert('Por favor, preencha todos os campos.')
      return 
  }  */ 
  
  const cart = await getCartFromClient()
  //const products = await getProductCartFromClient()
  if(!cart || cart.length === 0){
    window.alert('Seu carrinho ainda está vazio')
    return
  } 

  /* const produtos = cart
  const mensagemFormatada = await groupedProducts() */
  const profile = await getProfile()
  const mensagemUrl = `📦 *Novo Pedido Recebido para:*\n${profile.user.trim()}\n${profile.street.trim()},\n${profile.neighbourhood.trim()}\nCEP: ${profile.cep},\n${profile.phone}\nPonto de referência: ${profile.complement}\n${obs.value !== '' ? `Obs.: ${obs.value}` : ''}`
  const url = `https://wa.me/5571982551522?text=${encodeURIComponent(mensagemUrl)}`
  
  
  window.open(url, '_blank')
  /*singupClient(mensagemFormatada) */
})

document.addEventListener('DOMContentLoaded', async()=>{
  if(!token){
      window.location.href = '../../../index.html'
      return
  }

  const profile = await getProfile()

    renderProfile(profile)
})
