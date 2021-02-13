//logica Tela Cadastro 
const cadastro = document.getElementById('paginaCadastro');
const
const botaoCadastroOpen = document.getElementById('activeCadastro')
const botaoCadastroClose = document.getElementById('closeCadastro')
botaoCadastroOpen.addEventListener('click',()=>{
    cadastro.style.display = 'flex';
    document.body.style.overflow = 'hidden'
});
botaoCadastroClose.addEventListener('click',()=>{
    cadastro.style.display = 'none';
    document.body.style.overflow = 'initial'
});


