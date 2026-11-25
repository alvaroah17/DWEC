// persistencia.js — Bloque C · ✍️ C5 y C6. Guardar el tablero tras cada cambio y recuperarlo al abrir la página.
// Usa guardar, cargar y borrar (almacen.js, resuelto), tu obtenerJSON (red.js) y Tablero.desdeJSON.
import { Tablero } from "../modelo/Tablero.js";
import { borrar, cargar, guardar } from "./almacen.js";
import { obtenerJSON } from "./red.js";

export const CLAVE = "dwec-p2-tablero";

// ✍️ C5 · guardarTablero(tablero, storage = localStorage): guarda el tablero en CLAVE
export function guardarTablero(tablero, storage = localStorage) {
  // guardar hace JSON.stringify, y stringify llama solo a mi toJSON (C4)
  guardar(CLAVE, tablero, storage);
}

// ✍️ C6 · async arrancar({ storage = localStorage, fetchFn = fetch, url = "/tareas-iniciales.json",
//                  limiteEnCurso = 3 } = {}) → { tablero, origen, error? }
//   Los tres casos («guardado», «inicial» y «vacio») están en el enunciado (bloque C).
export async function arrancar({
  storage = localStorage,
  fetchFn = fetch,
  url = "/tareas-iniciales.json",
  limiteEnCurso = 3,
} = {}) {
  // 1. ¿Hay algo guardado? cargar da null si no hay nada o si no es JSON
  const guardado = cargar(CLAVE, null, storage);

  if (guardado !== null) {
    try {
      // Lo recupero con mi C4 y aquí se acaba: no pido nada a la red
      const tablero = Tablero.desdeJSON(guardado);
      return { tablero, origen: "guardado" };
    } catch {
      // Era JSON pero desdeJSON no lo acepta (otra versión) -> lo borro
      borrar(CLAVE, storage);
    }
  }

  // 2. No había nada válido -> pido las iniciales con mi C2 y las meto con desde (A3)
  try {
    const datos = await obtenerJSON(url, fetchFn);
    const tablero = Tablero.desde(datos, limiteEnCurso);
    return { tablero, origen: "inicial" };
  } catch (error) {
    // 3. Tampoco se puede (sin red, 404, no es JSON) -> tablero vacío y el mensaje. NO lanza
    return { tablero: new Tablero(limiteEnCurso), origen: "vacio", error: error.message };
  }
}