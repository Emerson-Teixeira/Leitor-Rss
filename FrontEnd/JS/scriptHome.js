const cadastro = document.getElementById('menulateral')
const telaNoticia = document.getElementById('content')
const botaoCadastroOpen = document.getElementById('side1')
const botaoCadastroClose = document.getElementById('side2')
botaoCadastroOpen.addEventListener('click',()=>{
    cadastro.style.display = 'block';
});
botaoCadastroClose.addEventListener('click',()=>{
    cadastro.style.display = 'none';
});