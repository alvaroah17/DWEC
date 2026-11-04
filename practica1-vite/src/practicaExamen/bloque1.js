import { CATALOGO, redondear } from "./catalogo2";

/*BLOQUE 1
----------------------------
*/
//EJERCICIO 5.1 
//SIN RETURN 
const buscarPorId = (catalogo, id) =>
  catalogo.find((juego)=> juego.id === id);

//CON RETURN
const buscarPorIdReturn = (catalogo, id) => {
  return catalogo.din((juego) =>juego.id === id)
}

//EJERCICIO 5.2
//SIN RETURN
const buscarPorTitulo = (catalogo, texto) => {
const textoformateado = texto.trim().toLowerCase()  

  return catalogo.filter((juego) => 
    juego.titulo.toLowerCase().includes(textoformateado)  
  )
};

//CON RETURN
const buscarPorTituloReturn = (catalogo, texto) => {
const textoformateado = texto.trim().toLowerCase()  

  return catalogo.filter((juego) => {
    return juego.titulo.toLowerCase().includes(textoformateado)
    }  
  )
}; 

//EJERCICIO 5.3
//CON RETURN
const valorStock = (catalogo) => {
  const stockCatalogo = catalogo.reduce((acc, juego) => {
    return acc + (juego.precio * (juego.stock ?? 0)) 
  }, 0)
  return stockCatalogo;
}

console.log("EL STOCK TOTAL ES: ", valorStock(CATALOGO))

//EJERCICIO 5.4
//CON RETURN
const ordenarPorPrecio = (catalogo) =>{
  return [...catalogo].sort((juego1, juego2) => juego1.precio - juego2.precio)
}
//SIN RETURN
const ordenarPorPrecio2 = (catalogo) =>
  [...catalogo].sort((juego1, juego2) => juego1.precio - juego2.precio)

//EJERCICIO 5.6
const lineasCatalogo = (catalogo) => {
  const juegosConStock = catalogo.filter((juego) => {
    return juego.stock>0
  })

  const juegosFiltradosConStock = juegosConStock.map((juegos) => {
    if(juegos.stock <= 2){
      return "titulo :"+juegos.titulo+ "precio :"+juegos.precio +  "Ultimas unidades"
    }
    else {
      return "titulo :"+juegos.titulo+ "precio :"+juegos.precio +  "En stock"
    }
  });

  return  juegosFiltradosConStock;
}

//EJERCICIO 5.7
const vender = (catalogo, id, unidades) => {
  const buscarProducto = catalogo.find((juego) => juego.id === id)

  if(buscarProducto){
    if(buscarProducto.stock>=unidades){
      const stockActualizado = catalogo.map((juego)=>{
        if(juego.id === id){
          return {
          ...juego, stock: juego.stock - unidades
          };
        }
        else{
          return juego;
        }
      })
      return stockActualizado
    }else{
      console.log("No hay tanto stock como las que se quieren comprar")
      return catalogo;
    }
       
  }else{
    console.log("ESE PRODUCTO NO EXISTE")
    return catalogo;
  }
}

const precioDescuento = (juego, cantidad) => {
  if(cantidad>3) juego.precio * 0.90;
  if(cantidad>1 && cantidad<=3)juego.precio * 0.95;
  if(cantidad === 1) juego.precio; 
}

//EJERCICIO 5.8
const resumenVentas = (ventas) => {
  const totalVentas = ventas.reduce((acc, compra)=>{
    return redondear(acc + compra.total)
  },0)
  
  const masVendido = ventas.reduce((v, m) =>{
    if(m === null || v.unidades > m.unidades){
      return v;
    }else{
      return m;
    } 
  },null)

  return{totalVentas, mayorVentas: masVendido?.titulo ?? null}
};

const stockVisible = (producto) => producto.stock ?? "sin datos" 

const nombreCorto = ({titulo, plataforma}) => `${titulo || "sin titulo"} (${plataforma ?? "desconocida"})`

const contarConStock = (catalogo) => catalogo.filter((juego)=>juego.stock).length