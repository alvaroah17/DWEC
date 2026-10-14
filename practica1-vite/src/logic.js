export const precioEstado = function precioEstado(estado, precio) {
  switch (estado) {
    case "nuevo-precintado":
      return precio * 1.25;
    case "usado-como-nuevo":
      return precio;
    case "usado-caja-danada":
      return precio * 0.85;
    case "solo-cartucho":
      return precio * 0.7;
    default:
      return precio;
  }
};

export const descuentoVolumen = function descuentoVolumen(
  unidades,
  precioConEstado,
) {
  if (unidades <= 1) {
    return precioConEstado;
  }
  if (unidades === 2 || unidades === 3) {
    return precioConEstado * 0.95;
  }
  if (unidades >= 4) {
    return precioConEstado * 0.9;
  }
};

export const UMBRAL_STOCK_BAJO = 3;
export const comprobarStock = function stockBajo(stock,umbral = UMBRAL_STOCK_BAJO) {
  return stock > umbral ? true : false;
};

//Para redondear y que te de 2 decimales en vez de un entero
export const redondear = (numero) => numero.toFixed(2);

export const precioFinal = function precioFinal(estado, precio, unidades) {
  let precioConDescuentos = descuentoVolumen(unidades,precioEstado(estado, precio));
  return redondear(precioConDescuentos);
};
export const precioTotalCompra = (precioTotal, cantidad) => {
  return redondear(precioTotal*cantidad)
} 
/*
export const precioFinal2 = (estado, precio, unidades)=>{
  let precioConDescuentos = descuentoVolumen(unidades, precioEstado(estado, precio));
  return redondear(precioConDescuentos * unidades);
}*/

//------------------------------------------------------------------------------------------
//INVENTARIO
export const buscarProducto = (catalogo, id) => {
  return catalogo.find((producto) => id===producto.id);
};

export const RegistroVentas = (catalogo, id, cantidad) => {
  //Se elige producto y cantidad.
  const resultadoProducto = buscarProducto(catalogo, id);
  /*Se valida con un condicional que haya stock suficiente (usa el
  operador que corresponda: ternario para una decisión simple, 
  if/else si hay más de dos caminos)*/

  if (resultadoProducto) {
    const precioFinalJuego = precioFinal(resultadoProducto.estado, resultadoProducto.precio, cantidad);
    const precioTotal = precioTotalCompra(precioFinalJuego, cantidad);
    const resultadoStock = comprobarStock(resultadoProducto.stock);
    if (resultadoStock === true && resultadoProducto.stock >= cantidad) {
      /*console.log(
        "Puedes comprar, quedan ",
        resultadoProducto.stock,
        " existencias del producto ",
        resultadoProducto.nombre,
      );*/
      const catalogoStockActualizado = catalogo.map((juegos) => {
        if (id === juegos.id) {
          return {
            ...juegos,
            stock: juegos.stock - cantidad,
          };
        } else {
          return { ...juegos };
        }
      });
      return {catalogoStockActualizado, resultadoProducto:{...resultadoProducto, precioFinalJuego, cantidad }, totalCompra: precioTotal}

    } else if (resultadoProducto.stock < cantidad) {
      console.log(
        "ERROR: La cantidad a comprar del producto ",
        resultadoProducto.nombre,
        "es mayor que sus existencias ",
    
      );
      return " ";
    }
  } else {
    console.log("ERROR: NO EXISTE ESE PRODUCTO");
    return " ";
  }
};

export const verCatalogoEntero = (catalogo) => {
  catalogo.forEach((juego) => {
    console.log(
      "ID: ",
      juego.id,
      " | Nombre: " + 
      juego.nombre,
      " | Plataforma: ",
      juego.plataforma,
      " | Categoria :",
      juego.categoria,
      " | Precio: ",
      juego.precio,
      " | Estado: ",
      juego.estado,
      " | Stock: ",
      juego.stock
    );
  });
};

