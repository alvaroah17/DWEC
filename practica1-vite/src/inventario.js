import { precioFinal, stockBajo } from "./logic.js";

// FLECHA 1: función pequeña. Convierte 42.75 en "42,75 €"
export const formatearEuros = (numero) => numero.toFixed(2).replace(".", ",") + " €";

// 4.1 Devuelve el texto de UN producto
export function formatearProducto(producto) {
  // Destructuring (1): saco las propiedades del producto a variables sueltas
  const { id, nombre, plataforma, categoria, precio, estado, stock } = producto;

  // &&: si hay stock bajo da el texto, si no da false
  const aviso = stockBajo(stock) && " ¡¡Stock bajo!!";

  // El precio que enseño es el de venta de 1 unidad
  const precioVenta = formatearEuros(precioFinal(estado, precio, 1));

  // ||: si aviso es false, pongo "" para que no salga la palabra "false"
  return `[${id}] ${nombre} (${plataforma}) - ${categoria} - ${precioVenta} - Stock: ${stock} ${aviso || ""}`;
}

// 4.3 Busca por id o por nombre. Si no encuentra nada devuelve undefined
export function buscarProducto(catalogo, texto) {
  if (texto === "") {
    return undefined;
  }
  const textoMinusculas = texto.toLowerCase();

  // find devuelve el PRIMER producto que cumpla la condición
  return catalogo.find((producto) => {
    const mismoId = producto.id === Number(texto); // prompt da texto, lo paso a número
    const mismoNombre = producto.nombre.toLowerCase().includes(textoMinusculas);
    return mismoId || mismoNombre;
  });
}

// 4.4 MI HOF: recibe una función (funcionCambio) y la aplica SOLO al producto con ese id.
// map crea un array NUEVO, el catálogo original no se toca.
export function cambiarProducto(catalogo, id, funcionCambio) {
  return catalogo.map((producto) => {
    if (producto.id === id) {
      return funcionCambio(producto);
    }
    return producto; // los demás se quedan igual
  });
}

// Resta stock. { ...producto, stock: ... } copia el producto y cambia solo el stock
export function restarStock(catalogo, id, unidades) {
  return cambiarProducto(catalogo, id, (producto) => {
    return { ...producto, stock: producto.stock - unidades };
  });
}

// Suma stock. Igual que restarStock pero con +
export function sumarStock(catalogo, id, unidades) {
  return cambiarProducto(catalogo, id, (producto) => {
    return { ...producto, stock: producto.stock + unidades };
  });
}