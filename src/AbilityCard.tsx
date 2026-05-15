import { Flex, Separator } from "@radix-ui/themes";
import Input from "./Input";
import {
  type InputValue,
  type UpdateTableFunction,
  type AbilityDTO,
} from "./types/types";

interface AbilityCardProps {
  ability: AbilityDTO;
  onChange: UpdateTableFunction;
}

const AbilityCard = ({ ability, onChange }: AbilityCardProps) => {
  return (
    <Flex gap={"10px"} className="card ability-card">
      <Flex
        direction={"column"}
        className="input-group labeled-input"
        gap={"5px"}
      >
        <span className="skill-group-title">{ability.name.toUpperCase()}</span>
        <Flex
          align={"center"}
          gap={"10px"}
          width={"80%"}
          alignSelf={"center"}
          className="ability-header"
        >
          <Flex direction={"column"} align={"center"} gap={"10px"}>
            <Input
              name={`${ability.name}_modifier`}
              type="text"
              className="modifier-input"
              value={ability.modifier}
              onChange={(newValue: InputValue) =>
                onChange("modifier", newValue, ability.id, "abilities")
              }
            />
            <span>MODIFIER</span>
          </Flex>
          <Flex direction={"column"} align={"center"} gap={"10px"}>
            <Input
              name={`${ability.name}_score`}
              type="text"
              className="score-input"
              value={ability.score}
              onChange={(newValue: InputValue) =>
                onChange("score", newValue, ability.id, "abilities")
              }
            />
            <span>SCORE</span>
          </Flex>
        </Flex>

        <Flex justify={"start"}>
          <Flex direction={"column"} width={"fit-content"} gap={"5px"}>
            <Separator />
            <Flex
              display={"inline-flex"}
              gap={"10px"}
              width={"fit-content"}
              align={"center"}
            >
              <Input
                name={`${ability.name}_saving_throw_proficiency`}
                type="toggle"
                value={ability.saving_throw_proficiency}
                onChange={(newValue: InputValue) =>
                  onChange(
                    "saving_throw_proficiency",
                    newValue,
                    ability.id,
                    "abilities"
                  )
                }
              />
              <Input
                name={`${ability.name}_saving_throw_bonus`}
                type="text"
                className="ability-bonus"
                value={ability.saving_throw_bonus}
                onChange={(newValue: InputValue) =>
                  onChange(
                    "saving_throw_bonus",
                    newValue,
                    ability.id,
                    "abilities"
                  )
                }
              />
              <span className="skill-label">Saving Throw</span>
            </Flex>
            <Separator />
            {ability.skills
              .sort((a, b) => a.name.localeCompare(b.name)) // sort alphabetically by name
              .map((skill) => (
                <Flex
                  key={`${ability.name}_${skill.name}`.replace(" ", "-")}
                  display={"inline-flex"}
                  gap={"10px"}
                  width={"fit-content"}
                  align={"center"}
                >
                  <Input
                    name={`${skill.name}_proficiency`}
                    type="toggle"
                    value={skill.proficiency}
                    onChange={(newValue) =>
                      onChange(
                        "proficiency",
                        newValue,
                        skill.id,
                        "skills",
                        skill.name
                      )
                    }
                  />
                  <Input
                    name={`${skill.name}_bonus`}
                    type="text"
                    className="ability-bonus"
                    value={skill.bonus}
                    onChange={(newValue) =>
                      onChange(
                        "bonus",
                        newValue,
                        skill.id,
                        "skills",
                        skill.name
                      )
                    }
                  />
                  <span className="skill-label">{skill.name}</span>
                </Flex>
              ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default AbilityCard;
