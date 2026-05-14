import AbilityCard from "./AbilityCard";
import ScrollArea from "./ScrollArea";
import { Flex } from "@radix-ui/themes";
import type { UpdateTableFunction, AbilityDTO } from "./types/types";

interface AbilitySectionProps {
  abilities: AbilityDTO[];
  onChange: UpdateTableFunction;
}

const AbilitySection = ({ abilities, onChange }: AbilitySectionProps) => {
  return (
    <ScrollArea type="horizontal">
      <Flex gap={"10px"} justify={"center"}>
        {abilities
          .sort((a, b) => a.display_order - b.display_order)
          .map((ability) => (
            <AbilityCard
              ability={ability}
              key={`${ability?.name}_abilityCard`}
              onChange={onChange}
            />
          ))}
      </Flex>
    </ScrollArea>
  );
};
export default AbilitySection;
