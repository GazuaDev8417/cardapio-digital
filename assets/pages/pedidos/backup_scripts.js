document.addEventListener('DOMContentLoaded', ()=>{
    const turnBackBtn = document.querySelector('.back')
    const secondStep = document.querySelector('.second-step')
    const thirdStep = document.querySelector('.third-step')
    const headerTitle = document.querySelector('.header-title')
    const params = new URLSearchParams(window.location.search)
    const title = params.get('title').toUpperCase()
    const price = decodeURIComponent(params.get('price'))
    const openMenu = document.getElementById('menuIcon')
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')
    const submenuItems = document.querySelectorAll('.submenu li')
    const arraySubmenu = Array.from(submenuItems)
    const popupAlert = document.querySelector('.popup-alert')
    
  
    

    /* MENU LATERAL E OVERLAY */
    openMenu.addEventListener('click', ()=>{
        sidebar.classList.add('active')
        overlay.classList.add('active')
    })

    overlay.addEventListener('click', ()=>{
        sidebar.classList.remove('active')
        overlay.classList.remove('active')
    })

    /* RETIRAR MENU LATERAL E FUNDO ESCURECIDO */
    const navLinks = document.querySelectorAll('aside nav a')


    navLinks.forEach(link=>{
        link.addEventListener('click', ()=>{
            sidebar.classList.remove('active')
            overlay.classList.remove('active')
        })
    })



    /* CARREGAR NOME DO PRODUTO NO TÍTULO DA PÁGINA ATUAL */
    headerTitle.textContent = title

    /* ALTERAR LEGENDA "MÍNIMO: X" AO ALTERAR QUANTIDADE */
    let currentStep = 0

    const updateOverallMinDisplay = ()=>{
        let totalSelectedItems = 0
        document.querySelectorAll('#flavors-list .item .quantity span')
            .forEach(span=>{
                totalSelectedItems += parseInt(span.textContent)
        })
        
        const currentStepData = productsData[title].steps[currentStep]
        let displayMin = currentStepData.min
        
        if(currentStep === 0){
            if(totalSelectedItems === 0){
                displayMin = 1
            }else if(totalSelectedItems >= 1){
                displayMin = Math.min(totalSelectedItems, currentStepData.max)
            }
        }else{
            displayMin = Math.min(totalSelectedItems, currentStepData.max)

            if(totalSelectedItems === 0){
                displayMin = 0
            }
        }

        document.getElementById('min-max-container')
            .innerHTML = `<span>Mínimo: ${displayMin}</span><span>Máximo: ${currentStepData.max}</span>`
    }

    /* ALTERAR QUANTIDADE */
    const updateQuantity = (btn, itemMaxLimit)=>{
        const span = btn.parentElement.querySelector('span')
        let value = parseInt(span.textContent)
        const currentStepData = productsData[title].steps[currentStep]

        if(btn.textContent === '+'){
            let totalSelectedItems = 0
            document.querySelectorAll('#flavors-list .item .quantity span').forEach(span=>{
                totalSelectedItems += parseInt(span.textContent)
            })

            if(value < itemMaxLimit && totalSelectedItems < currentStepData.max){
                span.textContent = value + 1
                updateOverallMinDisplay()
            }else if(totalSelectedItems >= currentStepData.max){
                popupAlert.textContent = `A quantidade máxima são ${currentStepData.max} sabores adicionais por pedido`
                popupAlert.classList.add('active')
                setTimeout(() => popupAlert.classList.remove('active'), 3000)
            }else if(value >= itemMaxLimit){
                popupAlert.textContent = `Você pode selecionar no máximo ${itemMaxLimit} de cada sabor`
                popupAlert.classList.add('active')
                setTimeout(() => popupAlert.classList.remove('active'), 3000)
            }
        }else if(btn.textContent === '-'){
            if(value > 0){
                span.textContent = value - 1
                updateOverallMinDisplay()
            }
        }

        addToCart()
    }

    /* RENDERIZAR ETAPAS */
    const stepRender = (productName)=>{
        headerTitle.textContent = productName
        const product = productsData[productName]
        if(!product || !product.steps){
            console.error(`Dados ou etapas do produto ${productName} não foram encontradas!`)
            return
        }

        const step = product.steps[currentStep]
        
        if(!step) return

        document.getElementById('subtitle').textContent = step.subtitle
        document.getElementById('min-max-container').innerHTML = `<span>Mínimo: ${step.min}</span><span>Máximo: ${step.max}</span>`
        document.getElementById('additional-value').textContent = `Valor adicional: R$ ${step.additionalValue.toFixed(2)}`

        const list = document.getElementById('flavors-list')
        list.innerHTML = ''

        step.items.forEach(item=>{
            const price = item.price ?? ''
            const onlyNumbers = price.replace(/\D/g, '')
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
                    <span>0</span>
                    <button class='plus'>+</button>
                </div>
            `
            list.appendChild(div)

            const minusBtn = div.querySelector('.minus')
            const plusBtn = div.querySelector('.plus')
            const itemSpecificMax = item.max_quantity !== undefined ? item.max_quantity : 10

            minusBtn.addEventListener('click', () => updateQuantity(minusBtn, itemSpecificMax))
            plusBtn.addEventListener('click', () => updateQuantity(plusBtn, itemSpecificMax))
        })
    }

    /* INICIALIZAR ETAPAS */
    stepRender(title)

    /* RENDERIZAR ETAPAS PELO SUBMENU */
    arraySubmenu.forEach(sub=>{
        sub.addEventListener('click', ()=>{
            const title = sub.textContent.trim().toUpperCase()
            stepRender(title)
            sidebar.classList.remove('active')
            overlay.classList.remove('active')
        })
    })

    /* VOLTAR À PÁGINA PRINCIPAL E REGRESSAR OS PASSOS DA PÁGINA ATUAL*/
    secondStep.textContent = `${currentStep + 1}/${productsData[title].steps.length}`

    turnBackBtn.addEventListener('click', ()=>{
        if(currentStep === 0) window.history.back()
        if(currentStep > 0){
            currentStep--
            stepRender(title)
            secondStep.textContent = `${currentStep + 1}/${productsData[title].steps.length}`
        }

        if(currentStep < 2) thirdStep.style.backgroundColor = ''
        if(currentStep < 1) secondStep.style.backgroundColor = ''
    })

    /* ADICIONAR AO CARRINHO */
    const cartData = {
        flavors: [],
        additionalTotal: 0
    }

    const addToCart = ()=>{
        /* const selectedFlavors = []
        let additionalCount = 0
        let baseValue = Number(price.replace(/\D/g, '') / 100).toFixed(2) */
        const listItems = document.querySelectorAll('#flavors-list .item')
        const currentStepData = productsData[title].steps[currentStep]


        listItems.forEach(listItem=>{
            const nameDiv = listItem.querySelector('.flavor > div')
            const countSpan = listItem.querySelector('.quantity span')
            const name = nameDiv?.textContent?.trim()
            const quantity = parseInt(countSpan?.textContent || '0')
            
            if(quantity > 0){
                const itemData = currentStepData.items.find(i => i.flavor === name)
                if(!itemData) return

                const hasAdicional = itemData.price?.includes('+ R$')
                let unitaryAdditional = 0

                const existingFlavor = cartData.flavors.find(f => f.flavor === name)
                if(!existingFlavor){
                    cartData.flavors.push({
                        flavor: name,
                        quantity
                    })

                    if(hasAdicional && itemData.price){
                        unitaryAdditional = Number(itemData.price?.replace(/\D/g, '') / 100)
                        cartData.additionalTotal += quantity * unitaryAdditional
                    }
                }else{
                    existingFlavor.quantity += quantity
                }
            }
        })
        console.log('Estapa atual: ', currentStep)
        console.log('Carrinho parcial: ', cartData)
    }

    addToCart()
    
    /* AÇÃO DO BOTÃO CONTINUAR */
    document.getElementById('continue').addEventListener('click', ()=>{
        const currentStepData = productsData[title].steps[currentStep]
        let totalSelectedItems = 0

        document.querySelectorAll('#flavors-list .item .quantity span').forEach(span=>{
            totalSelectedItems += parseInt(span.textContent)
        })
        
        if(totalSelectedItems < currentStepData.min){
            popupAlert.textContent = `É preciso selecionar no mínimo ${currentStepData.min} item, por favor`
            popupAlert.classList.add('active')

            setTimeout(()=>{
                popupAlert.classList.remove('active')
            }, 5000)

            return
        }

        if(totalSelectedItems > currentStepData.max){
            popupAlert.textContent = `Você pode selecionar no máximo ${currentStepData.max} item(s)`
            popupAlert.classList.add('active')

            setTimeout(() => {
                popupAlert.classList.remove('active')
            }, 5000);
        }

        const steps = productsData[title].steps
        
        if(currentStep < steps.length - 1){
            currentStep++
            stepRender(title)
            secondStep.textContent = `${currentStep + 1}/${productsData[title].steps.length}`

            if(currentStep === 1){
                secondStep.style.backgroundColor = 'red'
            }

            if(currentStep === 2){
                thirdStep.style.backgroundColor = 'red'
            }
        }else{
            window.location.href = '../carrinho/index.html'
        }
    })
})
