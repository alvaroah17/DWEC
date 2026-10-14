//Importaciones

import { catalogo } from "./catalogo";
import { verCatalogoProductosStockBajo, RegistroVentas, verCatalogoCategoria, verCatalogoEntero, reponerStockUnJuego } from "./logic";
console.log("---------------------CATALOGO ENTERO------------------------")

verCatalogoEntero(catalogo);

console.log("---------------------CATALOGO CATEGORIA------------------------")

verCatalogoCategoria(catalogo, "RPG")

console.log("---------------------CATALOGO STOCK BAJO------------------------")

verCatalogoProductosStockBajo(catalogo)

console.log("-------------------------------------------------------------")

console.log("PRUEBA REGISTRO VENTAS")

const valoresFuncionesPrueba = RegistroVentas(catalogo, 1, 7);

const totalCompra = valoresFuncionesPrueba.totalCompra;
const resultadoProducto = valoresFuncionesPrueba.resultadoProducto;
const catalogoStockActualizado = valoresFuncionesPrueba.catalogoStockActualizado; 

console.log("--------------------------------------------")
console.log("PRUEBA TOTAL COMPRAS")

console.log("El total de la compra es: ", totalCompra,"€");

console.log("--------------------------------------------")
console.log("PRUEBA RESULTADO FINAL PRODUCTO")
console.log("El resultado final del producto es: \n",  
      "ID: ",
      resultadoProducto.id,
      " | Nombre: " + 
      resultadoProducto.nombre,
      " | Plataforma: ",
      resultadoProducto.plataforma,
      " | Categoria:",
      resultadoProducto.categoria ,
      " | Precio: ",
      resultadoProducto.precio,
      " | Precio final del juego",
      resultadoProducto.precioFinalJuego,
      " | Estado: ",
      resultadoProducto.estado,
      " | Cantidad comprada: ",
      resultadoProducto.cantidad,
      " | Stock antes de la compra: ",
      resultadoProducto.stock,
      " | Stock despues de la compra: ",
      (resultadoProducto.stock - resultadoProducto.cantidad)
    );
console.log("--------------------------------------------")
console.log("PRUEBA CATALOGO ACTUALIZADO")
console.log("El catalogo actualizado es: ")    
catalogoStockActualizado.forEach(juego => {
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

console.log("--------------------------------------------")
console.log("PRUEBA REPONER STOCK INDIVIDUAL")
const valoresReponerStockUnJuego = reponerStockUnJuego(catalogo, 1);

const verStockActualizado = valoresReponerStockUnJuego.catalogoStockActualizado

verStockActualizado.forEach((juego) =>{
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
})

console.log("--------------------------------------------")
