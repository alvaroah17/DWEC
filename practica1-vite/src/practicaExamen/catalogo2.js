export const CATALOGO = Object.freeze([
  Object.freeze({ id: 1, titulo: "Tetris", plataforma: "Game Boy", precio: 20, stock: 5 }),
  Object.freeze({ id: 2, titulo: "Zelda", plataforma: "SNES", precio: 50, stock: 2 }),
  Object.freeze({ id: 3, titulo: "Sonic 2", plataforma: "Mega Drive", precio: 30, stock: 0 }),
  Object.freeze({ id: 4, titulo: "Crash Bandicoot", plataforma: "PS1", precio: 40, stock: 8 }),
  Object.freeze({ id: 5, titulo: "Pokémon Rojo", precio: 25 }) // ⚠️ Trampa: Sin plataforma ni stock
]);

export const VENTAS = [
  { titulo: "Tetris", unidades: 2, total: 40 },
  { titulo: "Zelda", unidades: 1, total: 50 },
  { titulo: "Crash Bandicoot", unidades: 4, total: 90 }
];

export const redondear = (n) => Math.round(n * 100) / 100;