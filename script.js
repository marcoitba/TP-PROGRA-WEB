let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

document.addEventListener("DOMContentLoaded", function () {

    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    actualizarCantidadCarrito();

    if (document.querySelector("#listaCarrito")) {
        mostrarCarrito();
    }
    document.querySelectorAll(".btnAgregar").forEach(function (boton) {
        boton.addEventListener("click", agregarAlCarrito);
    });

    const btnSuscribir = document.getElementById("btnSuscribir");
    if (btnSuscribir) {
        btnSuscribir.addEventListener("click", validarEmail);
    }

    const btnCompra = document.getElementById("btnCompra");
    if (btnCompra) {
        btnCompra.addEventListener("click", compraCarrito);
    }
});

function agregarAlCarrito(e) {
    e.preventDefault();

    const nombre = this.getAttribute("data-producto");
    const precio = this.getAttribute("data-precio");

    if (!nombre || !precio) {
        alert("Faltan datos del producto.");
        return;
    }

    const cardBody = this.closest(".card-body");
    const talleSelect = cardBody.querySelector(".talle-select");
    const cantidadInput = cardBody.querySelector(".cantidad-input");
    const talle = talleSelect ? talleSelect.value : null;
    const cantidad = cantidadInput ? parseInt(cantidadInput.value) : 1;

    if (isNaN(cantidad) || cantidad < 1) {
        alert("La cantidad debe ser un número mayor o igual a 1.");
        return;
    }

    const item = { nombre, precio, talle, cantidad };
    carrito.push(item);

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCantidadCarrito();

    alert(nombre + " ¡Agregado al carrito!");
    mostrarCarrito();
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    actualizarCantidadCarrito();
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

function mostrarCarrito() {
    const lista = document.querySelector("#listaCarrito");
    const botonesCarrito = document.getElementById("botonesCarrito");
    if (!lista) return;
    lista.innerHTML = "";

    if (carrito.length === 0) {
        if (botonesCarrito) botonesCarrito.style.display = "none";
        mostrarTotal();
        return;
    }

    carrito.forEach(function (item, index) {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center flex-column";

        li.innerHTML = `
            <div class="d-flex justify-content-between w-100 align-items-center">
                <div>
                    <strong>${item.nombre}</strong><br>
                    <small class="text-muted">$${item.precio}</small>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-secondary btn-sm editar-btn">Editar</button>
                    <button class="btn btn-danger btn-sm eliminar-btn">Eliminar</button>
                </div>
            </div>

            <div class="mt-2 d-flex gap-3 align-items-center detalles">
                ${item.talle ? `<div><strong>Talle:</strong> <span class="talle-text">${item.talle}</span></div>` : ''}
                <div><strong>Cantidad:</strong> <span class="cantidad-text">${item.cantidad}</span></div>
            </div>
        `;

        li.querySelector(".eliminar-btn").addEventListener("click", function () {
            eliminarItem(index);
        });

        li.querySelector(".editar-btn").addEventListener("click", function () {
            const detalles = li.querySelector(".detalles");
            const botonEditar = this;

            const esEditando = botonEditar.textContent === "Guardar";

            if (esEditando) {
                const cantidadInput = li.querySelector(".cantidad-input");
                const talleSelect = li.querySelector(".talle-select");
                const nuevoTalle = talleSelect ? talleSelect.value : null;
                const nuevaCantidad = parseInt(cantidadInput.value);

                if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
                    alert("Cantidad inválida.");
                    cantidadInput.value = carrito[index].cantidad;
                    return;
                }

                carrito[index].cantidad = nuevaCantidad;
                if (nuevoTalle !== null) {
                    carrito[index].talle = nuevoTalle;
                }

                localStorage.setItem("carrito", JSON.stringify(carrito));
                actualizarCantidadCarrito();
                mostrarTotal();

                detalles.innerHTML = `
                    ${carrito[index].talle ? `<div><strong>Talle:</strong> <span class="talle-text">${carrito[index].talle}</span></div>` : ''}
                    <div><strong>Cantidad:</strong> <span class="cantidad-text">${carrito[index].cantidad}</span></div>
                `;
                botonEditar.textContent = "Editar";
            } else {
                detalles.innerHTML = `
                    ${item.talle ? `
                    <label>
                        Talle:
                        <select class="form-select form-select-sm talle-select">
                            <option value="S" ${item.talle === "S" ? "selected" : ""}>S</option>
                            <option value="M" ${item.talle === "M" ? "selected" : ""}>M</option>
                            <option value="L" ${item.talle === "L" ? "selected" : ""}>L</option>
                            <option value="XL" ${item.talle === "XL" ? "selected" : ""}>XL</option>
                        </select>
                    </label>
                    ` : ''}

                    <label>
                        Cantidad:
                        <input type="number" min="1" class="form-control form-control-sm cantidad-input" value="${item.cantidad}" style="width: 70px;">
                    </label>
                `;
                botonEditar.textContent = "Guardar";
            }
        });

        lista.appendChild(li);
    });

    if (botonesCarrito) botonesCarrito.style.display = "block";
    mostrarTotal();
}

function mostrarTotal() {
    const totalDiv = document.getElementById("totalCarrito");
    if (!totalDiv) return;

    let total = carrito.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad), 0);
    totalDiv.textContent = `Total: $${total}`;
}

function actualizarCantidadCarrito() {
    const cantidadCarro = document.getElementById("carritoCantidad");
    if (cantidadCarro) {
        const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        cantidadCarro.textContent = totalCantidad;
    } else {
        console.warn("⚠ No se encontró el elemento con id carritoCantidad");
    }
}

function validarEmail() {
    const email = document.getElementById("emailInput").value.trim();

    if (email.includes("@")) {
        alert("Gracias por suscribirse");
        document.getElementById("emailInput").value = '';
    } else {
        alert("Por favor, ingrese un correo válido.");
    }
}

function compraCarrito() {
    alert("Muchas gracias por su compra.");

    carrito = [];
    localStorage.removeItem("carrito");
    actualizarCantidadCarrito();
    mostrarCarrito();
}
