import React, { useEffect, useState } from "react";
import { getPokemons, getPokemonDetail, getPokemonByName } from "./services/pokeApi.js";
import PokemonCard from "./componentes/PokemonCard.jsx";
import PokemonModal from "./componentes/PokemonModal.jsx";
import TeamPanel from "./componentes/TeamPanel.jsx";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [team, setTeam] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPokemons();
  }, []);

  const loadPokemons = async () => {
    const list = await getPokemons(50);
    const detailed = await Promise.all(
      list.map((p) => getPokemonDetail(p.url))
    );
    setPokemons(detailed);
  };

  const handleSearch = async () => {
    if (!search) return loadPokemons();
    try {
      const pokemon = await getPokemonByName(search.toLowerCase());
      setPokemons([pokemon]);
    } catch {
      alert("Pokemon no encontrado");
    }
  };

  const addToTeam = (pokemon) => {
    if (team.find((p) => p.id === pokemon.id)) {
      return alert("Este pokemon ya está en el equipo");
    }

    if (team.length >= 6) {
      return alert("El equipo ya está lleno");
    }

    setTeam([...team, pokemon]);
  };

  const removePokemon = (id) => {
    setTeam(team.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 bg-gray-20 min-h-screen center ">
      <h1 className="text-3xl font-bold text-center mb-6">
        PokeAPI 
      </h1>
      <h6 className="text-1 font-bold text-center mb-1">AUTORES: Hernan Laime  </h6>
      <h6 className="text-1 font-bold text-center mb-1">Danilo Aramayo  </h6>

      <div className="flex justify-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Buscar pokemon..."
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-purple-600 text-white px-4 rounded"
        >
          Buscar
        </button>
      </div>

      <TeamPanel team={team} removePokemon={removePokemon} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
        {pokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onDetail={setSelectedPokemon}
            onAdd={addToTeam}
          />
        ))}
      </div>

      <PokemonModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    </div>
  );
}

export default App;