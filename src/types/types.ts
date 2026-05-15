export type SyncHistoryEntry = {
  timestamp: Date;
  field: string;
  value: InputValue;
  error?: string;
};

export type SyncStatus = "idle" | "saved" | "error";

export type InputValue = string | number | boolean | boolean[] | undefined;

export type UpdateTableFunction = (
  columnName: string,
  newValue: InputValue,
  id?: string | null,
  tableName?: string
) => Promise<void>;

export type CharacterDTO = {
  id: string;
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
  // equipment?;
  // coins?;
  created_at?: string;
  updated_at?: string;
  initiative_bonus?: string;
  size?: string;
  passive_perception?: string;
  abilities?: AbilityDTO[];
};

export type AbilityDTO = {
  id: string;
  name: string;
  score: string;
  modifier: string;
  saving_throw_proficiency: boolean;
  saving_throw_bonus: string;
  skills: SkillDTO[];
  display_order: number;
};

export type SkillDTO = {
  id: string;
  proficiency: boolean;
  bonus: string;
  name: string;
};

export type CharacterList = {
  id: string;
  name?: string;
}[];
