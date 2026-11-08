// =============================================================
//  perfil-comun.js  —  Piezas de HTML que comparten las secciones
//  del perfil (Capturados, Favoritos y Equipo).
// =============================================================

// Los tipos se guardan sin tilde en datos.js; acá se ponen como se leen.
const NOMBRES_TIPO = { electrico: 'Eléctrico' };

export function nombreTipo(tipo) {
  return NOMBRES_TIPO[tipo] ?? tipo.charAt(0).toUpperCase() + tipo.slice(1);
}

// Las "pastillas" de tipo de un Pokémon
export function chipsTipos(pokemon) {
  return pokemon.tipos
    .map((tipo) => `<span class="tipo tipo--${tipo}">${nombreTipo(tipo)}</span>`)
    .join('');
}

// Mini-sprites de la tarjeta de sección: los tres primeros y un "+N" si hay más.
// seccion es el final de la clase: 'capturados', 'favoritos' o 'equipo'.
export function pintarMiniSprites(seccion, pokemones) {
  const mini = document.querySelector(`.seccion--${seccion} .mini-sprites`);
  if (!mini) return;

  const primeros = pokemones.slice(0, 3)
    .map((p) => `<li><img src="assets/${p.slug}.png" alt="" width="34" height="34"></li>`)
    .join('');
  const resto = pokemones.length > 3
    ? `<li class="mini-sprites__mas">+${pokemones.length - 3}</li>` : '';
  mini.innerHTML = primeros + resto;
}

// Texto del detalle de una tarjeta de sección
export function ponerDetalle(seccion, texto) {
  const detalle = document.querySelector(`.seccion--${seccion} .seccion__detalle`);
  if (detalle) detalle.textContent = texto;
}
