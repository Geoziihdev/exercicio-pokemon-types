// src/pages/api/pokemons.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { calculateWeaknesses } from '../../../src/pokemonData';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
    const pokemons = response.data.results;

    const pokemonsWithDetails = await Promise.all(pokemons.map(async (pokemon: any) => {
      const detailsResponse = await axios.get(pokemon.url);
      const types = detailsResponse.data.types.map((t: any) => t.type.name);
      const weaknesses = calculateWeaknesses(types); // Calcula as fraquezas

      return {
        name: detailsResponse.data.name,
        types,
        weakness: weaknesses,
      };
    }));

    res.status(200).json(pokemonsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar Pokémon' });
  }
}
