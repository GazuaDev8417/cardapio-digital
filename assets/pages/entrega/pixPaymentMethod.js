const cart = JSON.parse(localStorage.getItem('data'))
const qrCodeContainer = document.getElementById('qr-code-container')


const getCart = ()=>{
    const total = cart.reduce((acc, currentItem)=>{
    let subtotal = 0
    subtotal += Number(currentItem.product.total)

    if(currentItem.items && currentItem.items.length > 0){
        subtotal += currentItem.items.reduce(
        (itemsAcc, item) => itemsAcc + Number(item.total), 0
        )
    }
    return acc + subtotal
    }, 0)

    return total
}

const getRequestItems = ()=>{
    const requestItems = []
    cart.forEach(item=>{
        requestItems.push({
            title: item.product.product,
            quantity: item.product.quantity,
            unit_price: Number(item.product.price)
        })

        if(item.items && item.items.length > 0){
        item.items.forEach(subItem=>{
            requestItems.push({
                title: subItem.flavor || 'Item Adicional',
                quantity: subItem.quantity,
                unit_price: Number(subItem.price)
            })
        })
        }
    })

    return requestItems
}

const copiarTexto = ()=>{
    const copyArea = qrCodeContainer.querySelector('.copy-paste')
    const textToCopy = copyArea.textContent

    navigator.clipboard.writeText(textToCopy)
    .then(() => window.alert('Copiado para área de transferência'))
    .catch(e =>{
        console.error('Erro ao copiar código: ', e)
        window.alert('Erro ao copiar código. Tente novamente.')
    })
}