import { catalogo } from "./catalogo.js";
import { stockBajo, precioFinal, redondear } from "./logic.js";
import {
  formatearEuros,
  formatearProducto,
  buscarProducto,
  restarStock,
  sumarStock,
} from "./inventario.js";
import { crearContadorVentas } from "./sesion.js";
import { totalFacturado, valorStock, hayStockBajo, productoMasVendido } from "./informe.js";

// ---------- Datos de la sesión ----------
// COPIA del catálogo con [...catalogo]: el original nunca se toca
let catalogoActual = [...catalogo];
let ventas = [];
const contador = crearContadorVentas(); // el closure

// FLECHA 2: escribe por pantalla. ...partes (REST) recoge todos los argumentos
const mostrar = (...partes) => console.log(partes.join(" "));

// Enseña una lista. Si está vacía, enseña un mensaje
function mostrarLista(productos, mensajeVacio) {
  const lineas = productos.map(formatearProducto);
  // Ternario: si hay líneas las enseño, si no enseño el mensaje
  mostrar(lineas.length > 0 ? lineas.join("\n") : mensajeVacio);
}

// ---------- Opción 1: Ver catálogo ----------
function verCatalogo() {
  const opcion = prompt("VER CATÁLOGO\n1) Todo\n2) Por categoría\n3) Solo stock bajo");

  switch (opcion) {
    case "1":
      mostrarLista(catalogoActual, "El catálogo está vacío.");
      break;
    case "2": {
      const categoria = prompt("Categoría (RPG, Deportes, Lucha...):") ?? "";
      const filtrados = catalogoActual.filter((producto) => {
        return producto.categoria.toLowerCase() === categoria.toLowerCase();
      });
      mostrarLista(filtrados, "No hay productos en esa categoría.");
      break;
    }
    case "3": {
      const conPocoStock = catalogoActual.filter((producto) => stockBajo(producto.stock));
      mostrarLista(conPocoStock, "No hay productos con stock bajo.");
      break;
    }
    default:
      mostrar("Opción no válida.");
  }
}

// ---------- Opción 2: Buscar ----------
function buscar() {
  const texto = prompt("Buscar por id o por título:") ?? "";
  const producto = buscarProducto(catalogoActual, texto);

  if (producto === undefined) {
    mostrar("No se ha encontrado ningún producto.");
    return;
  }
  mostrar(formatearProducto(producto));
}

// ---------- Opción 3: Vender ----------
function vender() {
  const id = Number(prompt("Id del producto:"));
  const unidades = Number(prompt("Unidades a vender:"));
  const producto = catalogoActual.find((p) => p.id === id);

  // Si hay un error, aviso y salgo con return
  if (producto === undefined) {
    mostrar("No existe ese producto.");
    return;
  }
  if (!Number.isInteger(unidades) || unidades <= 0) {
    mostrar("Las unidades deben ser un número entero mayor que 0.");
    return;
  }
  if (unidades > producto.stock) {
    mostrar("No hay stock suficiente. Quedan", producto.stock, "unidades.");
    return;
  }

  // Tabla A + Tabla B
  const precioUnitario = precioFinal(producto.estado, producto.precio, unidades);
  const total = redondear(precioUnitario * unidades);

  // Todo sin modificar: restarStock devuelve un array nuevo
  catalogoActual = restarStock(catalogoActual, id, unidades);
  ventas = [...ventas, { id, nombre: producto.nombre, unidades, total }]; // sin push
  contador.sumar();

  mostrar("Venta realizada:", unidades, "x", producto.nombre);
  mostrar("Precio unitario final:", formatearEuros(precioUnitario));
  mostrar("Total de la venta:", formatearEuros(total));
  mostrar(formatearProducto(catalogoActual.find((p) => p.id === id)));
}

// ---------- Opción 4: Reponer ----------
function reponer() {
  const id = Number(prompt("Id del producto:"));
  const unidades = Number(prompt("Unidades a añadir:"));
  const producto = catalogoActual.find((p) => p.id === id);

  if (producto === undefined) {
    mostrar("No existe ese producto.");
    return;
  }
  if (!Number.isInteger(unidades) || unidades <= 0) {
    mostrar("Las unidades deben ser un número entero mayor que 0.");
    return;
  }

  catalogoActual = sumarStock(catalogoActual, id, unidades);
  mostrar("Stock actualizado.");
  mostrar(formatearProducto(catalogoActual.find((p) => p.id === id)));
}

// ---------- Opción 5: Informe de caja ----------
function informeCaja() {
  const masVendido = productoMasVendido(catalogoActual, ventas);

  mostrar("Ventas realizadas:", contador.total());
  mostrar("Total facturado:", formatearEuros(totalFacturado(ventas)));
  // ?.: si masVendido es undefined no da error. ??: si es undefined uso el texto
  mostrar("Producto más vendido:", masVendido?.nombre ?? "Aún no hay ventas");
  mostrar("Valor del stock restante:", formatearEuros(valorStock(catalogoActual)));
  if (hayStockBajo(catalogoActual)) {
    mostrar("Hay productos con stock bajo");
  } else {
    mostrar("Ningún producto con stock bajo");
  }
}

// ---------- Menú principal ----------
export function iniciarMenu() {
  let opcion;

  // do...while: el menú sale al menos una vez y se repite hasta que elijo 6
  do {
    opcion = prompt(
      "RETROSTOCK\n1) Ver catálogo\n2) Buscar producto\n3) Registrar venta\n4) Reponer stock\n5) Informe de caja\n6) Salir",
    );

    switch (opcion) {
      case "1":
        verCatalogo();
        break;
      case "2":
        buscar();
        break;
      case "3":
        vender();
        break;
      case "4":
        reponer();
        break;
      case "5":
        informeCaja();
        break;
      case "6":
        mostrar("Resumen final de la sesión:");
        informeCaja();
        break;
      default:
        mostrar("Opción no válida.");
    }
  } while (opcion !== "6");
}
