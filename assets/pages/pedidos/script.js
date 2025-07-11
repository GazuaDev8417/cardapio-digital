document.addEventListener('DOMContentLoaded', ()=>{
    const turnBackBtn = document.querySelector('.back')
    const secondStep = document.querySelector('.second-step')
    const thirdStep = document.querySelector('.third-step')
    const headerTitle = document.querySelector('.header-title')
    const params = new URLSearchParams(window.location.search)
    const title = params.get('title')



    /* CARREGAR NOME DO PRODUTO NO TÍTULO DA PÁGINA ATUAL */
    headerTitle.textContent = title

    /* RENDERIZAR ETAPAS */
    let currentStep = 0

    const stepRender = ()=>{
        const product = productsData[title] 
        const step = product.steps[currentStep]
        
        if(!step) return

        document.getElementById('subtitle').textContent = step.subtitile
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
                    <button>-</button>
                    <span>0</span>
                    <button>+</button>
                </div>
            `
            list.appendChild(div)
        })
    }

    /* INICIALIZAR ETAPAS */
    stepRender()

    /* VOLTAR À PÁGINA PRINCIPAL E REGRESSAR OS PASSOS DA PÁGINA ATUAL*/
    secondStep.textContent = `${currentStep + 1}/${productsData[title].steps.length}`

    turnBackBtn.addEventListener('click', ()=>{
        if(currentStep === 0) window.history.back()
        if(currentStep > 0){
            currentStep--
            stepRender()
            secondStep.textContent = `${currentStep + 1}/${productsData[title].steps.length}`
        }

        if(currentStep < 2) thirdStep.style.backgroundColor = ''
        if(currentStep < 1) secondStep.style.backgroundColor = ''
    })

    /* AÇÃO DO BOTÃO CONTINUAR */
    document.getElementById('continue').addEventListener('click', ()=>{
        const steps = productsData[title].steps
        
        if(currentStep < steps.length - 1){
            currentStep++
            stepRender()
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
