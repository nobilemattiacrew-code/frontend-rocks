import { useState, useEffect } from "react";
import { PokeAPI } from "./api";

type Props = {
  id: number;
  image: string;
  name: string;
  types: string[];
}

interface PokemonCard {
  id: number;
  image: string;
  name: string;
  types: string[];
}

function Card(props: Props) {
  return (
    <div className="w-64 p-4 rounded-xl border bg-white shadow-sm">
      <div className="text-sm text-gray-400 font-medium">
        #{props.id}
      </div>

      <div className="text-lg font-semibold mt-1">
        {props.name}
      </div>

      <img
        src={props.image}
        alt={props.name}
        className="w-32 h-32 mx-auto my-3 object-contain"
      />

      <div className="flex gap-2 justify-center">
        {props.types.map((type) => (
          <span
            key={type}
            className={`px-2 py-1 text-xs text-white rounded-md ${getTypeColor(type)}`}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}

async function fetchAllPokemons(): Promise<PokemonCard[]> {
  const list = await PokeAPI.listPokemons(0, 151);
  const pokemons = await Promise.all(
    list.results.map(async (item: { name: string; url: string }) => {
      const pokemon = await PokeAPI.getPokemonByName(item.name);
      return {
        id: pokemon.id,
        image: pokemon.sprites.other?.["official-artwork"].front_default ?? "",
        name: pokemon.name,
        types: pokemon.types.map((type) => type.type.name),
      };
    }),
  );

  return pokemons;
}

export function Root() {
  const [pokemons, setPokemons] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPokemons().then((data) => {
      setPokemons(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center text-2xl p-8">Caricamento Pokémon...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Tutti i Pokémon</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {pokemons.map((pokemon) => (
          <Card
            key={pokemon.id}
            id={pokemon.id}
            image={pokemon.image}
            name={pokemon.name}
            types={pokemon.types}
          />
        ))}
      </div>
    </div>
  );
}

function getTypeColor(type: string): string {
  return typeColors[type];
}

const typeColors: { [key: string]: string } = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  psychic: "bg-pink-500",
  ice: "bg-cyan-400",
  dragon: "bg-purple-700",
  dark: "bg-gray-700",
  fairy: "bg-pink-300",
  normal: "bg-gray-400",
  fighting: "bg-red-700",
  flying: "bg-indigo-400",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  rock: "bg-yellow-800",
  bug: "bg-green-700",
  ghost: "bg-indigo-700",
  steel: "bg-gray-500",
};

/*
interface PokemonCard {
  id: number;
  image: string;
  name: string;
  types: string[];
}

async function fetchData(offset: number): Promise<PokemonCard[]> {
  const list = await PokeAPI.listPokemons(offset, 20);
  const pokemons = await Promise.all(
    list.results.map(async (item: { name: string; url: string }) => {
      const pokemon = await PokeAPI.getPokemonByName(item.name);
      return pokemon;
    }),
  );

  return pokemons.map((item) => ({
    id: item.id,
    image: item.sprites.other?.["official-artwork"].front_default ?? "",
    name: item.name,
    types: item.types.map((type) => type.type.name),
  }));
}*/