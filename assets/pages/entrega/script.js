const rua = document.getElementById('street')
const bairro = document.getElementById('neighborhood')
const cep = document.getElementById('cep')
const clientName = document.getElementById('client')
const phone = document.getElementById('phone')
const obs = document.getElementById('obs-content')

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
    if (
        rua.value.trim() === '' ||
        bairro.value.trim() === '' ||
        cep.value.trim() === '' ||
        clientName.value.trim() === '' ||
        phone.value.trim() === ''
    ) {
        window.alert('Por favor, preencha todos os campos.')
        return 
    }

    const body = {
        id: userId,
        client: client?.value.trim() || '',
        street: rua?.value.trim() || '',
        neighborhood: bairro?.value.trim() || '',
        cep: cep?.value.trim() || '',
        phone: phone?.value.trim() || '',
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

const groupedProducts = () => {
  fetch(`${BASE_URL}/products/flavors`, {
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

      const container = document.getElementById('main-container')

      container.innerHTML = ''; // limpa conteúdo anterior

      let totalGeral = 0;

      data.forEach(group => {
        const { product, items } = group;

        // Somando o total dos itens para o total do produto (se quiser mostrar no produto)
        let productTotal = items.reduce((sum, item) => {
          const itemTotal = parseFloat(item.total);
          return sum + (isNaN(itemTotal) ? 0 : itemTotal);
        }, 0);

        // Acumula total geral somando os itens
        totalGeral += productTotal;

        const section = document.createElement('section');
        section.className = 'modal-container'
        section.innerHTML = `
          <h2>${product.product}</h2>
          <p><strong>Quantidade:</strong> ${product.quantity}</p>
          <p><strong>Preço:</strong> R$ ${parseFloat(product.price).toFixed(2)}</p>
          <p><strong>Total do Produto:</strong> R$ ${productTotal.toFixed(2)}</p>
          <h3>Sabores adicinados</h3>
          <table border="1" cellspacing="0" cellpadding="8">
            <thead>
              <tr>
                <th>Sabor</th>
                <th>Quantidade</th>
                <th>Valor Unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.flavor}</td>
                  <td>${item.quantity}</td>
                  <td>R$ ${parseFloat(item.price).toFixed(2)}</td>
                  <td>R$ ${parseFloat(item.total).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <hr/>
        `;
        container.appendChild(section);
      });

      // Adiciona total geral no final (soma total dos items)
      const totalDiv = document.createElement('div');
      totalDiv.style.textAlign = 'right';
      totalDiv.style.marginTop = '20px';
      totalDiv.style.fontWeight = 'bold';
      totalDiv.innerText = `Total Geral: R$ ${totalGeral.toFixed(2)}`;
      container.appendChild(totalDiv);

    })
    .catch(e => console.error('Erro na requisição:', e.message));
}

groupedProducts()

const modal = document.querySelector('.modal')
const closeBtn = document.querySelector('.close-btn')

document.querySelector('.end-orders').addEventListener('click', ()=>{
    if (
        rua.value.trim() === '' ||
        bairro.value.trim() === '' ||
        cep.value.trim() === '' ||
        clientName.value.trim() === '' ||
        phone.value.trim() === ''
    ) {
        window.alert('Por favor, preencha todos os campos.')
        return 
    }

    modal.classList.add('active')
})

// Fechar ao clicar no X
closeBtn.onclick = () => {
    modal.classList.remove('active')
};

// Fechar ao clicar fora
window.onclick = (event) => {
    if (event.target === modal) {
      modal.classList.remove('active')
    }
};

// Fechar com ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      modal.classList.remove('active')
    }
});
