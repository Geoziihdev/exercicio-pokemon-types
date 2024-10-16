// app/api/pokemons/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios'; // Certifique-se de ter axios instalado
import { calculateWeaknesses, typeChart } from '../../../src/pokemonData'; // Ajuste o caminho se necessário

// Função que calcula as fraquezas de um Pokémon com base em seus tipos
const calculateWeakness = (types: string[]): string[] => {
  return calculateWeaknesses(types);
};

// Manipulador da rota GET da API
export async function GET() {
  try {
    // Fazendo a requisição para a PokeAPI para obter uma lista de Pokémon
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
    const pokemons = response.data.results;

    // Mapeando para incluir tipos e fraquezas de cada Pokémon
    const pokemonsWithDetails = await Promise.all(pokemons.map(async (pokemon: any) => {
      const detailsResponse = await axios.get(pokemon.url);
      const types = detailsResponse.data.types.map((t: any) => t.type.name); // Extrai os tipos do Pokémon
      const weaknesses = calculateWeakness(types); // Calcula as fraquezas usando a função definida

      return {
        name: detailsResponse.data.name,
        types,
        weakness: weaknesses,
      };
    }));

    return NextResponse.json(pokemonsWithDetails);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro ao buscar Pokémon' }, { status: 500 });
  }
}


/*Explicação dos Comentários
Importações: As importações são usadas para trazer funcionalidades e dados necessários.
Função calculateWeakness: Esta função calcula as fraquezas de cada Pokémon com base em seus tipos, usando um Set para evitar fraquezas duplicadas.
Manipulador da API: A função GET é chamada quando um cliente faz uma requisição GET para a rota. Ela mapeia todos os Pokémon e retorna suas fraquezas em um formato JSON.
*/