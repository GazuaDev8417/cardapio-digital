document.addEventListener('DOMContentLoaded', ()=>{
    const cartData = localStorage.getItem('cart')
    console.log(JSON.parse(cartData))
    
})
