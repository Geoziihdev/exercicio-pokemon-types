// app/pokemons/page.tsx
"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Pokemon {
  name: string;
  types: string[];
  weaknesses: string[];
}

const typeWeaknesses: { [key: string]: string[] } = {
  fire: ['water', 'rock', 'ground'],
  water: ['electric', 'grass'],
  grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
  electric: ['ground'],
  ground: ['water', 'grass', 'ice'],
  // Adicione outros tipos e suas fraquezas conforme necessário
};

const PokemonsPage = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20');
        const pokemonsWithDetails = await Promise.all(
          response.data.results.map(async (pokemon: { name: string; url: string }) => {
            const detailsResponse = await axios.get(pokemon.url);
            const types = detailsResponse.data.types.map((type: { type: { name: string } }) => type.type.name);
            const weaknesses = getWeaknesses(types);
            return {
              name: detailsResponse.data.name,
              types,
              weaknesses,
            };
          })
        );
        setPokemons(pokemonsWithDetails);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchPokemons();
  }, []);

  const getWeaknesses = (types: string[]) => {
    const weaknesses = new Set<string>();
    types.forEach(type => {
      if (typeWeaknesses[type]) {
        typeWeaknesses[type].forEach(weakness => weaknesses.add(weakness));
      }
    });
    return Array.from(weaknesses);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center text-blue-600">Pokémon Weaknesses</h1>
      {error && <div className="text-red-500">{error}</div>}
      <table className="min-w-full border-collapse border border-gray-200 mt-4">
        <thead>
          <tr className="bg-blue-100">
            <th className="border border-gray-300 p-2 text-left">Pokémon</th>
            <th className="border border-gray-300 p-2 text-left">Types</th>
            <th className="border border-gray-300 p-2 text-left">Weaknesses</th>
          </tr>
        </thead>
        <tbody>
          {pokemons.map(pokemon => (
            <tr key={pokemon.name} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2 flex items-center">
                <img 
                  src={`https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`}
                  alt={pokemon.name}
                  className="w-12 h-12 mr-2"
                />
                {pokemon.name}
              </td>
              <td className="border border-gray-300 p-2">{pokemon.types.join(', ')}</td>
              <td className="border border-gray-300 p-2">
                {pokemon.weaknesses.map((weakness, index) => (
                  <span key={index} className={`inline-block px-2 py-1 rounded-full text-white ${getWeaknessColor(weakness)}`}>
                    {weakness}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const getWeaknessColor = (weakness: string) => {
  switch (weakness) {
    case 'ground': return 'bg-yellow-500';
    case 'water': return 'bg-blue-500';
    case 'ice': return 'bg-blue-300';
    case 'grass': return 'bg-green-500';
    case 'dragon': return 'bg-purple-500';
    case 'fairy': return 'bg-pink-500';
    default: return 'bg-gray-500';
  }
};

export default PokemonsPage;

