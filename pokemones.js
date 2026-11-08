export const pokemones = [
  { numero: "001", nombre: "Bulbasaur", tipos: ["Planta", "Veneno"] },
  { numero: "002", nombre: "Ivysaur", tipos: ["Planta", "Veneno"] },
  { numero: "003", nombre: "Venusaur", tipos: ["Planta", "Veneno"] },
  { numero: "004", nombre: "Charmander", tipos: ["Fuego"] },
  { numero: "005", nombre: "Charmeleon", tipos: ["Fuego"] },
  { numero: "006", nombre: "Charizard", tipos: ["Fuego", "Volador"] },
  { numero: "007", nombre: "Squirtle", tipos: ["Agua"] },
  { numero: "008", nombre: "Wartortle", tipos: ["Agua"] },
  { numero: "009", nombre: "Blastoise", tipos: ["Agua"] },
  { numero: "025", nombre: "Pikachu", tipos: ["Eléctrico"] }
];

export function buscarPokemon(numero) {
  return pokemones.find(pokemon => pokemon.numero === numero);
}

export function nombreArchivo(pokemon) {
  return pokemon.nombre.toLowerCase();
}

export function claseTipo(tipo) {
  // normalize("NFD") separa la tilde de la letra y el replace la elimina
  return tipo.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
