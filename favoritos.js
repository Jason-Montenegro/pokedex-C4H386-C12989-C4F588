// Datos de los Pokémon que aparecen en Capturados.
import { pokemones } from "./pokemones.js";

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

const modalFavoritos = document.querySelector("#modal-favoritos");
const modalCapturados = document.querySelector("#modal-capturados");
const listaFavoritos = document.querySelector(".favorites-modal__list");
const resumenFavoritos = document.querySelector(".favorites-modal__summary");
const contadorFavoritos = document.querySelector(".favorites-pokemon .card-pokemon__title p");
const vistaPrevia = document.querySelector(".favorites-pokemon__preview");
const mensajeVacio = document.querySelector(".favorites-modal__empty");

function guardarFavoritos() {
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function mostrarFavoritos() {
  listaFavoritos.innerHTML = "";
  vistaPrevia.innerHTML = "";

  const cantidad = favoritos.length;
  const texto = cantidad === 1 ? "Pokémon marcado" : "Pokémon marcados";
  contadorFavoritos.textContent = `${cantidad} ${texto}`;
  resumenFavoritos.textContent = `${cantidad} ${texto} como favoritos`;
  mensajeVacio.hidden = cantidad > 0;

  favoritos.forEach(numero => {
    const pokemon = pokemones.find(p => p.numero === numero);
    if (!pokemon) return;

    const nombreArchivo = pokemon.nombre.toLowerCase();
    const tipos = pokemon.tipos.map(tipo => {
      const clase = tipo.toLowerCase().replace("é", "e");
      return `<li class="favorites-modal__type favorites-modal__type--${clase}">${tipo}</li>`;
    }).join("");

    const elemento = document.createElement("li");
    elemento.innerHTML = `
      <article class="favorites-modal__item">
        <section class="favorites-modal__pokemon-info">
          <span class="favorites-modal__favorite-mark" aria-hidden="true"></span>
          <span class="favorites-modal__sprite-box">
            <img class="favorites-modal__pokemon-image" src="assets/${nombreArchivo}.png"
              alt="${pokemon.nombre}" width="56" height="56">
          </span>
          <div class="favorites-modal__pokemon-data">
            <div class="favorites-modal__name-row">
              <h3 class="favorites-modal__pokemon-name">${pokemon.nombre}</h3>
              <span class="favorites-modal__number">#${pokemon.numero}</span>
            </div>
            <ul class="favorites-modal__types" aria-label="Tipos">${tipos}</ul>
          </div>
        </section>
        <div class="favorites-modal__actions">
          <a class="favorites-modal__detail" href="detalle-pokemon-${nombreArchivo}.html">Ver detalle</a>
          <button class="favorites-modal__remove" type="button"
            aria-label="Quitar a ${pokemon.nombre} de favoritos">Quitar de favoritos</button>
        </div>
      </article>`;

    elemento.querySelector(".favorites-modal__remove").addEventListener("click", () => {
      favoritos = favoritos.filter(id => id !== numero);
      guardarFavoritos();
      mostrarFavoritos();
    });
    listaFavoritos.appendChild(elemento);

    const imagen = document.createElement("img");
    imagen.src = `assets/${nombreArchivo}.png`;
    imagen.alt = pokemon.nombre;
    vistaPrevia.appendChild(imagen);
  });
}

document.querySelector("#marcar-favoritos").addEventListener("click", () => {
  const seleccionados = modalCapturados.querySelectorAll('input[name="capturados"]:checked');

  seleccionados.forEach(casilla => {
    if (!favoritos.includes(casilla.value)) {
      favoritos.push(casilla.value);
    }
  });

  guardarFavoritos();
  mostrarFavoritos();
});

document.querySelector(".favorites-modal__add").addEventListener("click", () => {
  modalFavoritos.close();
  modalCapturados.showModal();
});

mostrarFavoritos();
