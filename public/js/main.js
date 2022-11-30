const socket = io.connect();

socket.on("productos", listaProductos => {
    loadProds(listaProductos)
});

async function loadProds(listProd) {
    let htmlProd = ''
    const tableList = await fetch('views/partials/table.ejs').then(res => res.text())
    if (listProd.length === 0){
        htmlProd = `<h4>No se encontraron productos.</h4>`
    }else{
        htmlProd = ejs.render(tableList, {listProd})
    }

    document.getElementById('tabla').innerHTML = htmlProd; 
}

document.getElementById('btn').addEventListener('click', (e) => {

    const nuevoProducto = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    }
socket.emit("guardarNuevoProducto",nuevoProducto)
})

socket.on('messages', function(data) { render(data); });

function render(data) {
    const html = data.map((elem, index) => {
        return(`<div>
            <strong style="color:blue">${elem.email}</strong>:
            <p>${elem.date}<p>
            <i style="color:green">${elem.textoMensaje}</i> </div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}

document.getElementById('formChat').addEventListener('submit', (e) => {
    e.preventDefault()
    agregarMensaje()
})

function agregarMensaje() {
    const nuevoMensaje = {
        email: document.getElementById('email').value,
        textoMensaje: document.getElementById('textoMensaje').value
    }
    socket.emit("messegesNew",nuevoMensaje)
}
