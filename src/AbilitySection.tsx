import type { AbilityDTO } from "./data/characters";
import AbilityCard from "./AbilityCard";
import ScrollArea from "./ScrollArea";
import { Flex } from "@radix-ui/themes";

interface AbilitySectionProps {
  abilities: AbilityDTO[];
  onChange: (
    newAbilities: AbilityDTO[],
    options: {
      syncHistoryFieldName?: string;
      syncHistoryValueGetter?: (abilities: AbilityDTO[]) => unknown;
    }
  ) => void;
}

const AbilitySection = ({ abilities, onChange }: AbilitySectionProps) => {
  const handleAbilityChange = (
    newAbility: AbilityDTO,
    options?: {
      syncHistoryFieldName?: string;
      syncHistoryValueGetter?: (abilities: AbilityDTO[]) => unknown;
    }
  ) => {
    onChange(
      abilities.map((ability) =>
        ability.name === newAbility.name ? newAbility : ability
      ),
      options
    );
  };

  return (
    <ScrollArea type="horizontal">
      <Flex gap={"10px"} justify={"center"}>
        {abilities.map((ability) => (
          <AbilityCard
            ability={ability}
            key={`${ability.name}_abilityCard`}
            onChange={handleAbilityChange}
          />
        ))}
      </Flex>
    </ScrollArea>
  );
};
export default AbilitySection;
