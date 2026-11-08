// =============================================================
//  perfil-favoritos.js  —  Pinta los favoritos en el perfil:
//  la tarjeta de sección (número + mini-sprites) y el diálogo.
//  Todo se arma recorriendo los datos; no hay fichas escritas a mano.
// =============================================================
import { buscarPorId, numeroPokedex } from './datos.js';
import { listaFavoritos } from './favoritos.js';
import { chipsTipos, pintarMiniSprites, ponerDetalle } from './perfil-comun.js';

function crearFicha(p) {
  return `
    <li class="favorito">
      <span class="favorito__estrella"><svg class="icono icono--fav" aria-hidden="true" width="24" height="24"><use href="#i-star"/></svg></span>
      <div class="sprite-zona sprite-zona--chica"><img src="assets/${p.slug}.png" alt="" width="64" height="64"></div>
      <div class="favorito__datos">
        <h3>${p.nombre} <span class="numero">${numeroPokedex(p.id)}</span></h3>
        <span class="tipos">${chipsTipos(p)}</span>
      </div>
      <div class="favorito__acciones">
        <a class="boton boton--borde-azul boton--chico" href="detalle.html?id=${p.id}">Ver detalle <svg class="icono " aria-hidden="true" width="24" height="24"><use href="#i-arrow"/></svg></a>
        <button type="button" class="boton boton--borde-rojo boton--chico" data-quitar-favorito="${p.id}">Quitar de favoritos<span class="solo-lectores">: ${p.nombre}</span></button>
      </div>
    </li>`;
}

export function pintarFavoritos() {
  const favoritos = listaFavoritos()
    .map(buscarPorId)
    .filter(Boolean)
    .sort((a, b) => a.id - b.id);

  const marcados = favoritos.length === 1
    ? '1 Pokémon marcado'
    : `${favoritos.length} Pokémon marcados`;

  // 1) Tarjeta de sección
  ponerDetalle('favoritos', marcados);
  pintarMiniSprites('favoritos', favoritos);

  // 2) Diálogo
  const subtitulo = document.querySelector('#modal-favoritos .modal__subtitulo');
  if (subtitulo) subtitulo.textContent = `${marcados} como favoritos`;

  const lista = document.querySelector('#modal-favoritos .favoritos');
  if (!lista) return;

  lista.innerHTML = favoritos.length === 0
    ? '<li class="lista-vacia">Todavía no marcaste favoritos. Abrí Capturados, tocá la estrella de un Pokémon o seleccioná varios y tocá “Marcar favorito”.</li>'
    : favoritos.map(crearFicha).join('');
}
