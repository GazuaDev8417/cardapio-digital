/* BUSCA SABORES DOS PRODUTOS */
const fetchDataProducts = async()=>{
    const res = await fetch(`${BASE_URL}/clients/orders`, {
      headers: {
        'Content-type': 'application/json',
        'Authorization': `${token}`
      },
      credentials: 'include'
    })

    if(!res.ok){
      const error = await res.text()
      /* if(error.includes('Seu carrinho ainda está vazio')){
        localStorage.setItem('noProducts', error)
      } */
      throw new Error(error)
    }
    
    return await res.json()
}
