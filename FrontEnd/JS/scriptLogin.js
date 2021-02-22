//logica Tela Cadastro 
const cadastro = document.getElementById('paginaCadastro');
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

// requisiçao cadastro
const formCadastro = document.getElementById("formCadastro")
const enviarDados = async (e) => {
    e.preventDefault();

    var formJson =  convertFDtoJSON(new FormData(formCadastro))
    var header = new Headers({'Content-Type': 'application/json'})
    var myInit = {method: 'POST',
    headers: header,
    body: formJson}

    fetch('/entrar/cadastro',myInit).then((response) =>{
        if(!response.ok){
            alert("Erro ao realizar cadastro")
        }
        else
        response.text().then(response => alert(response))
    })
}
formCadastro.addEventListener('submit',enviarDados)

//requisicao login
const formLogin = document.getElementById("formLogin")
const verificarDados = async (e) => {
    e.preventDefault();
    var formJson =  convertFDtoJSON(new FormData(formLogin))
    console.log(formJson)
    var header = new Headers({'Content-Type': 'application/json'})
    var myInit = {method: 'POST',
    headers: header,
    body: formJson}

    fetch('/entrar/login',myInit).then((response) =>{
        if(!response.ok){
            alert('Erro ao fazer login')
        }
        else
        response.text().then(response => alert(response))
    })
}
formLogin.addEventListener('submit',verificarDados)



//funcao para converter FormData to json
function convertFDtoJSON(formData){
    let obj = {}
    for(let key of formData.keys()){
        obj[key] = formData.get(key)
    }
    return JSON.stringify(obj)
}