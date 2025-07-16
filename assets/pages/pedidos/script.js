document.addEventListener('DOMContentLoaded', ()=>{
    const turnBackBtn = document.querySelector('.back')
    const secondStep = document.querySelector('.second-step')
    const thirdStep = document.querySelector('.third-step')
    const params = new URLSearchParams(window.location.search)
    const BASE_URL = 'http://localhost:3003'
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

    /* ALTERAR QUANTIDADE */   
    const updateQuantity = (id, change, maxQuantity, element)=>{
        const quantityElement = element.querySelector('.quantity > span')
        const current = parseInt(quantityElement.textContent)

        if(change > 0 && current >= maxQuantity){
            popupAlert.textContent = `Você pode adicionar até ${maxQuantity} de qualquer sabor`
            popupAlert.classList.add('active')
            setTimeout(() => popupAlert.classList.remove('active'), 3000)
        }
        

        fetch(`${BASE_URL}/flavor_quantity/${id}`, {
            method:'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: change, step: currentStep })
        }).then(res=>{
            if(!res.ok){
                return res.json().then(err=>{
                    throw new Error(err.message)
                })
            }
            getFlavorsByProduct(productId, currentStep)
        }).catch(e =>{
            popupAlert.textContent = e.message
            popupAlert.classList.add('active')
            setTimeout(() => popupAlert.classList.remove('active'), 3000)
        })      
    }

    /* BUSCAR SABORES */
    const getFlavorsByProduct = (id, currentStep)=>{
        headerTitle.textContent = title
        fetch(`${BASE_URL}/flavors/${id}`, {
            method:'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ step: currentStep })
        }).then(res => res.json())
            .then(objectData=>{
                const data = objectData.flavors 
                
                if(currentStep === objectData.maxStep){
                    document.getElementById('continue').innerHTML = 'Adicionar ao Carrinho'
                }
                
                document.getElementById('subtitle').textContent = data[0].subtitle
                document.getElementById('min-max-container').innerHTML = `<span>Mínimo: ${currentStep === 1 ? '1' : '0'}</span><span>Máximo: ${data[0].max_quantity}</span>`
                

                const list = document.getElementById('flavors-list')
                list.innerHTML = ''

                let additionalTotal = 0

                data.forEach(item=>{
                    total = item.total
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

                    minusBtn.addEventListener('click', () => updateQuantity(item.id, -1, item.max_quantity, div))
                    plusBtn.addEventListener('click', () => updateQuantity(item.id, 1, item.max_quantity, div))

                    const itemTotal = parseFloat(item.total ?? '0')
                    additionalTotal += itemTotal

                })

                document.getElementById('additional-value').textContent = `Valor adicional: R$ ${additionalTotal.toFixed(2)}`
            }).catch(e => console.error(e.message) || 'Erro ao buscar sabores')
    }

    getFlavorsByProduct(productId, currentStep)
    

    document.getElementById('continue').addEventListener('click', ()=>{
        fetch(`${BASE_URL}/step-qnt_max/${productId}`).then(res => res.json())
            .then(data=>{
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
