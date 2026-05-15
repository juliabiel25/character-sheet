import { useCallback, useState } from "react";
import { supabase } from "../utils/supabase";
import type { CharacterList } from "../types/types";

export function useCharacterList() {
  const [characterList, setCharacterList] = useState<CharacterList | null>(
    null
  );

  const resetCharacterList = () => {
    setCharacterList([]);
  };

  const getCharacterList = useCallback(async () => {
    const { data, error } = await supabase
      .from("characters")
      .select(`id, name`);

    if (!error) {
      setCharacterList(data);
    }
    console.log("character list: ", data);
  }, []);

  return {
    characterList,
    setCharacterList,
    getCharacterList,
    resetCharacterList,
  };
}
