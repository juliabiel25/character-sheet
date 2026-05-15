import { useState, useCallback, useEffect } from "react";
import { supabase } from "../utils/supabase";
import type { CharacterDTO } from "../types/types";

export function useCharacters() {
  const [characters, setCharacters] = useState<CharacterDTO[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null
  );

  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterDTO | null>(null);

  // CHARACTER LIST
  const getCharactersData = useCallback(async () => {
    const { data, error } = await supabase
      .from("characters")
      .select("id, name, created_at")
      .order("created_at");

    if (error) {
      console.error(error);
      return;
    }

    setCharacters(data);

    if (!selectedCharacterId && data.length > 0) {
      setSelectedCharacterId(data[0].id);
    }
  }, [selectedCharacterId]);

  useEffect(() => {
    if (!selectedCharacterId) return;

    const loadCharacter = async () => {
      const { data, error } = await supabase
        .from("characters")
        .select(`*, abilities(*, skills(*))`)
        .eq("id", selectedCharacterId)
        .single();
      if (error) {
        console.error(error);
        return;
      }
      setSelectedCharacter(data);
    };
    loadCharacter();
  }, [selectedCharacterId]);

  const resetCharacters = () => {
    setCharacters([]);
    setSelectedCharacter(null);
    setSelectedCharacterId(null);
  };

  const createCharacter = async (userId: string) => {
    const { error, data } = await supabase
      .from("characters")
      .insert([{ user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error("Error creating character:", error);
      return;
    }
    await getCharactersData();
    setSelectedCharacterId(data.id);
  };

  const selectCharacter = (id: string) => {
    setSelectedCharacterId(id);
  };

  return {
    characters,
    selectedCharacter,
    selectedCharacterId,
    getCharactersData,
    createCharacter,
    selectCharacter,
    resetCharacters,
  };
}
