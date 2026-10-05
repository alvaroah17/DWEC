import { stockBajo } from "./logic.js";

// Total facturado. El 0 del final es el valor inicial de "acumulado"
export function totalFacturado(ventas) {
  return ventas.reduce((acumulado, venta) => acumulado + venta.total, 0);
}

// Valor del stock: precio base x stock de cada producto, todo sumado
export function valorStock(catalogo) {
  return catalogo.reduce((acumulado, producto) => {
    // Destructuring (2)
    const { precio, stock } = producto;
    return acumulado + precio * stock;
  }, 0);
}

// some: true si AL MENOS UN producto tiene stock bajo
export function hayStockBajo(catalogo) {
  return catalogo.some((producto) => stockBajo(producto.stock));
}

// Cuántas unidades se han vendido de UN producto
function unidadesVendidas(ventas, id) {
  const ventasDelProducto = ventas.filter((venta) => venta.id === id);
  return ventasDelProducto.reduce((total, venta) => total + venta.unidades, 0);
}

// Producto más vendido. Si no hay ventas devuelve undefined
export function productoMasVendido(catalogo, ventas) {
  if (ventas.length === 0) {
    return undefined;
  }
  // Me quedo con el producto que tenga más unidades vendidas
  return catalogo.reduce((mejor, producto) => {
    if (unidadesVendidas(ventas, producto.id) > unidadesVendidas(ventas, mejor.id)) {
      return producto;
    }
    return mejor;
  });
}