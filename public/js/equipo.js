// =============================================================
//  equipo.js  —  Guarda en localStorage el equipo Pokémon
//  (máximo seis). Mismo patrón que capturados.js: solo datos.
//  Se usa un arreglo y no un Set porque el orden del equipo importa.
// =============================================================
import { buscarPorId } from './datos.js';

const CLAVE = 'pokedex:equipo';
export const MAXIMO_EQUIPO = 6;

// Lee del localStorage: descarta ids raros o repetidos y respeta el máximo.
function leer() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE)) ?? [];
    return [...new Set(guardado)]
      .filter((id) => buscarPorId(id))
      .slice(0, MAXIMO_EQUIPO);
  } catch {
    return [];
  }
}

function escribir(equipo) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(equipo));
  } catch { /* si no se puede guardar, seguimos sin romper */ }
}

export function listaEquipo() {
  return leer();
}

// Agrega los ids recibidos sin repetir y sin pasar del máximo.
// Devuelve cuántos entraron, cuántos ya estaban y cuántos no cupieron.
export function agregarAlEquipo(ids) {
  const equipo = leer();
  let agregados = 0;
  let repetidos = 0;
  let rechazados = 0;

  ids.forEach((id) => {
    if (equipo.includes(id)) {
      repetidos++;
    } else if (equipo.length < MAXIMO_EQUIPO) {
      equipo.push(id);
      agregados++;
    } else {
      rechazados++;
    }
  });

  escribir(equipo);
  return { agregados, repetidos, rechazados };
}

export function quitarDelEquipo(id) {
  escribir(leer().filter((otro) => otro !== id));
}
