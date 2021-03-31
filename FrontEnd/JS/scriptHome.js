
const createFeed = document.getElementById('createFeed')
createFeed.addEventListener('click',()=>{
    document.getElementById('paginaCadastro').style.display = 'flex';
    document.body.style.overflow = 'hidden'
})
const closeFeed = document.getElementById('closeFeed')
closeFeed.addEventListener('click',()=>{
    document.getElementById('paginaCadastro').style.display = 'none';
    document.body.style.overflow = 'initial'
});
const addRss = document.getElementById("addRss")
function criarElemento(formJson){
    var h1 = document.createElement('h1')
    h1.setAttribute('class','truncate')
    var h2 = document.createElement('h2')
    h2.setAttribute('class','linkRss truncate')
    var span = document.createElement('span')
    span.setAttribute('class','tags truncate')
    var button = document.createElement('button')
    button.setAttribute('class','deleteFeed')
    h1.appendChild(document.createTextNode(`Titulo: ${formJson.nome}`))
    h2.appendChild(document.createTextNode(`Link do feed: ${formJson.url}`))
    span.innerHTML = `<strong>Tags: </strong> ${formJson.tags}`
    button.appendChild(document.createTextNode(`Excluir Feed`))
    var div = document.createElement('div')
    div.appendChild(h1)
    div.appendChild(h2)
    div.appendChild(span)
    div.appendChild(button)
    div.setAttribute('class','rssOp contentRequest')
    div.setAttribute('data-id',formJson._id)
    div.addEventListener('click',fazerRequisicao)
    document.getElementById("content").appendChild(div)
}
const enviarDados = async (e) => {
    e.preventDefault();
    var formJson =  convertFDtoJSON(new FormData(addRss))
    console.log(formJson)
    var header = new Headers({'Content-Type': 'application/json'})
    var myInit = {method: 'POST',
    headers: header,
    body: formJson}
    document.getElementById('submitFeedButton').setAttribute('disabled','true')
    await fetch('/rss/add',myInit).then(async(response) =>{
        if(!response.ok){
            alert("Erro ao realizar cadastro")
        }
        else{
            var jsonCria = await response.json()
            criarElemento(jsonCria)
            alert('Feed adicionado com sucesso')
        }
    })
    document.getElementById('submitFeedButton').removeAttribute('disabled')
 }
addRss.addEventListener('submit', enviarDados)
function convertFDtoJSON(formData){
var obj = {}
for(let key of formData.keys()){
if (key == 'tags'){
    var allTags = formData.get(key).replace(/ /g,'').split(',')
    var allTagsMin = allTags.map( p => p.toLowerCase())
    obj[key] = allTagsMin.filter((keyTemp,index)=>{
        return allTagsMin.indexOf(keyTemp) === index
    })
    continue
}
obj[key] = formData.get(key)
}
return JSON.stringify(obj)
}
var fazerRequisicao = (e) => {
    e.preventDefault()
    var obj = e.target
    if(obj.tagName != 'DIV'){
        id = obj.parentElement.getAttribute("data-id")
        if(obj.tagName == 'BUTTON'){
            fetch(`/rss/remove/${id}`,{method: "DELETE"}).then((response) =>{
                if(!response.ok){
                    alert("Erro ao remover Feed")
                }
                else
                    obj.parentElement.remove()
            })
        }
        else{
            window.location.href = `/feed/${id}`
        }
    }
    else{
         id = obj.getAttribute("data-id")
         window.location.href = `/feed/${id}`
    }
    
}
document.querySelectorAll('.contentRequest').forEach( (item)=>{
    item.addEventListener('click',fazerRequisicao)
})
document.title = "Jrss Reader | Home"

const select = document.getElementById('selectSearch')
const formSearch = document.getElementById('searchForm')

select.addEventListener('change',(e)=>{
        formSearch.setAttribute('action',`/search/${select.value}`)
})