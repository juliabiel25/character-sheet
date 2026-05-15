import { useState, useCallback, useMemo } from "react";
import { supabase } from "../utils/supabase";
import type { CharacterDTO, InputValue } from "../types/types";

export function useCharacters() {
  const [characters, setCharacters] = useState<CharacterDTO[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null
  );

  // ✅ derived state (NO separate fetch state)
  const selectedCharacter = useMemo(() => {
    return characters.find((c) => c.id === selectedCharacterId) ?? null;
  }, [characters, selectedCharacterId]);

  // -----------------------------
  // LOAD ALL CHARACTERS (full data)
  // -----------------------------
  const getCharactersData = useCallback(async () => {
    const { data, error } = await supabase
      .from("characters")
      .select(`*, abilities(*, skills(*))`)
      .order("created_at");

    if (error) {
      console.error(error);
      return;
    }

    setCharacters(data ?? []);

    if (!selectedCharacterId && data?.length > 0) {
      setSelectedCharacterId(data[0].id);
    }
  }, [selectedCharacterId]);

  // -----------------------------
  // SELECT CHARACTER (instant)
  // -----------------------------
  const selectCharacter = (id: string) => {
    setSelectedCharacterId(id);
  };

  // -----------------------------
  // CREATE CHARACTER
  // -----------------------------
  const createCharacter = async (userId: string) => {
    const { data, error } = await supabase
      .from("characters")
      .insert([{ user_id: userId }])
      .select(`*, abilities(*, skills(*))`)
      .single();

    if (error) {
      console.error("Error creating character:", error);
      return;
    }

    setCharacters((prev) => [...prev, data]);
    setSelectedCharacterId(data.id);
  };

  // -----------------------------
  // DELETE CHARACTER
  // -----------------------------
  const deleteCharacter = async () => {
    if (!selectedCharacterId) return;

    const { error } = await supabase
      .from("characters")
      .delete()
      .eq("id", selectedCharacterId);

    if (error) {
      console.error("Error deleting character:", error);
      return;
    }

    // get updated list
    const { data } = await supabase
      .from("characters")
      .select(`*, abilities(*, skills(*))`)
      .order("created_at");

    if (!data) return;

    setCharacters(data);
    setSelectedCharacterId(
      (prevSelectedCharacterId) =>
        data.filter((c) => c.id !== prevSelectedCharacterId)[0].id
    );
  };
  // -----------------------------
  // RESET
  // -----------------------------
  const resetCharacters = () => {
    setCharacters([]);
    setSelectedCharacterId(null);
  };

  // -----------------------------
  // UPDATE CHARACTER FIELD (local-first)
  // -----------------------------
  const updateCharacterField = async (
    id: string,
    column: string,
    value: InputValue
  ) => {
    const { error } = await supabase
      .from("characters")
      .update({ [column]: value })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    // ✅ optimistic local update (prevents stale flash)
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [column]: value } : c))
    );
  };

  return {
    characters,
    selectedCharacterId,
    selectedCharacter, // derived
    getCharactersData,
    selectCharacter,
    createCharacter,
    resetCharacters,
    updateCharacterField,
    deleteCharacter,
  };
}
