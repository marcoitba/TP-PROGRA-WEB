let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

document.querySelectorAll(".btnAgregar").forEach(function(boton,index){
    boton.addEventListener("click",function(e){
        e.preventDefault();

        const nombre=this.getAttribute("data-producto");
        const precio=this.getAttribute("data-precio");

        if (!nombre || !precio) {
            alert("Faltan datos del producto.");
            return;
        }

        const cardBody=this.closest(".card-body");
        const talleSelect=cardBody.querySelector(".talle-select");
        const cantidadInput = cardBody.querySelector(".cantidad-input");
        const talle = talleSelect ? talleSelect.value : null;
        const cantidad = cantidadInput ? parseInt(cantidadInput.value) : 1;



        const item = { nombre, precio, talle, cantidad };
        carrito.push(item);
        actualizarCantidadCarrito();

        localStorage.setItem("carrito", JSON.stringify(carrito));
        alert(nombre + " agregado al carrito!");

        mostrarCarrito();
    })
})

function eliminarItem(index){
    carrito.splice(index,1);
    actualizarCantidadCarrito();
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

function mostrarCarrito(){
    const lista = document.querySelector("#listaCarrito");
    if (!lista) return;
    lista.innerHTML = "";

    carrito.forEach(function(item, index) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
        <div>
        <strong>${item.nombre}</strong><br>
        <small class="text-muted">$${item.precio}</small>
        <small class="text-muted">Talle: ${item.talle}</small><br>
                <small class="text-muted">Cantidad: ${item.cantidad}</small><br>
        </div>
        <button class="btn btn-sm btn-danger" onclick="eliminarItem(${index})">Eliminar</button>
    `;

    lista.appendChild(li);
    });

    mostrarTotal();
}

function mostrarTotal(){
    const totalDiv = document.getElementById("totalCarrito");
    if (!totalDiv) return;

    let total = carrito.reduce((acc, item) => acc + (parseFloat(item.precio)* item.cantidad), 0);
    totalDiv.textContent = `Total: $${total}`;
}

function actualizarCantidadCarrito() {
    const cantidadCarro = document.getElementById("carritoCantidad");
    if (cantidadCarro) {
        cantidadCarro.textContent = carrito.length;
    }
}   




document.addEventListener("DOMContentLoaded", function() {
    mostrarCarrito();
    actualizarCantidadCarrito();
}); 