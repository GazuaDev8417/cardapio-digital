document.addEventListener('DOMContentLoaded', ()=>{
    const turnBackBtn = document.querySelector('.back')
    const secondStep = document.querySelector('.second-step')
    const thirdStep = document.querySelector('.third-step')
    const params = new URLSearchParams(window.location.search)
    const headerTitle = document.querySelector('.header-title')
    const price = decodeURIComponent(params.get('price'))
    const openMenu = document.getElementById('menuIcon')
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')
    const submenuItems = document.querySelectorAll('.submenu li')
    const arraySubmenu = Array.from(submenuItems)
    const popupAlert = document.querySelector('.popup-alert')
    /* let title = params.get('title').toUpperCase()
    let productId = decodeURIComponent(params.get('id')) */
    let title = localStorage.getItem('title')
    let productId = localStorage.getItem('productId')
    let userId = localStorage.getItem('userId')
    let currentStep = 1
    


    /* VOLTAR À PÁGINA PRINCIPAL E REGRESSAR OS PASSOS DA PÁGINA ATUAL*/
    secondStep.textContent = `${currentStep}/3`

    turnBackBtn.addEventListener('click', ()=>{
        if(currentStep === 3){
            currentStep = 2
            getFlavorsByProduct(productId, currentStep)
            secondStep.textContent = `${currentStep}/3`
            thirdStep.style.backgroundColor = ''            
        }else if(currentStep === 2){
            currentStep = 1
            getFlavorsByProduct(productId, currentStep)
            secondStep.textContent = `${currentStep}/3`
            secondStep.style.backgroundColor = ''
        }else if(currentStep === 1){
            window.history.back()
        }
    })

    /* MENU LATERAL E OVERLAY */
    openMenu.addEventListener('click', ()=>{
        sidebar.classList.add('active')
        overlay.classList.add('active')
        renderSiderBarMenu()
    })

    overlay.addEventListener('click', ()=>{
        sidebar.classList.remove('active')
        overlay.classList.remove('active')
    })

    /* RETIRAR MENU LATERAL E FUNDO ESCURECIDO  AO CLICAR NOS ITENS DO MENU*/
    const navLinks = document.querySelectorAll('aside nav a')

    navLinks.forEach(link=>{
        link.addEventListener('click', ()=>{
            sidebar.classList.remove('active')
            overlay.classList.remove('active')
        })
    })

    /* RENDERIZAR MENU */
    const renderSiderBarMenu = ()=>{
        const stored = localStorage.getItem('productsList')
        const productsList = stored ? JSON.parse(stored) : []
        const menuContainer = document.getElementById('menuContainer')
        const categories = {}
        

        productsList.forEach(product=>{
            const category = product.category ?? 'Outros'

            if(!categories[category]){
                categories[category] = []
            }

            categories[category].push(product)
        })

        menuContainer.innerHTML = ''
        Object.entries(categories).forEach(([categoryName, products])=>{
            const categoryDiv = document.createElement('div')
            categoryDiv.className = 'menu-item'
            
            const link = document.createElement('a')
            link.className = `link-${categoryName.toLocaleLowerCase()}`
            link.textContent = categoryName.charAt(0).toUpperCase() + categoryName.slice(1)

            const emoji = getEmojiForCategory(categoryName)
            if(emoji) link.innerHTML += `<span>${emoji}</span>`
            
            const submenu = document.createElement('ul')
            submenu.className = 'submenu'

            products.forEach(product=>{
                const li = document.createElement('li')
                li.textContent = product.product
                li.addEventListener('click', ()=>{
                    productId = product.id
                    title = product.product
                    localStorage.setItem('title', product.product)
                    localStorage.setItem('productId', product.id)
                    getFlavorsByProduct(product.id, currentStep)
                    sidebar.classList.remove('active')
                    overlay.classList.remove('active')
                })
                submenu.appendChild(li)
            })

            categoryDiv.appendChild(link)
            categoryDiv.appendChild(submenu)
            menuContainer.appendChild(categoryDiv)
        })
    }

    const getEmojiForCategory = (category)=>{
        const emojis = {
            'pizza': '🍕',
            'acai': '🥣',
            'lanche': '🍔',
            'porcao': '🍟',
            'pirao': '🍲',
            'bebida': '🥤',
        }

        return emojis[category]
    }

    /* ADIDICIONAR AO CARRINHO */
    const addToCart = (price, quantity, flavor, product_id, max_quantity)=>{
        const body = {
            price,
            quantity,
            flavor,
            productId: product_id,
            client: userId,
            max_quantity,
            step: currentStep
        }
        
        fetch(`${BASE_URL}/insert_in_cart`, {
            method:'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(body)
        }).then(res=>{
            if(!res.ok){
                return res.text().then(error=>{
                    console.error(error)
                })
            }
        }).catch(e => console.error(e.message))
    }

    /* VERIFICAR SE O PRODUTO JÁ EXISTE NO CARRINHO */
    const updateCartProductQnt = (id, change)=>{
        fetch(`${BASE_URL}/update_qnt/${id}`, {
            method:'PATCH',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ quantity: change })
        }).then(res=>{
            if(!res.ok){
                return res.text().then(error=> console.error(error))
            }
        }).catch(e => console.error(e.message))
    }
    
    
    const updateQuantity = (price, quantity, flavor, product_id, change, max_quantity)=>{
        const body = {
            price: Number(price),
            flavor,
            productId: product_id,
            client: userId,
            max_quantity
        }
        
        fetch(`${BASE_URL}/cart_product`, {
            method:'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(body)
        }).then(response=>{
            if(!response.ok){
                response.text().then(error=>{
                    if(error === 'Produto não encontrado no carrinho' && change === 1){
                        addToCart(body.price, quantity, body.flavor, body.productId, body.max_quantity)
                    }
                })
            }else{
                response.json().then(data=>{
                    updateCartProductQnt(data.id, change)
                })
            }
        }).catch(e => console.error(e.message))
    }

    /* BUSCAR SABORES */
    const getFlavorsByProduct = (id, currentStep)=>{
        headerTitle.textContent = title
        fetch(`${BASE_URL}/flavors/${id}`, {
            method:'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ step: currentStep, client: userId })
        }).then(res => res.json())
            .then(objectData=>{
                const data = objectData.flavors
                
                if(currentStep === objectData.maxStep){
                    document.getElementById('continue').innerHTML = 'Adicionar ao Carrinho'
                }
                
                document.getElementById('subtitle').textContent = data[0].subtitle
                const maxQuantity = data[0].max_quantity
                document.getElementById('min-max-container').innerHTML = `
                    <span>Mínimo: ${currentStep === 1 ? '1' : '0'}</span>
                    <span>Máximo: ${maxQuantity}</span>
                `
                

                const list = document.getElementById('flavors-list')
                list.innerHTML = ''
                

                data.forEach(item=>{
                    const price = item.price ?? ''
                    const ingredients = item.ingredients || ''
                    const div = document.createElement('div')

                    div.className = 'item'
                    div.innerHTML = `
                        <div class='flavor' data-price='${price}'>
                            <div>${item.flavor}</div>
                            ${ingredients ? `<small>${ingredients}</small>` : ''}
                            ${price ? `<small>${price}</small>` : ''}
                        </div>
                        <div class='quantity'>
                            <button class='minus'>-</button>
                            <span>${item.quantity || 0}</span>
                            <button class='plus'>+</button>
                        </div>
                    `
                    list.appendChild(div)
                    
                    const minusBtn = div.querySelector('.minus')
                    const plusBtn = div.querySelector('.plus')
                    const quantitySpan = div.querySelector('span')


                    minusBtn.addEventListener('click', () =>{
                        const current = parseInt(quantitySpan.textContent)
                        if(current > 0){
                            quantitySpan.textContent = current - 1
                            updateQuantity(price, item.quantity, item.flavor, item.product_id, -1, item.max_quantity)
                            updateTotal()
                        }
                    })

                    plusBtn.addEventListener('click', () =>{
                        const current = parseInt(quantitySpan.textContent)
                        const totalCurrent = getTotalQuantity()
                        
                        if(totalCurrent < maxQuantity){
                            updateQuantity(price, item.quantity, item.flavor, item.product_id, 1, item.max_quantity)
                            quantitySpan.textContent = current + 1
                            updateTotal()
                        }else{
                            popupAlert.textContent = `Você pode adicionar até ${maxQuantity} sabores em geral`
                            popupAlert.classList.add('active')
                            setTimeout(() => popupAlert.classList.remove('active'), 3000);
                        }
                    })                    
                })
                    
                const getTotalQuantity = ()=>{
                    const spans = document.querySelectorAll('#flavors-list .quantity span')
                    return Array.from(spans).reduce((acc, span) => acc + parseInt(span.textContent), 0)
                }
                
                const updateTotal = ()=>{
                    const allItems = document.querySelectorAll('#flavors-list .item')
                    let total = 0

                    allItems.forEach(itemEl => {
                        const price = parseFloat(itemEl.dataset.price || '0')
                        const quantity = parseInt(itemEl.querySelector('.quantity span')?.textContent || '0')
                        total += price * quantity
                    })
                    document.getElementById('additional-value').textContent = `Valor adicional: R$ ${total.toFixed(2)}`
                }
            }).catch(e => console.error(e.message) || 'Erro ao buscar sabores')
    }

    getFlavorsByProduct(productId, currentStep)
    

    document.getElementById('continue').addEventListener('click', ()=>{
        fetch(`${BASE_URL}/step-qnt_max/${productId}`, {
            method:'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ client: userId })
        }).then(res =>{
            if(!res.ok){
                return res.text().then(error => console.error(error))
            }
            return res.json()
        }).then(data=>{
                console.log(data)
                const maxStep = data.maxStep
                if(data.total_quantity === 0 && currentStep === 1){
                    popupAlert.textContent = 'Voce deve adiciohnar pelo menos um sabor'
                    popupAlert.classList.add('active')
                    setTimeout(() => popupAlert.classList.remove('active'), 3000)
                }else if(currentStep < maxStep){
                    currentStep++
                    getFlavorsByProduct(productId, currentStep)
                    secondStep.textContent = `${currentStep}/${maxStep}`
                    secondStep.style.backgroundColor = 'red'
                }else if(currentStep > 1 && currentStep < maxStep){
                    currentStep++
                    getFlavorsByProduct(productId, currentStep)
                    secondStep.textContent = `${currentStep}/${maxStep}`
                    thirdStep.style.backgroundColor = 'red'
                }else if(currentStep === maxStep){
                    window.location.href = '../carrinho/index.html'
                }
            }).catch(e => console.error(e.message))
    })
    
})
