const turnBackBtn = document.querySelector('.back')
const params = new URLSearchParams(window.location.search)
const title = params.get('title')
const headerTitle = document.querySelector('.header-title')



turnBackBtn.addEventListener('click', ()=>{
    window.location.href = '../../../index.html'
})

document.addEventListener('DOMContentLoaded', ()=>{
    headerTitle.textContent = title
})

