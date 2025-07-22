const rua = document.getElementById('street')
const bairro = document.getElementById('neighborhood')
const cep = document.getElementById('cep')
const clientName = document.getElementById('client')
const phone = document.getElementById('phone')
const obs = document.getElementById('obs-content')
const ref = document.getElementById('referencia')

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
}

const userId = localStorage.getItem('userId')

const singupClient = ()=>{
    /* if (
        rua.value.trim() === '' ||
        bairro.value.trim() === '' ||
        cep.value.trim() === '' ||
        clientName.value.trim() === '' ||
        phone.value.trim() === ''
    ) {
        window.alert('Por favor, preencha todos os campos.')
        return 
    } */

    const body = {
        id: userId,
        client: client?.value.trim() || '',
        street: rua?.value.trim() || '',
        neighborhood: bairro?.value.trim() || '',
        cep: cep?.value.trim() || '',
        phone: phone?.value.trim().replace(/\D/g, '') || '',
        obs: obs?.value.trim() || ''
    }
    
    fetch(`${BASE_URL}/signup`, {
        method:'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(body)
    }).then(async res=>{
        if(!res.ok){
            return await res.text().then(error => console.log(error))
        }
        return await res.json()
    }).then(data => console.log(data))
        .catch(e => console.error(e.message))
}

const groupedProducts = async() => {
  return fetch(`${BASE_URL}/products/flavors`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ client: userId })
  })
    .then(async res => {
      if (!res.ok) {
        return await res.text().then(error => {
          console.error('Erro na resposta:', error);
          throw new Error(error);
        });
      }
      return await res.json();
    })
    .then(data => {
      let totalGeral = 0;
      let mensagem = `📦 *Novo Pedido Recebido para:*\n${clientName.value.trim()}\n${rua.value.trim()},\n${bairro.value.trim()}\nCEP: ${cep.value},\n${phone.value}\nPonto de referência: ${ref.value}\n ${obs.value !== '' ? `Obs.: ${obs.value}` : ''}\n\n`

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

      mensagem += `🧾 *Total geral:* R$ ${totalGeral.toFixed(2)}`

      return mensagem
    })
    .catch(e => console.error('Erro na requisição:', e.message));
}


document.querySelector('.end-orders').addEventListener('click', async()=>{
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
    
    const mensagemFormatada = await groupedProducts();
    const mensagemUrl = encodeURIComponent(mensagemFormatada);
    const numero = `55${phone.value.trim().replace(/\D/g, '')}`;
    const url = `https://api.whatsapp.com/send?phone=557193784652&text=${mensagemUrl}`;

    /* singupClient() */
    window.open(url, '_blank')
})


/* closeBtn.onclick = () => {
    modal.classList.remove('active')
};

 
window.onclick = (event) => {
    if (event.target === modal) {
      modal.classList.remove('active')
    }
};


document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      modal.classList.remove('active')
    }
}); */
