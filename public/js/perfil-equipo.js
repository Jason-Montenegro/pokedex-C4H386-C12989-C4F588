// =============================================================
//  perfil-equipo.js  —  Pinta el equipo en el perfil: la tarjeta
//  de sección (espacios ocupados + mini-sprites) y el diálogo con
//  las fichas y los espacios libres. Todo sale de los datos.
// =============================================================
import { buscarPorId, numeroPokedex } from './datos.js';
import { listaEquipo, MAXIMO_EQUIPO } from './equipo.js';
import { chipsTipos, pintarMiniSprites, ponerDetalle } from './perfil-comun.js';

function crearFicha(p) {
  return `
    <li class="equipo__ficha">
      <div class="sprite-zona"><span class="numero">${numeroPokedex(p.id)}</span><img src="assets/${p.slug}.png" alt="" width="96" height="96"></div>
      <h3>${p.nombre}</h3>
      <span class="tipos">${chipsTipos(p)}</span>
      <button type="button" class="boton boton--borde-rojo boton--chico" data-quitar-equipo="${p.id}"><svg class="icono " aria-hidden="true" width="24" height="24"><use href="#i-minus"/></svg> Quitar<span class="solo-lectores"> a ${p.nombre} del equipo</span></button>
    </li>`;
}

// El espacio libre es un botón: abre Capturados (con command/commandfor,
// igual que "Agregar desde capturados") para elegir quién lo ocupa.
function crearEspacioLibre() {
  return `
    <li>
      <button type="button" class="equipo__libre" command="show-modal" commandfor="modal-capturados">
        <span class="equipo__mas"><svg class="icono " aria-hidden="true" width="24" height="24"><use href="#i-plus"/></svg></span>
        Espacio libre<span class="solo-lectores">: agregar un Pokémon desde capturados</span>
      </button>
    </li>`;
}

export function pintarEquipo() {
  const equipo = listaEquipo().map(buscarPorId).filter(Boolean);
  const ocupados = equipo.length;
  const libres = MAXIMO_EQUIPO - ocupados;

  const textoOcupados = `${ocupados} de ${MAXIMO_EQUIPO} espacios ocupados`;
  const textoLibres = libres === 1 ? '1 espacio disponible' : `${libres} espacios disponibles`;

  // 1) Tarjeta de sección
  ponerDetalle('equipo', textoOcupados);
  pintarMiniSprites('equipo', equipo);

  // 2) Diálogo: subtítulo con ocupados y disponibles
  const subtitulo = document.querySelector('#modal-equipo .modal__subtitulo');
  if (subtitulo) {
    subtitulo.innerHTML = `<span>${textoOcupados}</span><span>${textoLibres}</span>`;
  }

  const lista = document.querySelector('#modal-equipo .equipo');
  if (!lista) return;

  if (ocupados === 0) {
    lista.innerHTML = '<li class="lista-vacia">Todavía no tenés Pokémon en tu equipo. Abrí Capturados, seleccioná algunos y tocá “Agregar al equipo”.</li>';
  } else {
    lista.innerHTML = equipo.map(crearFicha).join('')
      + Array.from({ length: libres }, crearEspacioLibre).join('');
  }
}
