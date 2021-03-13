const menuLateral = document.getElementById('menulateral')
const telaNoticia = document.getElementById('content')
const botaoCadastroOpen = document.getElementById('side1')
const botaoCadastroClose = document.getElementById('side2')
botaoCadastroOpen.addEventListener('click',()=>{
    menuLateral.style.display = 'block';
});
botaoCadastroClose.addEventListener('click',()=>{
    menuLateral.style.display = 'none';
});

const closeFeed = document.getElementById('closeFeed')
closeFeed.addEventListener('click',()=>{
    document.getElementById('paginaCadastro').style.display = 'none';
});
const addRss = document.getElementById("addRss")
const enviarDados = async (e) => {
    e.preventDefault();
    var formJson =  convertFDtoJSON(new FormData(addRss))
    console.log(formJson)
    var header = new Headers({'Content-Type': 'application/json'})
    var myInit = {method: 'POST',
    headers: header,
    body: formJson}

    fetch('/rss/add',myInit).then((response) =>{
        if(!response.ok){
            alert("Erro ao realizar cadastro")
        }
        else
            alert('Feed adicionado com sucesso')
    })
 }
addRss.addEventListener('submit',enviarDados)
function convertFDtoJSON(formData){
var obj = {}
for(let key of formData.keys()){
if (key == 'tags'){
    obj[key] = formData.get(key).split(',')
    continue
}
obj[key] = formData.get(key)
}
return JSON.stringify(obj)
}