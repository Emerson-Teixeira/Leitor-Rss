//logica Tela Cadastro 
const cadastro = document.getElementById('paginaCadastro');
const botaoCadastroOpen = document.getElementById('activeCadastro')
const botaoCadastroClose = document.getElementById('closeCadastro')
const token = null
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

    fetch('/entrar/cadastro',myInit).then(async (response) =>{
        var msg =  await response.json().then(jsn => jsn)
        alert(msg.message)
        if(response.ok){
            cadastro.style.display = 'none';
            document.body.style.overflow = 'initial'
        }
    })
}
formCadastro.addEventListener('submit',enviarDados)

//requisicao login
const formLogin = document.getElementById("formLogin")
const verificarDados = async (e) => {
    e.preventDefault();
    var formJson =  convertFDtoJSON(new FormData(formLogin))
    var header = new Headers({'Content-Type': 'application/json'})
    var myInit = {method: 'POST',
    headers: header,
    body: formJson}

    fetch('/entrar/login',myInit).then(async (response) =>{
        if(!response.ok){
            var msg =  await response.json().then(jsn => jsn)
            alert(msg.message)
        }
        else
        document.location.assign('/home')
    })
}
formLogin.addEventListener('submit',verificarDados)

//funcao para converter FormData to json
function convertFDtoJSON(formData){
    var obj = {}
    for(let key of formData.keys()){
        obj[key] = formData.get(key)
    }
    return JSON.stringify(obj)
}

//google Tutorial
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var obj = {id_token}
    obj = JSON.stringify(obj)
    console.log(obj)
    var header = new Headers({'Content-Type': 'application/json'})
    var myInit = {method: 'POST',
    headers: header,
    body: obj}

    fetch('/entrar/SignGoogle',myInit).then(async (response) =>{
        if(response.ok){
            document.location.assign('/home')
        }
        else{
            var msg =  await response.json().then(jsn => jsn)
            alert(msg.message)
            signOut()
            
        }
    })
  }
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    fetch("/logout").then((resp)=>{
        if(resp.ok){
        }
        else{
            alert("Não foi possivel fazer o Logout")
        }
    })
}