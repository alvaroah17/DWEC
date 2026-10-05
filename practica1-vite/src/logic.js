export function precioEstado(estado, precio) {
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

export function descuentoVolumen(unidades, precioConEstado) {
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
export function stockBajo(stock, umbral = UMBRAL_STOCK_BAJO){

  if(stock<umbral){
    return true;
  } else{
    return false;
  }
}

export function redondear(numero){
  //Para redondear y que te de 2 decimales en vez de un entero
  return Math.round(numero*100 ) / 100;
}

export function precioFinal(estado, precio, unidades){
let precioConDescuentos = descuentoVolumen(unidades, precioEstado(estado, precio));
return redondear(precioConDescuentos * unidades);
}

