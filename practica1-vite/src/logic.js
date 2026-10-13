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
}

export const descuentoVolumen = function descuentoVolumen(unidades, precioConEstado) {
  if (unidades <= 1) {
    return precioConEstado;
  }
  if (unidades === 2 || unidades === 3) {
    return precioConEstado * 0.95;
  }
  if (unidades >= 4) {
    return precioConEstado * 0.9;
  }
}

export const UMBRAL_STOCK_BAJO = 3;
export const comprobarStock = function stockBajo(stock, umbral = UMBRAL_STOCK_BAJO){
  return stock<umbral ? true : false;
}

//Para redondear y que te de 2 decimales en vez de un entero
export const redondear = (numero)=> Math.round(numero*100 ) / 100;


export const precioFinal = function precioFinal(estado, precio, unidades){
  let precioConDescuentos = descuentoVolumen(unidades, precioEstado(estado, precio));
  return redondear(precioConDescuentos * unidades);
}
/*
export const precioFinal2 = (estado, precio, unidades)=>{
  let precioConDescuentos = descuentoVolumen(unidades, precioEstado(estado, precio));
  return redondear(precioConDescuentos * unidades);
}*/

//------------------------------------------------------------------------------------------
//INVENTARIO

export const buscarProducto = (catalogo, id) => {
  return catalogo.find(producto => producto.id === id)
} 

export const RegistroVentas = (catalogo, id, cantidad) => {
  //Se elige producto y cantidad.
  const resultadoProducto = buscarProducto(catalogo, id);

  /*Se valida con un condicional que haya stock suficiente (usa el
  operador que corresponda: ternario para una decisión simple, 
  if/else si hay más de dos caminos)*/

  if(resultadoProducto){
    const resultadoStock = comprobarStock(resultadoProducto.stock)
    if(resultadoStock===true || resultadoProducto.stock<=cantidad){
      console.log("Puedes comprar, quedan ", resultadoProducto.stock, " existencias del producto ", resultadoProducto.titulo)
      catalogo.map(producto=>{
        return{
          ...producto, stock: producto.stock - cantidad
        };
      })
    }
    else if(resultadoProducto.stock<cantidad){
      console.log("ERROR: La cantidad a comprar del producto ", resultadoProducto.titulo, "es mayor que sus existencias ")

    }
  }else{
    console.log("ERROR: NO EXISTE ESE PRODUCTO")
  }
}


