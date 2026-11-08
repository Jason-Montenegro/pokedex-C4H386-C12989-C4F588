// se guarda en localStorage los números de los Pokémon del equipo (máximo 6)
// y arma a partir de esos datos el modal de equipo y la tarjeta del perfil
import { buscarPokemon, nombreArchivo, claseTipo } from "./pokemones.js";

const CLAVE_EQUIPO = "equipo";
const MAXIMO_EQUIPO = 6;

let equipo = cargarEquipo();

const modalEquipo = document.querySelector("#team-pokemon-modal");
const modalCapturados = document.querySelector("#modal-capturados");
const gridEquipo = modalEquipo.querySelector(".team-modal__grid");
const resumenEquipo = modalEquipo.querySelector(".team-modal__summary");
const mensajeVacio = modalEquipo.querySelector(".team-modal__empty");
const contadorEquipo = document.querySelector(".team-pokemon .card-pokemon__title p");
const vistaPrevia = document.querySelector(".team-pokemon__preview");
const espaciosDisponibles = document.querySelector(".team-pokemon__available");
const avisoEquipo = document.querySelector("#aviso-equipo");

function cargarEquipo() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_EQUIPO));
    // se descartan valores que no sean números de Pokémon conocidos
    // y se respeta el máximo de tamanio de equipo
    return Array.isArray(guardado)
      ? guardado.filter(numero => buscarPokemon(numero)).slice(0, MAXIMO_EQUIPO)
      : [];
  } catch {
    return [];
  }
}

function guardarEquipo() {
  localStorage.setItem(CLAVE_EQUIPO, JSON.stringify(equipo));
}

// agrega los números recibidos al equipo sin repetir y sin pasar del maximo de equipo
export function agregarAlEquipo(numeros) {
  let agregados = 0;
  let rechazados = 0;

  numeros.forEach(numero => {
    if (equipo.includes(numero) || !buscarPokemon(numero)) return;

    if (equipo.length < MAXIMO_EQUIPO) {
      equipo.push(numero);
      agregados++;
    } else {
      rechazados++;
    }
  });

  guardarEquipo();
  mostrarEquipo();
  return { agregados, rechazados };
}

export function quitarDelEquipo(numero) {
  equipo = equipo.filter(id => id !== numero);
  guardarEquipo();
  mostrarEquipo();
}

function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto) elemento.textContent = texto;
  return elemento;
}

function crearFicha(pokemon) {
  const ficha = crearElemento("li", "team-modal__card");

  ficha.appendChild(crearElemento("span", "team-modal__number", `#${pokemon.numero}`));

  const imagen = crearElemento("img", "team-modal__pokemon");
  imagen.src = `assets/${nombreArchivo(pokemon)}-grande.png`;
  imagen.alt = pokemon.nombre;
  imagen.width = 96;
  imagen.height = 96;
  ficha.appendChild(imagen);

  ficha.appendChild(crearElemento("h3", "team-modal__pokemon-name", pokemon.nombre));

  const tipos = crearElemento("ul", "team-modal__types");
  tipos.setAttribute("aria-label", "Tipos");
  pokemon.tipos.forEach(tipo => {
    tipos.appendChild(
      crearElemento("li", `team-modal__type team-modal__type--${claseTipo(tipo)}`, tipo)
    );
  });
  ficha.appendChild(tipos);

  const quitar = crearElemento("button", "team-modal__remove", "Quitar");
  quitar.type = "button";
  quitar.setAttribute("aria-label", `Quitar a ${pokemon.nombre} del equipo`);
  quitar.addEventListener("click", () => quitarDelEquipo(pokemon.numero));
  ficha.appendChild(quitar);

  return ficha;
}

function crearEspacioLibre() {
  const ficha = crearElemento("li", "team-modal__card team-modal__card--empty");
  const boton = crearElemento("button", "team-modal__add-empty");
  boton.type = "button";
  boton.setAttribute("aria-label", "Agregar un Pokémon al espacio libre");
  boton.appendChild(crearElemento("span", "", "Espacio libre"));
  boton.addEventListener("click", abrirCapturados);
  ficha.appendChild(boton);
  return ficha;
}

function crearImagenPrevia(pokemon) {
  const item = document.createElement("li");
  const imagen = document.createElement("img");
  imagen.src = `assets/${nombreArchivo(pokemon)}.png`;
  imagen.alt = pokemon.nombre;
  imagen.width = 40;
  imagen.height = 40;
  item.appendChild(imagen);
  return item;
}

export function mostrarEquipo() {
  const pokemonesEquipo = equipo.map(buscarPokemon).filter(Boolean);
  const ocupados = pokemonesEquipo.length;
  const libres = MAXIMO_EQUIPO - ocupados;

  // textos con los conteos
  contadorEquipo.textContent = `${ocupados} de ${MAXIMO_EQUIPO} Pokémon ocupados`;
  resumenEquipo.textContent = `${ocupados} de ${MAXIMO_EQUIPO} espacios ocupados`;
  espaciosDisponibles.textContent = libres === 1
    ? "1 espacio disponible"
    : `${libres} espacios disponibles`;

  // mensaje de vacío, si no hay pokemon se esconde la cuadricula
  mensajeVacio.hidden = ocupados > 0;
  gridEquipo.hidden = ocupados === 0;

  // fichas del modal y espacios libres, armadas desde los datos
  gridEquipo.replaceChildren(
    ...pokemonesEquipo.map(crearFicha),
    ...Array.from({ length: libres }, crearEspacioLibre)
  );

  // vista previa en la tarjeta del perfil
  vistaPrevia.replaceChildren(...pokemonesEquipo.map(crearImagenPrevia));
  vistaPrevia.hidden = ocupados === 0;
}

function avisar(texto) {
  avisoEquipo.textContent = texto;
}

function abrirCapturados() {
  modalEquipo.close();
  modalCapturados.showModal();
}

document.querySelector("#agregar-equipo").addEventListener("click", () => {
  const seleccionados = [
    ...modalCapturados.querySelectorAll('input[name="capturados"]:checked')
  ].map(casilla => casilla.value);

  if (seleccionados.length === 0) {
    avisar("Seleccioná al menos un Pokémon para agregarlo al equipo.");
    return;
  }

  const { agregados, rechazados } = agregarAlEquipo(seleccionados);

  if (rechazados > 0) {
    avisar(`El equipo ya tiene ${MAXIMO_EQUIPO} Pokémon. ` +
      `${rechazados === 1 ? "1 Pokémon no se agregó" : `${rechazados} Pokémon no se agregaron`}.`);
  } else if (agregados > 0) {
    avisar(agregados === 1 ? "Se agregó 1 Pokémon al equipo." : `Se agregaron ${agregados} Pokémon al equipo.`);
  } else {
    avisar("Los Pokémon seleccionados ya están en el equipo.");
  }
});

// al cerrar Capturados se limpia el aviso para que no quede viejo
modalCapturados.addEventListener("close", () => avisar(""));

modalEquipo.querySelector(".team-modal__add").addEventListener("click", abrirCapturados);

mostrarEquipo();
