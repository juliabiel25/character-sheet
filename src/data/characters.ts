import type { InputValue } from "../types/types";
import { getUserFromSession } from "../utils/auth";
import { supabase } from "../utils/supabase";
import { type CharacterDTO } from "../types/types";

export async function insertCharacter(character?: CharacterDTO) {
  const user = await getUserFromSession();
  const { error, data } = await supabase
    .from("characters")
    .insert([{ user_id: user?.id, ...character }])
    .select()
    .single();
  return { error, data };
}

export function getCharacters() {
  return supabase.from("characters").select().order("created_at");
}

export async function getCharacter(id: string) {
  return supabase.from("characters").select().eq("id", id).single();
}

export async function updateCharacter(
  id: string,
  columnName: string,
  newValue: InputValue
) {
  return supabase
    .from("characters")
    .update({ [columnName]: newValue })
    .eq("id", id)
    .select()
    .single();
}

export async function updateAbility(
  id: string,
  columnName: string,
  newValue: InputValue
) {
  return supabase
    .from("abilities")
    .update({ [columnName]: newValue })
    .eq("id", id)
    .select()
    .single();
}

export async function updateSkill(
  id: string,
  columnName: string,
  newValue: InputValue
) {
  return supabase
    .from("skills")
    .update({ [columnName]: newValue })
    .eq("id", id)
    .select()
    .single();
}
