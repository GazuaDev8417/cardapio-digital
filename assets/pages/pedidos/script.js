document.addEventListener('DOMContentLoaded', ()=>{
    const turnBackBtn = document.querySelector('.back')
    const headerTitle = document.querySelector('.header-title')
    const openMenu = document.getElementById('menuIcon')
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')
    const stored = localStorage.getItem('productsList')
    const productsList = stored ? JSON.parse(stored) : []
    let categoryTitle = localStorage.getItem('category')
    let title = localStorage.getItem('title')
    let productId = localStorage.getItem('productId')
    let currentStep = 1
    




    /* VOLTAR À PÁGINA PRINCIPAL E REGRESSAR OS PASSOS DA PÁGINA ATUAL*/
    turnBackBtn.addEventListener('click', ()=>{
        if(currentStep === 3){
            currentStep = 2
            getFlavorsByProduct(productId, currentStep)           
        }else if(currentStep === 2){
            currentStep = 1
            getFlavorsByProduct(productId, currentStep)
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
                    localStorage.setItem('category', product.category)
                    categoryTitle = product.category

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
            max_quantity,
            step: currentStep
        }
        
        fetch(`${BASE_URL}/insert_in_cart`, {
            method:'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify(body)
        }).then(res=>{
            if(!res.ok){
                return res.text().then(error=>{
                    console.error(error)
                })
            }
        }).catch(e => console.error(e.message))
    }

    /* ALTERA QUANTIDADE DO PRODUTO NO CARRO */
    const updateCartProductQnt = (quantity, flavor, product_id, max_quantity, price)=>{
        const body = {
            price,
            flavor,
            product_id,
            max_quantity,
            step: currentStep,
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
                res.text().then(error=>{
                    console.log(error)
                    if(error === 'Produto não encontrado'){
                        addToCart(price, quantity, flavor, product_id, max_quantity)
                    }
                })                
            }
        }).catch(e => console.error(e.message))
    }
    
   /* BUSCAR SABORES */
    const getFlavorsByProduct = (id, currentStep)=>{
        headerTitle.textContent = title
        fetch(`${BASE_URL}/flavors/${id}`, {
            method:'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ step: currentStep })
        }).then(async res =>{
            if(!res.ok){
                return res.text().then(error => {
                    console.error(error)
                    throw new Error('Erro ao buscar sabores')
                })
            }
            return res.json()
        }).then(objectData=>{
            const data = objectData.flavors
            
            if(currentStep === objectData.maxStep){
                document.getElementById('continue').innerHTML = 'ADICIONAR AO CARRINHO'
            }
            
            document.getElementById('subtitle').textContent = data[0].subtitle
            const maxQuantity = data[0].max_quantity
            document.getElementById('min-max-container').innerHTML = `
                <span>Mínimo: ${currentStep === 1 ? '1' : '0'}</span>
                <span>Máximo: ${maxQuantity}</span>
            `
            

            const list = document.getElementById('flavors-list')
            list.innerHTML = ''
            
            document.body.style.backgroundImage = `url('../../imgs/${categoryTitle}/background.avif')`
            document.body.style.backgroundSize = 'cover'
            document.body.style.backgroundRepeat = 'repeat'
            data.forEach(item=>{
                const price = parseFloat(item.price) ?? 0
                const ingredients = item.ingredients || ''
                const div = document.createElement('div')

                div.className = 'item'
                div.style.backgroundImage = `url(../../imgs/${categoryTitle}/cards.avif)`
                div.style.backgroundSize = 'cover'
                div.style.backgroundPosition = 'center'
                div.style.backgroundRepeat = 'no-repeat'


                div.innerHTML = `
                    <div class='card-overlay'></div>
                    <div class='flavor'>
                        <div>${item.flavor}</div>
                        ${ingredients ? `<small class='ingredients'>${ingredients}</small>` : ''}
                        ${price ? `<small class='price'>R$ ${price.toFixed(2)}</small>` : ''}
                    </div>
                    <div class='quantity'>
                        <button class='minus'>-</button>
                        <span>${item.quantity >= 0 ? item.quantity : 1}</span>
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
                        updateCartProductQnt(-1, item.flavor, item.product_id, item.max_quantity, price, item.id)
                        quantitySpan.textContent = current - 1
                        
                    }
                })

                plusBtn.addEventListener('click', () =>{
                    const current = parseInt(quantitySpan.textContent)
                    const totalCurrent = getTotalQuantity()
                    
                    if(totalCurrent < maxQuantity){
                        updateCartProductQnt(1, item.flavor, item.product_id, item.max_quantity, price, item.id)
                        quantitySpan.textContent = current + 1
                        
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
        }).catch(e => console.error(e.message) || 'Erro ao buscar sabores')
    }

    document.getElementById('continue').addEventListener('click', async()=>{
        try{

            const response = await fetch(`${BASE_URL}/step-qnt_max/${productId}`, {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                }
            })

            if(!response.ok){
                const error = await response.text()
                console.error(error)
                return
            }

            const data = await response.json()
            const maxStep = data.maxStep

            if(data.total_quantity === 0 && currentStep === 1){
                popupAlert.textContent = 'Voce deve adiciohnar pelo menos um sabor'
                popupAlert.classList.add('active')
                setTimeout(() => popupAlert.classList.remove('active'), 3000)
            }else if(currentStep < maxStep){
                currentStep++
                getFlavorsByProduct(productId, currentStep)
            }else if(currentStep > 1 && currentStep < maxStep){
                currentStep++
                getFlavorsByProduct(productId, currentStep)
            }else if(currentStep === maxStep){
                window.location.href = '../carrinho/index.html'
            }

        }catch(e){
            console.error(e.message)
        }
    })   
    
    getFlavorsByProduct(productId, currentStep)
})
