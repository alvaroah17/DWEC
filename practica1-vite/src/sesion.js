// CLOSURE: "ventasHechas" solo existe dentro de esta función.
// Desde fuera nadie puede tocarla directamente, solo con sumar() y total()
export function crearContadorVentas() {
  let ventasHechas = 0;

  return {
    sumar() {
      ventasHechas = ventasHechas + 1;
    },
    total() {
      return ventasHechas;
    },
  };
}