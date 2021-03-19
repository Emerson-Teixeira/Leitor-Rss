 //logica Tela principal 
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
var loadFeed =  async() => {
    var url = window.location.href.split('/')
    var feed = await fetch(`http://localhost:3000/rss/get/${url[4]}`,{method:'get'}).then(resp =>{
        if(!resp.ok){
            alert('Nao foi possivel obter o feed')
        }
        else{
            return resp.text().then(txt => txt)
        }
    } )
    var parser = new DOMParser();
    var xmlFeed = await parser.parseFromString(feed,'application/xml')
    var array = xmlFeed.getElementsByTagName('item')
   Array.from(array).forEach(element => construirNoticia(element))
}
function construirNoticia(element){
    var article = document.createElement('article')
    var titleArticle = document.createElement('a')
    var creator = document.createElement('span')
    var dataPublish = document.createElement('span')
    var text = document.createElement('section')
    var description = document.createElement('div')
    text.setAttribute('class','textFormat')
    titleArticle.setAttribute('class','truncate tituloNoticia')


    dataPublish.innerHTML = (element.getElementsByTagName("pubDate").length != 0 ?(element.getElementsByTagName("pubDate")[0].childNodes[0].nodeValue):null)
    text.innerHTML = (element.getElementsByTagName("content:encoded").length != 0 ?(element.getElementsByTagName("content:encoded")[0].childNodes[0].nodeValue):null)
    titleArticle.innerHTML = (element.getElementsByTagName("title").length != 0 ? (element.getElementsByTagName("title")[0].childNodes[0].nodeValue):null)
    creator.innerHTML = (element.getElementsByTagName("dc:creator").length != 0 ? ("Escrito por: "  +element.getElementsByTagName("dc:creator")[0].childNodes[0].nodeValue):null)
    titleArticle.href =  (element.getElementsByTagName("link").length != 0?(element.getElementsByTagName("link")[0].childNodes[0].nodeValue):null)
   description.innerHTML = (element.getElementsByTagName("description").length != 0?(element.getElementsByTagName("description")[0].childNodes[0].nodeValue):null)
   
    article.appendChild(titleArticle)
    article.appendChild(creator)
    if (!text.innerHTML){
        article.appendChild(description)
    }
    article.appendChild(text)
    article.appendChild(dataPublish)
    article.setAttribute('class','news')
    document.getElementById('content').appendChild(article)
}

document.body.onload = loadFeed