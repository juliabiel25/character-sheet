import { Flex, Separator } from "@radix-ui/themes";
import Input from "./Input";
import { type AbilityDTO, type SkillDTO } from "./data/characters";

interface AbilityCardProps {
  ability: AbilityDTO;
  onChange: (
    newAbility: AbilityDTO,
    options?: {
      syncHistoryFieldName?: string;
      syncHistoryValueGetter?: (abilities: AbilityDTO[]) => unknown;
    }
  ) => void;
}

const AbilityCard = ({ ability, onChange }: AbilityCardProps) => {
  const handleAbilityChange = (
    propertyName: string,
    newValue: string | boolean | SkillDTO[],
    options?: {
      syncHistoryFieldName?: string;
      syncHistoryValueGetter?: (abilities: AbilityDTO[]) => unknown;
    }
  ) => {
    const newAbility = { ...ability, [propertyName]: newValue };
    const syncHistoryValueGetter =
      options?.syncHistoryValueGetter ??
      ((changedAbilities: AbilityDTO[]) =>
        changedAbilities.find((a) => a.name === ability.name)[propertyName]);

    onChange(newAbility, {
      syncHistoryFieldName:
        options?.syncHistoryFieldName ?? `${ability.name} ${propertyName}`,
      syncHistoryValueGetter,
    });
  };

  const handleSkillChange = (
    skillName: string,
    propertyName: string,
    propertyValue
  ) => {
    const newSkills = ability.skills.map((skill) =>
      skill.name === skillName
        ? { ...skill, [propertyName]: propertyValue }
        : skill
    );
    const syncHistoryValueGetter = (changedAbilities: AbilityDTO[]) =>
      changedAbilities
        .find((a) => a.name === ability.name)
        .skills.find((s) => s.name === skillName)[propertyName];

    handleAbilityChange("skills", newSkills, {
      syncHistoryFieldName: `${skillName} ${propertyName}`,
      syncHistoryValueGetter,
    });
  };

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
              type="text"
              className="modifier-input"
              value={ability.modifier}
              onChange={(newValue: string) => {
                handleAbilityChange(`modifier`, newValue);
              }}
            />
            <span>MODIFIER</span>
          </Flex>
          <Flex direction={"column"} align={"center"} gap={"10px"}>
            <Input
              type="text"
              className="score-input"
              value={ability.score}
              onChange={(newValue: string) => {
                handleAbilityChange(`score`, newValue);
              }}
            />
            <span>SCORE</span>
          </Flex>
        </Flex>

        {/* proficiencies and bonus scores */}
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
                type="toggle"
                value={ability.saving_throw_proficiency}
                onChange={(newValue: string) => {
                  handleAbilityChange(`saving_throw_proficiency`, newValue);
                }}
              />
              <Input
                type="text"
                className="ability-bonus"
                value={ability.saving_throw_bonus}
                onChange={(newValue: string) => {
                  handleAbilityChange(`saving_throw_bonus`, newValue);
                }}
              />
              <span className="skill-label">Saving Throw</span>
            </Flex>
            <Separator />
            {ability.skills.map((skill) => (
              <Flex
                key={`${ability.name}_${skill.name}`.replace(" ", "-")}
                display={"inline-flex"}
                gap={"10px"}
                width={"fit-content"}
                align={"center"}
              >
                <Input
                  type="toggle"
                  value={skill.proficiency}
                  onChange={(newValue) =>
                    handleSkillChange(skill.name, "proficiency", newValue)
                  }
                />
                <Input
                  type="text"
                  className="ability-bonus"
                  value={skill.bonus}
                  onChange={(newValue) =>
                    handleSkillChange(skill.name, "bonus", newValue)
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
