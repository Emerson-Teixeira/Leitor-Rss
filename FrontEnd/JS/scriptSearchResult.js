
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

document.title = "Jrss Reader | Search"
const select = document.getElementById('selectSearch')
const formSearch = document.getElementById('searchForm')

select.addEventListener('change',(e)=>{
        formSearch.setAttribute('action',`/search/${select.value}`)
})