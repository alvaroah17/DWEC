// Columna.js — Bloque A · ✍️ A2: una columna del tablero («Por hacer», «En curso», «Hecho»).
// En kanban, una columna puede tener un límite WIP (Work In Progress): «En curso» no admite más
// de 3 tareas a la vez, para no empezar mil cosas y no acabar ninguna.
import { Tarea } from "./Tarea.js";

export class Columna {
  // Privado: #tareas, un array
  #tareas = [];
  constructor(nombre, limiteWip = null) {
    // 1 · nombre: texto no vacío (sin espacios a los lados) → si no, TypeError
    //     limiteWip: null (sin límite) o un entero ≥ 1 → si no, RangeError
    if (typeof(nombre)!=="string" || nombre.trim() === "") throw new TypeError("ERROR: El nombre introducido no es valido");
    else this.nombre = nombre.trim();
    
    if(limiteWip===null || (Number.isInteger(limiteWip) && limiteWip>=1)) this.limiteWip = limiteWip;
    else throw new RangeError("ERROR: El limiteWip introducido no es válido");
  }

  // 2 · get llena: true si hay límite y ya hay tantas tareas como el límite
  get llena(){
    if (this.limiteWip !== null && this.#tareas.length >= this.limiteWip){
      return true;
    } 
    return false;
  }
  // 3 · get tareas: una COPIA del array (que nadie pueda tocar el tuyo desde fuera)
  get tareas(){
    return [...this.#tareas];
  }
  // 4 · añadir(tarea): TypeError si no es instanceof Tarea · Error («… está llena …») si está
  //     llena · si no, la guarda y la devuelve
  añadir(tarea){
    if(!(tarea instanceof Tarea)) throw new TypeError("ERROR: tarea no es una Tarea")
    if(this.llena)throw new Error("ERROR: La columna está llena ")
    this.#tareas.push(tarea);
    return tarea; 
  }
  // 5 · quitar(id): la saca del array y la devuelve · Error («… no está …») si no la encuentra
  //     Pista: findIndex + splice
  quitar(id){
    if(this.#tareas.some((tarea) => tarea.id===id)){
      const posicionTareaEncontada = this.#tareas.findIndex((tarea) => tarea.id === id)
      return this.#tareas.splice(posicionTareaEncontada, 1)[0]
    }
    throw new Error(`ERROR: La tarea con el id: ${id} no está`)
    
  }
  // 6 · tiene(id): true / false. Pista: some
  tiene(id){
    return this.#tareas.some((tarea) => tarea.id===id)
  }
  // 7 · ordenadas(): un array NUEVO ordenado: primero prioridad alta (usa t.peso), y a igual
  //     prioridad, el límite más cercano; las que no tienen límite, al final.
  //     Pista: [...this.#tareas].sort((a, b) => …) — ¿por qué la copia?
  ordenadas(){
    const arrayOrdenado = [...this.#tareas].sort((a, b) => {
      if (b.peso !== a.peso) return b.peso - a.peso 
      if (a.limite === null && b.limite === null) return 0; //Empate | 0 hace que los 2 tengan la misma importancia
      if (a.limite === null) return 1; //Gana B | Positivo gana 2 valor recogido
      if (b.limite === null) return -1; //Gana A | Negativo gana 1 valor recogido
      return a.limite - b.limite; //Si ninguna de las condiciones de kas fechas se cumplen entonces 
                                  //que se ordene de menor a mayor (mas cercanaa a mas lejana)      
    }) 
    return arrayOrdenado
  }
}

// Comprueba con:  docker compose run --rm web npm test 3-columna
void Tarea; // (borra esta línea cuando uses Tarea)
