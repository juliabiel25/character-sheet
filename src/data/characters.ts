import { getUserFromSession } from "../utils/auth";
import { supabase } from "../utils/supabase";

export type CharacterDTO = {
  id?: string;
  user_id?: string;
  name?: string;
  species?: string;
  class?: string;
  subclass?: string;
  level?: string;
  background?: string;
  experience_points?: string;
  heroic_inspiration?: boolean;
  spellcasting_ability?: string;
  spellcasting_modifier?: string;
  spell_save_dc?: string;
  spell_attack_bonus?: string;
  armor_class?: string;
  shield?: boolean;
  hit_points_current?: string;
  hit_points_temp?: string;
  hit_points_max?: string;
  speed?: string;
  hit_dice_spent?: string;
  hit_dice_max?: string;
  death_saves_successes?: [boolean, boolean, boolean];
  death_saves_failures?: [boolean, boolean, boolean];
  proficiency_bonus?: string;
  equipment?: unknown;
  coins?: unknown;
  created_at?: string;
  updated_at?: string;
  initiative_bonus?: string;
  size?: string;
  passive_perception?: string;
  abilities?: AbilityDTO[];
};

export type AbilityDTO = {
  name: string;
  score: string;
  modifier: string;
  saving_throw_proficiency: boolean;
  saving_throw_bonus: string;
  skills: SkillDTO[];
};

export type SkillDTO = {
  proficiency: boolean;
  bonus: string;
  name: string;
};

export async function insertCharacter(character?: CharacterDTO) {
  const user = await getUserFromSession();
  const { error, data } = await supabase
    .from("characters")
    .insert([{ user_id: user.id, ...character }])
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
  newValue: unknown
) {
  return supabase
    .from("characters")
    .update({ [columnName]: newValue })
    .eq("id", id)
    .select()
    .single();
}

export async function deleteCharacter(id: string) {
  return supabase.from("characters").delete().eq("id", id);
}
