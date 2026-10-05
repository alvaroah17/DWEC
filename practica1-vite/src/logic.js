import { catalogo } from "./catalogo";

export function precioEstado(estado, precio) {
  switch (estado) {
    case "nuevo-precintado":
      return precio * 1.25;
    case "usado-como-nuevo":
      return precio;
    case "usado-caja-danada":
      return precio * 0.85;
    case "solo-cartucho":
      return precio * 0.70;
    default:
      return precio;
  }
};

export function descuentoVolumen(unidades, precioEstado){
    if(unidades<=1){
        return precioEstado;
    }
    if(unidades===2 || unidades===3){
        return precioEstado * 0.95;
    }
    if(unidades>=4){
        return precioEstado * 0.90;
    }
};