import { catalogo } from "./catalogo";
import {
  verCatalogoEntero,
  verCatalogoCategoria,
  verCatalogoProductosStockBajo,
  buscarProducto,
  RegistroVentas,
  reponerStockUnJuego,
  informeCaja,
  redondear,
} from "./logic";

export const menu = () => {
  // Copia del catálogo que iremos actualizando (catalogo importado es const y no se puede reasignar)
  let catalogoActual = catalogo;
  // Aquí se guardan las ventas de la sesión para el informe de caja
  const ventas = [];
  let condicionBucle = true;

  // Muestra el informe (se usa en la opción 5 y al salir)
  const mostrarInforme = () => {
    if (ventas.length === 0) {
      console.log("Todavía no se ha registrado ninguna venta.");
    } else {
      const informe = informeCaja(catalogoActual, ventas);
      console.log("Valor total del stock: ", redondear(informe.valorStockTotal), "€");
      console.log("Total facturado: ", redondear(informe.totalFacturado), "€");
      console.log(
        "Juego más vendido: ",
        informe.juegoMasVendido.nombre,
        "con",
        informe.juegoMasVendido.unidadesTotal,
        "unidades"
      );
    }
  };

  do {
    // MENÚ PRINCIPAL
    const eleccionMenu = parseInt(
      prompt(
        "=== RetroStock ===\n" +
          "1. Vistas del catálogo\n" +
          "2. Buscar un producto\n" +
          "3. Registrar venta\n" +
          "4. Reponer stock\n" +
          "5. Informe de caja\n" +
          "6. Salir\n\n" +
          "Elige una opción:"
      )
    );

    switch (eleccionMenu) {
      case 1: {
        // 1. VISTAS DEL CATÁLOGO
        console.log("1. Vistas del catálogo");

        // SUBMENÚ DE LAS 3 VISTAS
        const eleccionSubMenu = parseInt(
          prompt(
            "=== Vistas del catálogo ===\n" +
              "1. Todo el catálogo\n" +
              "2. Filtrar por categoría\n" +
              "3. Solo productos con stock bajo\n\n" +
              "Elige una vista:"
          )
        );

        switch (eleccionSubMenu) {
          case 1:
            console.log("1.1 Todo el catálogo");
            verCatalogoEntero(catalogoActual);
            break;
          case 2: {
            console.log("1.2 Filtrar por categoría");
            const categoria = prompt("Introduce la categoría (ej: RPG, Aventura, Plataformas):");
            verCatalogoCategoria(catalogoActual, categoria);
            break;
          }
          case 3:
            console.log("1.3 Solo productos con stock bajo");
            verCatalogoProductosStockBajo(catalogoActual);
            break;
          default:
            console.log("Vista no válida. Elige 1, 2 o 3.");
        }
        break;
      }
      case 2: {
        // 2. BUSCAR UN PRODUCTO
        console.log("2. Buscar un producto");
        const idBuscar = parseInt(prompt("Introduce el ID del juego a buscar:"));
        const productoEncontrado = buscarProducto(catalogoActual, idBuscar);

        if (productoEncontrado) {
          verCatalogoEntero([productoEncontrado]);
        } else {
          console.log("ERROR: NO EXISTE ESE PRODUCTO");
        }
        break;
      }
      case 3: {
        // 3. REGISTRAR VENTA
        console.log("3. Registrar venta");
        const idVenta = parseInt(prompt("Introduce el ID del juego a vender:"));
        const cantidadVenta = parseInt(prompt("Introduce la cantidad a vender:"));

        const resultadoVenta = RegistroVentas(catalogoActual, idVenta, cantidadVenta);

        // Si la venta ha ido bien, RegistroVentas devuelve un objeto con totalCompra
        if (resultadoVenta && resultadoVenta.totalCompra) {
          catalogoActual = resultadoVenta.catalogoStockActualizado;
          ventas.push({
            id: idVenta,
            nombre: resultadoVenta.resultadoProducto.nombre,
            unidades: cantidadVenta,
            totalCompra: Number(resultadoVenta.totalCompra), // Number porque viene como texto (toFixed)
          });
          console.log("Venta registrada. Total de la compra: ", resultadoVenta.totalCompra, "€");
        } else {
          console.log("No se ha podido registrar la venta.");
        }
        break;
      }
      case 4: {
        // 4. REPONER STOCK
        console.log("4. Reponer stock");
        const idReponer = parseInt(prompt("Introduce el ID del juego a reponer:"));
        const resultadoReponer = reponerStockUnJuego(catalogoActual, idReponer);

        if (resultadoReponer) {
          catalogoActual = resultadoReponer.catalogoStockActualizado;
          console.log("Stock actualizado:");
          verCatalogoEntero([buscarProducto(catalogoActual, idReponer)]);
        }
        break;
      }
      case 5:
        // 5. INFORME DE CAJA
        console.log("5. Informe de caja");
        mostrarInforme();
        break;
      case 6:
        // 6. SALIR
        console.log("6. Salir");
        console.log("=== Resumen final de la sesión ===");
        console.log("Ventas realizadas: ", ventas.length);
        mostrarInforme();
        condicionBucle = false;
        break;
      default:
        console.log("Opción no válida. Elige un número del 1 al 6.");
    }
  } while (condicionBucle);
};
