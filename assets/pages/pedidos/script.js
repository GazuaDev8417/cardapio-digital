document.addEventListener('DOMContentLoaded', ()=>{
    const turnBackBtn = document.querySelector('.back')
    const secondStep = document.querySelector('.second-step')
    const thirdStep = document.querySelector('.third-step')
    const headerTitle = document.querySelector('.header-title')
    const params = new URLSearchParams(window.location.search)
    const title = params.get('title').toUpperCase()
    const openMenu = document.getElementById('menuIcon')
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')
    const submenuItems = document.querySelectorAll('.submenu li')
    const arraySubmenu = Array.from(submenuItems)

    
    
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

    /* ALTERAR QUANTIDADE */
    let minCount = 0

    const updateQuantity = (btn)=>{
        const container = document.getElementById('min-max-container')
        const min = container.querySelector('span')
        
        const span = btn.parentElement.querySelector('span')
        let value = parseInt(span.textContent)

        
        if(btn.textContent === '+' && minCount < 2){
            minCount++
            span.textContent = value + 1
        }else if(btn.textContent === '-' && minCount > 0){
            minCount--
            span.textContent = value - 1
        }        

        min.textContent = `Mínimo: ${minCount > 0 ? minCount : 1}`
    }

    /* RENDERIZAR ETAPAS */
    let currentStep = 0

    const stepRender = (productName)=>{
        headerTitle.textContent = productName
        const product = productsData[productName] 
        console.log(product)
        const step = product.steps[currentStep]
        
        if(!step) return

        document.getElementById('subtitle').textContent = step.subtitle
        document.getElementById('min-max-container').innerHTML = `<span>Mínimo: ${step.min}</span><span>Máximo: ${step.max}</span>`
        document.getElementById('additional-value').textContent = `Valor adicional: R$ ${step.additionalValue.toFixed(2)}`

        const list = document.getElementById('flavors-list')
        list.innerHTML = ''

        step.items.forEach(item=>{
            const price = item.price ? `+ ${item.price.toFixed(2)} ` : ''
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

            minusBtn.addEventListener('click', () => updateQuantity(minusBtn))
            plusBtn.addEventListener('click', () => updateQuantity(plusBtn))
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

    /* AÇÃO DO BOTÃO CONTINUAR */
    document.getElementById('continue').addEventListener('click', ()=>{
        const popupAlert = document.querySelector('.popup-alert')
        if(minCount === 0){
            popupAlert.classList.add('active')
            
            setTimeout(()=>{
                popupAlert.classList.remove('active')
            }, 5000)

            return
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
        }
    })
})
