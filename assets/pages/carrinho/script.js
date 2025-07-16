const BASE_URL = 'https://max-menu-server.vercel.app'


const groupedProducts = () => {
  fetch(`${BASE_URL}/products/flavors`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('main-container');

      let grandTotal = 0
      
      data.forEach(group => {        
        grandTotal += parseFloat(group.product.total) || 0
        group.items.forEach(item=>{
          grandTotal += parseFloat(item.total) || 0
        })
        document.querySelector('.subtotal').textContent = `Total Geral: R$ ${grandTotal.toFixed(2)}`
        
        const { product, items } = group;
        const flavorsTotal = items.reduce((sum, flavor)=>{
          return sum + (parseFloat(flavor.total) || 0)
        }, 0).toFixed(2)
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
          <strong>Total dos sabores:</strong> R$ ${flavorsTotal}<br>
          <strong>Total parcial:</strong> R$ ${(Number(product.total) + Number(flavorsTotal)).toFixed(2)}
        `;
        itemContainer.appendChild(productDiv);

        // Container dos sabores
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
            <strong>Preço:</strong> ${flavor.price ? 'R$ ' + flavor.price : 'Incluso'}<br>
            <strong>Quantidade:</strong> ${flavor.quantity}<br>
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

          const deleteBtn = document.createElement('button');
          deleteBtn.classList.add('delete-btn');
          deleteBtn.innerHTML = `<i class="fa-solid fa-trash" style="font-size: 20px;"></i>`;

          btnContainer.appendChild(plusBtn);
          btnContainer.appendChild(quantityDiv);
          btnContainer.appendChild(deleteBtn);

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
};



document.addEventListener('DOMContentLoaded', groupedProducts)