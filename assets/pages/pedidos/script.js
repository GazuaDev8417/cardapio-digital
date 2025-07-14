document.addEventListener('DOMContentLoaded', ()=>{
    const turnBackBtn = document.querySelector('.back')
    const secondStep = document.querySelector('.second-step')
    const thirdStep = document.querySelector('.third-step')
    const headerTitle = document.querySelector('.header-title')
    const params = new URLSearchParams(window.location.search)
    const productId = decodeURIComponent(params.get('id'))
    const BASE_URL = 'http://localhost:3003'
    const title = params.get('title').toUpperCase()
    const price = decodeURIComponent(params.get('price'))
    const openMenu = document.getElementById('menuIcon')
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')
    const submenuItems = document.querySelectorAll('.submenu li')
    const arraySubmenu = Array.from(submenuItems)
    const popupAlert = document.querySelector('.popup-alert')
    
  




    /* ALTERAR QUANTIDADE */    
    let selectedFlavors = {}

    const updateQuantity = (id, change, maxQuantity, element, flavor)=>{
        const quantityElement = element.querySelector('.quantity > span')
        const current = parseInt(quantityElement.textContent)

        if(change > 0 && current >= maxQuantity){
            popupAlert.textContent = `Você pode adicionar até ${maxQuantity} de ${flavor}`
            popupAlert.classList.add('active')
            setTimeout(() => popupAlert.classList.remove('active'), 3000)
        }

        

        fetch(`${BASE_URL}/flavor_quantity/${id}`, {
            method:'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: change })
        }).then(res=>{
            getFlavorsByProduct(productId)
        }).catch(e => window.alert(e.message))      
    }

    /* BUSCAR SABORES */
    const getFlavorsByProduct = ()=>{
        fetch(`${BASE_URL}/flavors/${productId}`).then(res => res.json())
            .then(data=>{
                document.getElementById('subtitle').textContent = data[0].subtitle
                document.getElementById('min-max-container').innerHTML = `<span>Mínimo: ${data[0].quantity}</span><span>Máximo: ${data[0].max_quantity}</span>`
                document.getElementById('additional-value').textContent = `Valor adicional: R$ 0`

                const list = document.getElementById('flavors-list')
                list.innerHTML = ''

                data.forEach(item=>{
                    const price = item.price ?? ''
                    const ingredients = item.ingredients || ''
                    const div = document.createElement('div')

                    div.className = 'item'
                    div.innerHTML = `
                        <div class='flavor'>
                            <div>${item.flavor}</div>
                            ${ingredients ? `<small>${ingredients}</small>` : ''}
                            ${price ? `<small>${price}</small>` : ''}
                        </div>
                        <div class='quantity'>
                            <button class='minus'>-</button>
                            <span>${item.quantity}</span>
                            <button class='plus'>+</button>
                        </div>
                    `
                    list.appendChild(div)

                    const minusBtn = div.querySelector('.minus')
                    const plusBtn = div.querySelector('.plus')

                    minusBtn.addEventListener('click', () => updateQuantity(item.id, -1, item.max_quantity, div, item.flavor))
                    plusBtn.addEventListener('click', () => updateQuantity(item.id, 1, item.max_quantity, div, item.flavor))
                })
            }).catch(e => console.error(e.message) || 'Erro ao buscar sabores')
    }

    getFlavorsByProduct()
    
})
