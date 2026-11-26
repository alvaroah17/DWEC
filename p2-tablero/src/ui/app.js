// app.js — Bloque B · ✍️ B4, B5 y B6. Conecta el modelo (el tablero) con la página: pinta, escucha y avisa.
// Usa tus piezas: crearTarjeta/pintarLista, leerFormulario/mostrarErrores y delegar.
// La estructura de la página (ids, data-*) está en index.html y NO se cambia: la usan los tests.
import { ErrorTablero } from "../modelo/errores.js";
import { delegar } from "./delegacion.js";
import { leerFormulario, mostrarErrores } from "./formulario.js";
import { pintarLista } from "./tarjeta.js";

/** Botones de cada tarjeta según su columna: [texto, data-accion] */
const ACCIONES = {
  "Por hacer": [["Empezar →", "empezar"]],
  "En curso": [
    ["← Volver", "volver"],
    ["✓ Completar", "completar"],
  ],
  Hecho: [],
};

// ✍️ B6 · validar(datos) → { campo: "mensaje" } con los errores (objeto vacío si todo está bien)
//   - titulo: obligatorio y como mucho 80 caracteres
//   - cadaDias (si viene): entero mayor que 0. Si es correcto pero no hay limite, el error va
//     en «limite»: una tarea que se repite necesita fecha límite
export function validar(datos) {
  const errores = {};

  // Título: obligatorio y máx. 80
  let titulo = datos.titulo;
  if (titulo === undefined || titulo === null) {
    titulo = ""; // si no viene, cuenta como vacío
  }
  titulo = titulo.trim();

  if (titulo === "") {
    errores.titulo = "La tarea necesita un título";
  } else if (titulo.length > 80) {
    errores.titulo = "El título no puede pasar de 80 caracteres";
  }

  // cadaDias: solo si viene
  if (datos.cadaDias !== undefined) {
    const esEnteroPositivo = Number.isInteger(datos.cadaDias) && datos.cadaDias > 0; // 7 sí · 0 y 2.5 no
    if (esEnteroPositivo === false) {
      errores.cadaDias = "Tiene que ser un número entero mayor que 0";
    } else if (!datos.limite) {
      errores.limite = "Una tarea que se repite necesita fecha límite"; // el error va en limite
    }
  }

  return errores;
}

/**
 * Arranca la interfaz dentro de raiz (el <main id="app">). Los listeners se ponen UNA vez aquí;
 * pintar() solo cambia nodos, así que repintar no los duplica.
 * opciones.hoy: fecha fija para los tests · opciones.alCambiar(tablero): tras cada cambio (UD6)
 */
