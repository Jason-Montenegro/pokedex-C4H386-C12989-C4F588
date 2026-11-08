// =============================================================
//  favoritos.js  —  Guarda en localStorage los Pokémon marcados
//  como favoritos. Sigue el mismo patrón que capturados.js:
//  solo datos, nada de HTML.
// =============================================================
import { buscarPorId } from './datos.js';

const CLAVE = 'pokedex:favoritos';

// Lee del localStorage y devuelve un Set de ids (sin repetidos ni ids raros).
function leer() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE)) ?? [];
    return new Set(guardado.filter((id) => buscarPorId(id)));
  } catch {
    return new Set();   // si algo falla (modo privado, dato dañado), arrancamos vacío
  }
}

// Guarda el Set en localStorage (como texto JSON).
function escribir(conjunto) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify([...conjunto]));
  } catch { /* si no se puede guardar, seguimos sin romper */ }
}

export function esFavorito(id) {
  return leer().has(id);
}

export function listaFavoritos() {
  return [...leer()];
}

// Si estaba, lo quita; si no, lo agrega. Devuelve el estado nuevo (true = favorito).
export function alternarFavorito(id) {
  const favoritos = leer();
  if (favoritos.has(id)) {
    favoritos.delete(id);
  } else {
    favoritos.add(id);
  }
  escribir(favoritos);
  return favoritos.has(id);
}

// Agrega varios a la vez (los seleccionados en Capturados).
// Devuelve cuántos eran nuevos.
export function agregarFavoritos(ids) {
  const favoritos = leer();
  const antes = favoritos.size;
  ids.forEach((id) => favoritos.add(id));
  escribir(favoritos);
  return favoritos.size - antes;
}

export function quitarFavorito(id) {
  const favoritos = leer();
  favoritos.delete(id);
  escribir(favoritos);
}
