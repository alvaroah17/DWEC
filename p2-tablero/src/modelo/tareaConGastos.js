import { Tarea } from "./Tarea.js"; //
import { PresupuestoSuperadoError } from "./errores.js"; 

export class TareaConGastos extends Tarea { 
  #presupuesto; 
  #gastos = []; 

  constructor(titulo, prioridad, limite, presupuesto) { 
    if(!Number.isInteger(presupuesto) || presupuesto<1) throw new RangeError("ERROR: El presupuesto introducido no es válido"); 
    super(titulo, prioridad, limite); 

    this.#presupuesto = presupuesto;
  } 

  get presupuesto(){ 
    return this.#presupuesto; 
  } 


  get gastos(){ 
    const copiaGastos = this.#gastos.map((gasto) => { 
      return { concepto: gasto.concepto, importe: gasto.importe }; 
    }); 
    return copiaGastos; 
  } 

  gastar(concepto, importe){ 
    if(!Number.isInteger(importe) || importe<1) throw new RangeError("ERROR: El importe introducido no es válido"); 

    const conceptoRepetido = this.#gastos.some((gasto) => gasto.concepto === concepto); 
    if(conceptoRepetido) throw new RangeError(`ERROR: Ya hay un gasto con el concepto: ${concepto}`); 

    this.#gastos.push({ concepto: concepto, importe: importe }); 
  }

}