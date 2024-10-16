// src/pokemonData.ts
export const typeChart: Record<string, string[]> = {
  electric: ["ground"],
  ground: ["water", "ice", "grass"],
  dragon: ["ice", "fairy", "dragon"],
  fire: ["water", "rock", "ground"],
  water: ["electric", "grass"],
  grass: ["fire", "ice", "flying", "bug"],
};

// Função para calcular fraquezas
export function calculateWeaknesses(types: string[]): string[] {
  const weaknesses: string[] = [];
  types.forEach((type) => {
    if (typeChart[type]) {
      weaknesses.push(...typeChart[type]);
    }
  });
  return [...new Set(weaknesses)]; // Remove duplicatas
}
