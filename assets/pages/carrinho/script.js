const cartProductById = async(id)=>{
  return fetch(`${BASE_URL}/cart/product/${id}`)
    .then(async res=>{
      if(!res.ok){
        const error = await res.text()
        return console.log(error)
      }
      return res.json()
    }).then(data =>{
      return data
    }).catch(e => console.error(e.message))
}

const updateProductQntFromCart = (id, quantity)=>{
  const body = { quantity }

  fetch(`${BASE_URL}/cart/product/${id}`, {
    method:'PATCH',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`
    },
    body: JSON.stringify(body)
  }).then(async res=>{
    if(!res.ok){
      return await res.text().then(error => console.log(error))      
    }
    return await res.text()
  }).then(data => console.log(data))
  .catch(e => console.error(e.message))
}

const updateFlavorQntFromCart = async(quantity, flavor, product_id, max_quantity, price, id)=>{
    const cartData = await cartProductById(id)
    const body = {
        price,
        flavor,
        product_id,
        max_quantity,
        step: cartData.step,
        quantity
    }
  
    fetch(`${BASE_URL}/update_qnt`, {
        method:'PATCH',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
    }).then(res=>{
      if(!res.ok){
        res.text().then(error => console.log(error))
      }
    }).catch(e => console.error(e.message))
}

const groupedProducts = () => {
  fetch(`${BASE_URL}/products/flavors`, {
      headers: {
        'Content-type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      }
    }).then(async res=>{
      if(!res.ok){
        const error = await res.text()
        document.querySelector('.no-products').textContent = error
        throw new Error(error)
      }
      return await res.json()
    }).then(data => {
      const container = document.getElementById('main-container')
      const subtotal = document.querySelector('.subtotal')
      let grandTotal = 0
      
      data.forEach(group => {        
        grandTotal += parseFloat(group.product.total) || 0
        if(group.items?.length){
          group.items.forEach(item=>{
            grandTotal += parseFloat(item.total) || 0
          })
        }

        subtotal.innerHTML = `
          Total Geral: R$ ${grandTotal.toFixed(2)}<br>
          <small>Clique para atualizar o valor</small>
        `
        
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
          ${product.category !== 'bebida' ? `<strong>Quantidade:</strong> ${product.quantity}<br>` : ''}
          <strong>Total:</strong> R$ ${product.total}
        `;
        itemContainer.appendChild(productDiv);

        /* CARD DAS BEBIDAS */        
        if(product.category === 'bebida'){
          const btnContainer = document.createElement('div')
          btnContainer.classList.add('btn-container')

          const plusBtn = document.createElement('button')
          plusBtn.classList.add('add-btn')
          plusBtn.textContent = '+'

          const quantityDiv = document.createElement('div')
          quantityDiv.classList.add('quantity')
          quantityDiv.textContent = product.quantity

          const minusBtn = document.createElement('button')
          minusBtn.classList.add('minus-btn')
          minusBtn.textContent = '-'

          btnContainer.appendChild(plusBtn)
          btnContainer.appendChild(quantityDiv)
          btnContainer.appendChild(minusBtn)

          productDiv.appendChild(btnContainer)
          /* AÇÃO DOS BOTÕES PARA AS QUANTIDADES DE BEBIDAS */
          minusBtn.addEventListener('click', async()=>{
            if(product.quantity <= 1){
              const confirmDel = window.confirm(`Tem certeza que desja remover ${product.product}?`)
              if(!confirmDel) return

              container.removeChild(itemContainer)
            }

            updateProductQntFromCart(product.id, -1)
            quantityDiv.textContent = product.quantity -= 1

            const previousTotal = parseFloat(product.total)
            product.total = (product.quantity * product.price).toFixed(2)

            productDiv.querySelector('strong:last-of-type')
              .nextSibling.textContent = ` R$ ${product.total}`
            
            grandTotal += parseFloat(product.total) - previousTotal
            subtotal.innerHTML = `
              Total Geral: R$ ${grandTotal.toFixed(2)}<br>
              <small>Clique para atualizar o valor</small>
            `
          })

         plusBtn.addEventListener('click', ()=>{
            updateProductQntFromCart(product.id, 1)
            quantityDiv.textContent = product.quantity += 1

            const previousTotal = parseFloat(product.total)
            product.total = (product.quantity * product.price).toFixed(2)

            productDiv.querySelector('strong:last-of-type')
              .nextSibling.textContent = ` R$ ${product.total}`
            
            grandTotal += parseFloat(product.total) - previousTotal
            subtotal.innerHTML = `
              Total Geral: R$ ${grandTotal.toFixed(2)}<br>
              <small>Clique para atualizar o valor</small>
            `
         }) 
        }
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
            <strong>Total:</strong> R$ ${flavor.total}
          `;
          
          // Botões de ação
          const btnContainer = document.createElement('div');
          btnContainer.classList.add('btn-container');

          const plusBtn = document.createElement('button');
          plusBtn.classList.add('add-btn');
          plusBtn.textContent = '+';

          const quantityDiv = document.createElement('div');
          quantityDiv.classList.add('quantity');
          quantityDiv.textContent = flavor.quantity;

          const minusBtn = document.createElement('button')
          minusBtn.classList.add('minus-btn')
          minusBtn.textContent = '-'

          btnContainer.appendChild(plusBtn);
          btnContainer.appendChild(quantityDiv)
          btnContainer.appendChild(minusBtn)

          /* POPUP ALERT */
          const popupAlert = document.querySelector('.popup-alert')
          /* AÇÕES DOS BOTÕES */
          minusBtn.addEventListener('click', async() =>{
            if(flavor.quantity === 1){
              const confirm = window.confirm(`Tem certeza que quer remover o ${(flavor.flavor).toLowerCase()}?`)
              
              if(!confirm) return

              const flavorTotal = parseFloat(flavor.total)
              itemCard.remove()

              if(itemsDiv.querySelectorAll('.items-card').length === 0){
                container.removeChild(itemContainer)
                grandTotal -= parseFloat(product.total)
              }

              grandTotal -= flavorTotal
              
            }

            await updateFlavorQntFromCart(-1, flavor.flavor, flavor.product_id, flavor.max_quantity, flavor.price, flavor.id)
            
            quantityDiv.textContent = flavor.quantity -= 1
            
            const previousTotal = parseFloat(flavor.total)
            flavor.total = (flavor.quantity * flavor.price).toFixed(2)
            
            flavorDiv.querySelector('strong:last-child')
              .nextSibling.textContent = ` R$ ${flavor.total}`

            grandTotal += parseFloat(flavor.total) - previousTotal
            subtotal.innerHTML = `
              Total Geral: R$ ${grandTotal.toFixed(2)}<br>
              <small>Clique para atualizar o valor</small>
            `
          })

          plusBtn.addEventListener('click', async() =>{
            const totalGroupQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
            if(totalGroupQuantity >= flavor.max_quantity){
              popupAlert.classList.add('active')
              popupAlert.textContent = `Você já atingiu o limite de quantidade adicional`
              setTimeout(() => popupAlert.classList.remove('active'), 3000)

              return
            }
            await updateFlavorQntFromCart(1, flavor.flavor, flavor.product_id, flavor.max_quantity, flavor.price, flavor.id)
            
            quantityDiv.textContent = flavor.quantity += 1

            const previousTotal = parseFloat(flavor.total)
            flavor.total = (flavor.quantity * flavor.price).toFixed(2)

            flavorDiv.querySelector('strong:last-child')
              .nextSibling.textContent = ` R$ ${flavor.total}`

            grandTotal += parseFloat(flavor.total) - previousTotal
            subtotal.innerHTML = `
              Total Geral: R$ ${grandTotal.toFixed(2)}<br>
              <small>Clique para atualizar o valor</small>
            `
          })
          
          // Montar o item-card
          itemCard.appendChild(flavorDiv);
          itemCard.appendChild(btnContainer);
          
          // Adicionar o item-card à lista de sabores
          itemsDiv.appendChild(itemCard);
        });
        
        // Adicionar os sabores ao container principal
        itemContainer.appendChild(itemsDiv);

        // Adicionar o item-container ao DOM
        container.appendChild(itemContainer);
      });
    })
    .catch(e => console.error(e.message));
}
/* fim */
document.addEventListener('DOMContentLoaded', ()=>{
  /* fetch(`${BASE_URL}/clients/cart`, {
    headers: { 'Authorization': localStorage.getItem('token') }
  }).then(async res=>{
    if(!res.ok){
      return await res.text().then(error => console.log(error))
    }
    return await res.json()
  }).then(data => console.log(data))
    .catch(e => console.error(e.message)) */



  groupedProducts()
  /* const userId = localStorage.getItem('userId')
  
  fetch(`${BASE_URL}/clients/cart/${userId}`).then(res => res.json())
    .then(data =>{
      if(data.length === 0){
        document.querySelector('.no-products')
          .textContent = 'Seu carrinho ainda está vazio. Sintá-se à para escolher seus produtos e fazer seus pedidos'
        document.querySelector('.back-shopping').textContent = 'IR ÀS COMPRAS'
      }else{
        document.querySelector('.no-products').textContent = ''
        document.querySelector('.back-shopping').textContent = 'CONTINUAR COMPRANDO'
        groupedProducts()
      }
    }) */
})

const subtotalBtn = document.querySelector('.subtotal')

subtotalBtn.addEventListener('click', ()=>{
  document.getElementById('main-container').innerHTML = ''
  groupedProducts()
})

document.querySelector('.bottom').addEventListener('click', ()=>{
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth'})
})

document.querySelector('.top').addEventListener('click', ()=>{
  window.scrollTo({ top: 0, behavior: 'smooth' })
})