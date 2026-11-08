// =============================================================
//  perfil-entrenador.js  —  Muestra en el perfil los Pokémon
//  que la persona capturó desde la lista (leídos de localStorage)
//  y conecta Capturados con Favoritos y con el Equipo.
//  Los diálogos (modales) se abren solos con command/commandfor;
//  este archivo llena el contenido y maneja los eventos.
// =============================================================
import { buscarPorId, numeroPokedex } from './datos.js';
import { listaCapturados } from './capturados.js';
import { esFavorito, alternarFavorito, agregarFavoritos, quitarFavorito } from './favoritos.js';
import { agregarAlEquipo, quitarDelEquipo, MAXIMO_EQUIPO } from './equipo.js';
import { pintarFavoritos } from './perfil-favoritos.js';
import { pintarEquipo } from './perfil-equipo.js';
import { pintarMiniSprites, ponerDetalle } from './perfil-comun.js';

const modalCapturados = document.querySelector('#modal-capturados');
const grilla = modalCapturados.querySelector('.capturados');
const aviso = modalCapturados.querySelector('.modal__aviso');
const botonFavorito = modalCapturados.querySelector('#marcar-favorito');
const botonEquipo = modalCapturados.querySelector('#agregar-equipo');


// ---------- Capturados ----------

function pintarCapturados() {
  // Convierte los ids guardados en fichas completas (y descarta ids raros)
  const capturados = listaCapturados()
    .map(buscarPorId)
    .filter(Boolean)
    .sort((a, b) => a.id - b.id);

  // 1) Resumen de la tarjeta de sección: el número y los mini-sprites
  ponerDetalle('capturados', `${capturados.length} Pokémon en tu colección`);
  pintarMiniSprites('capturados', capturados);

  // 2) Grilla dentro del diálogo "Pokémon capturados".
  //    Cada tarjeta tiene dos casillas: la de selección (para los botones
  //    del pie) y la estrella, que marca o desmarca favorito directamente.
  if (capturados.length === 0) {
    grilla.innerHTML = '<li class="capturados__vacio lista-vacia">Todavía no capturaste ninguno. Entrá a la Pokédex y tocá “Capturar”.</li>';
  } else {
    grilla.innerHTML = capturados.map((p) => `
      <li class="captura">
        <input type="checkbox" class="captura__check" id="cap-${p.id}" value="${p.id}" aria-label="Seleccionar a ${p.nombre}">
        <input type="checkbox" class="captura__fav" value="${p.id}" aria-label="Favorito: ${p.nombre}"${esFavorito(p.id) ? ' checked' : ''}>
        <label class="captura__cuerpo" for="cap-${p.id}">
          <span class="sprite-zona"><img src="assets/${p.slug}.png" alt="" width="96" height="96"></span>
          <span class="numero">${numeroPokedex(p.id)}</span>
          <span class="captura__nombre">${p.nombre}</span>
        </label>
      </li>`).join('');
  }

  const deshabilitar = capturados.length === 0;
  botonFavorito.disabled = deshabilitar;
  botonEquipo.disabled = deshabilitar;
}

// Ids de las tarjetas con la casilla de selección marcada
function seleccionados() {
  return [...grilla.querySelectorAll('.captura__check:checked')]
    .map((casilla) => Number(casilla.value));
}

function limpiarSeleccion() {
  grilla.querySelectorAll('.captura__check').forEach((casilla) => {
    casilla.checked = false;
  });
}

// Pone cada estrella de Capturados igual a lo guardado en favoritos
function sincronizarEstrellas() {
  grilla.querySelectorAll('.captura__fav').forEach((estrella) => {
    estrella.checked = esFavorito(Number(estrella.value));
  });
}

function avisar(texto) {
  aviso.textContent = texto;
}


// ---------- Acciones del pie de Capturados ----------

function marcarFavoritos() {
  const ids = seleccionados();
  if (ids.length === 0) {
    avisar('Seleccioná al menos un Pokémon para marcarlo como favorito.');
    return;
  }

  const nuevos = agregarFavoritos(ids);
  pintarFavoritos();
  sincronizarEstrellas();
  limpiarSeleccion();

  if (nuevos === 0) {
    avisar('Los Pokémon seleccionados ya estaban en favoritos.');
  } else {
    avisar(nuevos === 1
      ? 'Se marcó 1 Pokémon como favorito.'
      : `Se marcaron ${nuevos} Pokémon como favoritos.`);
  }
}

function agregarEquipo() {
  const ids = seleccionados();
  if (ids.length === 0) {
    avisar('Seleccioná al menos un Pokémon para agregarlo al equipo.');
    return;
  }

  const { agregados, rechazados } = agregarAlEquipo(ids);
  pintarEquipo();
  limpiarSeleccion();

  if (rechazados > 0) {
    const noEntraron = rechazados === 1
      ? '1 Pokémon no se agregó'
      : `${rechazados} Pokémon no se agregaron`;
    avisar(`El equipo ya tiene ${MAXIMO_EQUIPO} Pokémon: ${noEntraron}.`);
  } else if (agregados > 0) {
    avisar(agregados === 1
      ? 'Se agregó 1 Pokémon al equipo.'
      : `Se agregaron ${agregados} Pokémon al equipo.`);
  } else {
    avisar('Los Pokémon seleccionados ya estaban en el equipo.');
  }
}


// ---------- Eventos ----------
// Las listas se vuelven a pintar seguido, así que se escucha en el
// contenedor (delegación de eventos) y no en cada tarjeta.

grilla.addEventListener('change', (evento) => {
  const casilla = evento.target;
  if (casilla.matches('.captura__fav')) {
    const id = Number(casilla.value);
    const ahora = alternarFavorito(id);
    pintarFavoritos();
    avisar(`${buscarPorId(id).nombre} ${ahora ? 'se marcó como favorito' : 'se quitó de favoritos'}.`);
  } else {
    avisar('');   // cambió la selección: el aviso anterior ya no aplica
  }
});

botonFavorito.addEventListener('click', marcarFavoritos);
botonEquipo.addEventListener('click', agregarEquipo);

// Al cerrar Capturados se reinicia la selección y el aviso
modalCapturados.addEventListener('close', () => {
  limpiarSeleccion();
  avisar('');
});

document.querySelector('#modal-favoritos .favoritos').addEventListener('click', (evento) => {
  const boton = evento.target.closest('[data-quitar-favorito]');
  if (!boton) return;
  quitarFavorito(Number(boton.dataset.quitarFavorito));
  pintarFavoritos();
  sincronizarEstrellas();
});

document.querySelector('#modal-equipo .equipo').addEventListener('click', (evento) => {
  const boton = evento.target.closest('[data-quitar-equipo]');
  if (!boton) return;
  quitarDelEquipo(Number(boton.dataset.quitarEquipo));
  pintarEquipo();
});


pintarCapturados();
pintarFavoritos();
pintarEquipo();
