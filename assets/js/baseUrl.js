//const BASE_URL = 'https://max-menu-server.vercel.app'
const BASE_URL = 'http://10.23.1.19:3003'




/* FUNÇÕES */
const getProfile = async()=>{
    try{
        const res = await fetch(`${BASE_URL}/user`, {
            headers: { 'Authorization': token }
        })

        if(!res.ok){
            const error = await res.text()
            throw new Error(`Erro ao buscar dados do cliente: ${error}`)
        }

        return await res.json()
    }catch(e){
        console.error(e)
    }
}

/* function formatPhone(input) {
  let digits = input.value.replace(/\D/g, ''); // só números
  
  // Aplica a máscara de acordo com a quantidade de dígitos
  let formatted = '';

  if (digits.length <= 2) {
    formatted = digits; // ainda digitando DDD
  } else if (digits.length <= 7) {
    formatted = `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  } else if (digits.length <= 11) {
    formatted = `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  } else {
    formatted = `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`; // limite
  }

  input.value = formatted;
} */

