import * as Tooltip from "@radix-ui/react-tooltip";
// import type { CharacterList } from "./types/types";
import { type CharacterDTO } from "./types/types";
// import { useCharacterList } from "./hooks/useCharacterList";

interface CharacterSelectorProps {
  characters: CharacterDTO[];
  selectedCharacterId: string | null;
  onCharacterSelect: (id: string) => void;
  onNewCharacterClick: () => Promise<void>;
}
const CharacterSelector = ({
  characters,
  selectedCharacterId,
  onCharacterSelect,
  onNewCharacterClick,
}: CharacterSelectorProps) => {
  return (
    <Tooltip.Provider delayDuration={0}>
      <div id="character-selection">
        {characters.map((character) => (
          <Tooltip.Root key={`character-selection-tile-${character?.id}`}>
            <Tooltip.Trigger asChild>
              <div
                className={`character-tile ${
                  selectedCharacterId === character?.id && "character-selected"
                }`}
                onClick={() => onCharacterSelect(character?.id)}
              >
                L
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content side="right">
              <Tooltip.Arrow />
              <div className="tooltip">
                {character.name ? `${character.name}` : character?.id}
              </div>
            </Tooltip.Content>
          </Tooltip.Root>
        ))}

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div
              className={`character-tile new-character-button`}
              onClick={onNewCharacterClick}
            >
              +
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content side="right">
            <Tooltip.Arrow />
            <div className="tooltip">Create a new character</div>
          </Tooltip.Content>
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
  );
};

export default CharacterSelector;
