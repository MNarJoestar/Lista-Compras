const listaCompras = JSON.parse(localStorage.getItem('listaCompras')) || {};

 

  function agregarElemento(seccion) {

    // Obtener los valores ingresados

    const inputElement = document.getElementById(`${seccion.toLowerCase()}Input`);

    const precioElement = document.getElementById(`${seccion.toLowerCase()}Precio`);

    const cantidadElement = document.getElementById(`${seccion.toLowerCase()}Cantidad`);

 

    const elemento = inputElement.value;

    const precio = parseFloat(precioElement.value);

    const cantidad = parseFloat(cantidadElement.value);

 

    if (elemento && !isNaN(precio) && !isNaN(cantidad)) {

      if (!listaCompras[seccion]) {

        listaCompras[seccion] = [];

      }

      listaCompras[seccion].push({

        elemento,

        precio,

        cantidad

      });

      inputElement.value = '';

      precioElement.value = '';

      cantidadElement.value = '';

      guardarLista();

      mostrarLista();

    }

  }

 

  function eliminarElemento(seccion, index) {

    listaCompras[seccion].splice(index, 1);

    guardarLista();

    mostrarLista();

  }

 

  function mostrarLista() {

    const listaDiv = document.getElementById('listaCompras');

    listaDiv.innerHTML = '';

 

    let precioTotal = 0;

 

    for (const seccion in listaCompras) {

      listaDiv.innerHTML += `<h3>${seccion}:</h3>`;

      for (let i = 0; i < listaCompras[seccion].length; i++) {

        const {

          elemento,

          precio,

          cantidad

        } = listaCompras[seccion][i];

        const subtotal = precio * cantidad;

        listaDiv.innerHTML += `<p>${elemento} (${cantidad} items) x ${precio}: $${subtotal.toFixed(2)} <button onclick="eliminarElemento('${seccion}', ${i})">Ya no</button></p>`;

        precioTotal += subtotal;

      }

    }

 

    const precioTotalElement = document.getElementById('precioTotal');

    precioTotalElement.textContent = `Precio total: $${precioTotal.toFixed(2)}`;

  }

 

  function guardarLista() {

    localStorage.setItem('listaCompras', JSON.stringify(listaCompras));

  }

 

  // Función para vaciar la lista

  function vaciarLista() {

    for (const seccion in listaCompras) {

      listaCompras[seccion] = [];

    }

    guardarLista();

    mostrarLista();

  }

 

  // Función para descargar en Excel

  function descargarExcel() {

    const wb = XLSX.utils.book_new();

    const ws_name = "Lista de Compras";

    let ws_data = [];

 

    for (const seccion in listaCompras) {

      for (let i = 0; i < listaCompras[seccion].length; i++) {

        const { elemento, precio, cantidad } = listaCompras[seccion][i];

        const subtotal = precio * cantidad;

        ws_data.push([seccion, elemento, cantidad, precio, subtotal.toFixed(2)]);

      }

    }

 

    const ws = XLSX.utils.aoa_to_sheet([["Sección", "Elemento", "Cantidad", "Precio", "Subtotal"], ...ws_data]);

    XLSX.utils.book_append_sheet(wb, ws, ws_name);

 

    XLSX.writeFile(wb, 'lista_compras.xlsx');

  }

 

  // Función para descargar en PDF

  function descargarPDF() {

    const doc = new jsPDF();

    let y = 10;

 

    for (const seccion in listaCompras) {

      doc.text(10, y, seccion + ":");

      y += 10;

 

      for (let i = 0; i < listaCompras[seccion].length; i++) {

        const { elemento, precio, cantidad } = listaCompras[seccion][i];

        const subtotal = precio * cantidad;

        doc.text(20, y, `${elemento} (${cantidad} items) x ${precio}: $${subtotal.toFixed(2)}`);

        y += 10;

      }

    }

 

    doc.save('lista_compras.pdf');

  }

 

  // Mostrar la lista al cargar la página

  mostrarLista();