export function iniciarApp(raiz, tablero, { hoy = null, alCambiar = () => {} } = {}) {
  const form = raiz.querySelector("#form-alta");
  const aviso = raiz.querySelector("#aviso");
  const columnas = raiz.querySelector("#columnas");
  const resumen = raiz.querySelector("#resumen");

  // ✍️ B4 · pintar(): deja la página igual que el modelo cada vez que se llama, y NO pone listeners
  //   - cada columna ([data-columna="…"]): sus tareas en el orden de ordenadas(), con pintarLista en su
  //     .lista, y en cada .tarjeta sus botones según ACCIONES: <button type="button" data-accion="…">
  //   - el .contador de cada columna: (n), o (n/límite) en la que tiene límite WIP
  //   - [data-dato="progreso"]: hechas ÷ total en %, redondeado (con el tablero vacío, 0 %)
  //   - [data-dato="vencidas"]: las vencidas de tablero.resumen(ahora)
  //   La fecha de hoy: const ahora = hoy ?? new Date();  (los tests pasan una fija)
  function pintar() {
    const ahora = hoy ?? new Date();
    if (columna.nombre === "Por hacer" && tablero.buscar(Number(tarjeta.dataset.id)).limite){
      tarjeta.append(crearBoton("Cambiar urgencia y empezar", "urgencia"));
    }
    for (const columna of tablero.columnas) {
      const nombreColumna = columna.nombre;
      const divColumna = columnas.querySelector(`[data-columna="${nombreColumna}"]`);
      const lista = divColumna.querySelector(".lista");
      const contador = divColumna.querySelector(".contador");

      // 1. Tarjetas ordenadas (mi B1)
      const tareasOrdenadas = columna.ordenadas();
      pintarLista(lista, tareasOrdenadas, ahora);

      // 2. Botones de cada tarjeta según ACCIONES
      const botonesDeEstaColumna = ACCIONES[nombreColumna]; // Hecho → [] → ninguno
      const tarjetas = divColumna.querySelectorAll(".tarjeta");

      for (const tarjeta of tarjetas) {
        for (const par of botonesDeEstaColumna) {
          const texto = par[0]; // "Empezar →"
          const accion = par[1]; // "empezar"

          const boton = document.createElement("button");
          boton.type = "button";
          boton.dataset.accion = accion; // la etiqueta que lee el B5
          boton.textContent = texto;
          tarjeta.append(boton);
        }
      }

      // 3. Contador: (n) o (n/límite)
      const numeroTareas = tareasOrdenadas.length;
      if (columna.limiteWip !== null) {
        contador.textContent = `(${numeroTareas}/${columna.limiteWip})`; // En curso
      } else {
        contador.textContent = `(${numeroTareas})`;
      }
    }

    // 4. Progreso y vencidas
    const datosResumen = tablero.resumen(ahora);
    const total = datosResumen.porHacer + datosResumen.enCurso + datosResumen.hecho;

    let progreso;
    if (total === 0) {
      progreso = 0; // 0/0 = NaN
    } else {
      progreso = Math.round((datosResumen.hecho / total) * 100);
    }

    const textoProgreso = resumen.querySelector('[data-dato="progreso"]');
    const textoVencidas = resumen.querySelector('[data-dato="vencidas"]');
    textoProgreso.textContent = `${progreso} %`;
    textoVencidas.textContent = datosResumen.vencidas;
  }

  // 👀 Resuelto: avisar("texto") enseña el aviso; avisar("") lo esconde
  function avisar(mensaje) {
    aviso.textContent = mensaje;
    aviso.hidden = mensaje === "";
  }

  // ✍️ B5 · UN listener, puesto UNA vez aquí (nunca dentro de pintar): clic en los botones de las
  //   tarjetas, con delegar sobre `columnas`. empezar → «En curso», volver → «Por hacer», completar.
  //   Tras cada cambio que sale bien: avisar(""), pintar() y alCambiar(tablero).
  //   Si el tablero lanza un ErrorTablero → avisar(error.message) y no se repinta.
  //   Cualquier otro error → se relanza (es un fallo del programa).
  //   Pista: una función cambiar(accion) con el try/catch te sirve también para el B6.
  function cambiar(hacerCambio) {
    try {
      hacerCambio();
    } catch (error) {
      if (error instanceof ErrorTablero) {
        avisar(error.message); // «no se puede» del tablero → aviso, sin repintar
        return false;
      } else {
        throw error; // fallo del programa: que suba
      }
    }

    // Salió bien
    avisar("");
    pintar();
    alCambiar(tablero); // bloque C: guardar
    return true;
  }

  // UN solo listener para todos los botones (mi B3)
  delegar(columnas, "click", "button[data-accion]", (boton) => {
    const tarjeta = boton.closest(".tarjeta");
    const id = Number(tarjeta.dataset.id); // dataset da texto: "1" → 1
    const accion = boton.dataset.accion;

    cambiar(() => {
      if (accion === "empezar") {
        tablero.mover(id, "En curso");
      } else if (accion === "volver") {
        tablero.mover(id, "Por hacer");
      } else if (accion === "completar") {
        tablero.completar(id);
      }
      else if (accion === "urgencia") {
      // cierra el formulario que haya abierto: columnas.querySelector("form")?.remove()
      // TU TURNO: añade crearFormulario(tarea) a ESA tarjeta y pon el foco en su input
        return;   // abrir no cambia nada: ni alCambiar ni repintar
      }
      else if (accion === "cancelar") return columnas.querySelector("form")?.remove();
    });
  });

  // ✍️ B6 · submit de `form`: preventDefault, leerFormulario, validar y mostrarErrores. Si hay errores,
  //   no se crea nada. Si no, tablero.crearTarea(datos) (como un cambio más) y form.reset().
  form.addEventListener("submit", (evento) => {
    evento.preventDefault(); // que no recargue

    const datos = leerFormulario(form);
    const errores = validar(datos);
    mostrarErrores(form, errores); // mi B2

    const numeroErrores = Object.keys(errores).length;
    if (numeroErrores > 0) {
      return; // con errores no se crea nada
    }

    const salioBien = cambiar(() => tablero.crearTarea(datos)); // un cambio más (B5)
    if (salioBien) {
      form.reset();
    }
  });

  pintar();
  return { pintar };
}