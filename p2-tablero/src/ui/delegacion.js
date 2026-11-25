// delegacion.js — Bloque B · ✍️ B3 (delegar).

// ✍️ B3 · delegar(contenedor, tipo, selector, manejador)
//   - UN solo addEventListener, en el contenedor (no en cada botón)
//   - Dentro: el elemento que encaja es evento.target.closest(selector). Si lo hay y está DENTRO
//     del contenedor (contenedor.contains(...)), llama a manejador(elemento, evento)
//   - Devuelve una función que quita el listener (removeEventListener con la MISMA función)
export function delegar(contenedor, tipo, selector, manejador) {

  const funcionListener = (evento) =>{
      const elemento = evento.target.closest(selector);
      if (elemento && contenedor.contains(elemento)) {
        manejador(elemento, evento);
      }
  };
  
  contenedor.addEventListener(tipo, funcionListener);

  const apagarlistener = () => contenedor.removeEventListener(tipo, funcionListener);   

  return apagarlistener;
}
