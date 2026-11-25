// red.js — Bloque C · ✍️ C2. Pedir un JSON con fetch y async/await, sin fiarse de nada.

// ✍️ C2 · async obtenerJSON(url, fetchFn = fetch) → el JSON ya convertido
//   - const respuesta = await fetchFn(url)
//   - Si !respuesta.ok → lanza un Error con el código (respuesta.status) Y la url en el mensaje
//   - Si la cabecera content-type no incluye "application/json" → lanza un Error con la url
//     (Vite devuelve su index.html, con un 200, cuando el fichero no existe)
//   - Si todo va bien, devuelve respuesta.json()
//   - Los errores de red (sin conexión) NO se capturan aquí: que le lleguen a quien llama
export async function obtenerJSON(url, fetchFn = fetch) {
  // Espero la respuesta del servidor
  const respuesta = await fetchFn(url);

  // fetch NO falla con 404 ni 500, hay que mirar ok
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al pedir ${url}`);
  }

  // Si el fichero no existe, Vite devuelve su index.html con un 200, así que miro el tipo
  let tipo = respuesta.headers.get("content-type");
  if (tipo === null) {
    tipo = "";
  }
  if (!tipo.includes("application/json")) {
    throw new Error(`${url} no devuelve JSON (content-type: ${tipo})`);
  }

  // Texto JSON -> array de objetos
  const datos = await respuesta.json();
  return datos;
}