export const verCatalogoCategoria = (catalogo, categoria) => {
  const catalogoFiltrado = catalogo.filter((juego)=>juego.categoria===categoria)

  catalogoFiltrado.forEach((juego) => {
    console.log(
      "ID: ",
      juego.id,
      " | Nombre: " + 
      juego.nombre,
      " | Plataforma: ",
      juego.plataforma,
      " | Categoria :",
      juego.categoria,
      " | Precio: ",
      juego.precio,
      " | Estado: ",
      juego.estado,
      " | Stock: ",
      juego.stock
    );
  });
}

export const verCatalogoProductosStockBajo = (catalogo) =>{
  const catalogoFiltrado = catalogo.filter((juego)=>!comprobarStock(juego.stock))

  catalogoFiltrado.forEach((juego)=>{
    console.log(
      "ID: ",
      juego.id,
      " | Nombre: " + 
      juego.nombre,
      " | Plataforma: ",
      juego.plataforma,
      " | Categoria :",
      juego.categoria,
      " | Precio: ",
      juego.precio,
      " | Estado: ",
      juego.estado,
      " | Stock: ",
      juego.stock
    );
  });
}

export const reponerStockUnJuego = (catalogo, id) =>{
  const resultadoProducto = buscarProducto(catalogo, id);

  if (resultadoProducto) {
    if (resultadoProducto.stock>=1) {
      console.log(
        "Quedan ",
        resultadoProducto.stock,
        " existencias del producto ",
        resultadoProducto.nombre,
      );
      const cantidadAnadida = parseInt(prompt("Introduce cuantas existencias quieres añadir al stock actual: "), 10)
  
      const catalogoStockActualizado = catalogo.map((juegos) => {
        if (id === juegos.id) {
          return {
            ...juegos,
            stock: juegos.stock + cantidadAnadida,
          };
        } else {
          return { ...juegos };
        }
      });
      return {catalogoStockActualizado, resultadoProducto:{...resultadoProducto, cantidadAnadida }}

    } else {
      console.log(
        "No queda stock de este producto, stock: ",
        resultadoProducto.stock,
        " existencias del producto ",
        resultadoProducto.nombre,
      );
      const cantidadAnadida = parseInt(prompt("Introduce cuantas existencias quieres añadir: "), 10)

      const catalogoStockActualizado = catalogo.map((juegos)=>{
        if(id===juegos.id){
          return {
            ...juegos,
            stock: juegos.stock + cantidadAnadida
          }
        } else{
          console.log("No se ha podido modificar el stock ya que no se ha encontrado su ID")
          return { ...juegos };
        }
      });
      return {catalogoStockActualizado, resultadoProducto:{...resultadoProducto, cantidadAnadida }}
    }
  } else {
    console.log("ERROR: NO EXISTE ESE PRODUCTO");
    return null;
  }
};

export const informeCaja = (catalogo, ventas) => {
  const valorStockTotal = catalogo.reduce((acc, juego) => {
    return acc + juego.precio * juego.stock;
  }, 0);

  const totalFacturado = ventas.reduce((acc, venta) => {
    return acc + venta.totalCompra;
  }, 0);

  const juegosVendidos = [];
  ventas.map((venta) => {
    if (!juegosVendidos.find((juego) => juego.id === venta.id)) {
      const ventasFiltradas = ventas.filter((game) => game.id === venta.id);
      const unidadesTotal = ventasFiltradas.reduce((acc, game) => {
        return acc + game.unidades;
      }, 0);
      juegosVendidos.push({ ...venta, unidadesTotal });
    }
  });

  const juegoMasVendido = juegosVendidos.reduce((acc, juego) => {
    return juego.unidadesTotal > acc.unidadesTotal ? juego : acc;
  });

  return {
    valorStockTotal,
    totalFacturado,
    juegoMasVendido,
  };
};
