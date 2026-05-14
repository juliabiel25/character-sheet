import { useState } from "react";
import { supabase } from "../utils/supabase";
import type { CharacterDTO } from "../types/types";

export function useCharacterDetails() {
  const [character, setCharacter] = useState<CharacterDTO | null>(null);

  const resetCharacter = () => {
    setCharacter(null);
  };

  const createCharacter = async (userId: string) => {
    const { error, data } = await supabase
      .from("characters")
      .insert([{ user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error("Error creating a new character: ", error);
      return;
    }
    console.log("created character: ", data);
    // wanted to add this to get the character details once the post-insert trigger run and the abilities and skills are created....
    // but got errors after uncommenting,,,
    await getCharacterDetails(data.id);
  };

  const getCharacterDetails = async (id: string | null) => {
    console.log("get deets....", id);
    if (!id) {
      setCharacter(null);
      return;
    }

    const { data, error } = await supabase
      .from("characters")
      .select(`*, abilities(*, skills(*))`)
      .eq("id", id)
      .single();

    if (!error) {
      setCharacter(data);
    }
    console.log("character details: ", data);
  };

  return {
    character,
    setCharacter,
    getCharacterDetails,
    resetCharacter,
    createCharacter,
  };
}
