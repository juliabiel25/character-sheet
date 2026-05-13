import "./styles/App.more.css";
import { useState, useEffect, useRef } from "react";
import { supabase } from "./utils/supabase";
import { getUserFromSession, signInWithGoogle, signOut } from "./utils/auth";
import UnauthorizedView from "./UnauthorizedView";
import CharacterSelector from "./CharacterSelector";
import { Button } from "@radix-ui/themes";
import Input from "./Input";
import {
  getCharacters,
  insertCharacter,
  deleteCharacter,
  type CharacterDTO,
  updateCharacter,
  type AbilityDTO,
} from "./data/characters";
import { Flex } from "@radix-ui/themes";
import WidgetMenu from "./WidgetMenu";
import {
  type SyncStatus,
  type SyncHistoryEntry,
  type InputValue,
} from "./types/types";
import AbilitySection from "./AbilitySection";

function App() {
  const [characterList, setCharacterList] = useState<CharacterDTO[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null
  );
  const [character, setCharacter] = useState<CharacterDTO | null>(null);
  const [userId, setUserId] = useState<string | null | undefined>(null);
  const [syncHistory, setSyncHistory] = useState<SyncHistoryEntry[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const statusTimeout = useRef<number>(null);

  async function getCharacterList() {
    const { data, error } = await getCharacters();
    if (!error && !!data) {
      setCharacterList(data);
    }
    return data;
  }

  // get the selected character information
  async function getCharacterDetails() {
    if (selectedCharacterId) {
      const { error, data } = await supabase
        .from("characters")
        .select()
        .eq("id", selectedCharacterId)
        .single<CharacterDTO>();
      if (!error) {
        console.log("fetched selected character data: ", data);
        setCharacter(data);
      }
    } else {
      setCharacter(null);
    }
  }

  const clearSyncStatus = () => {
    setSyncStatus("idle");
  };

  const handleUpdateField = async (
    columnName: string,
    newValue: InputValue | AbilityDTO[],
    {
      syncHistoryFieldName,
      syncHistoryValueGetter,
    }: {
      syncHistoryFieldName?: string;
      syncHistoryValueGetter?: (newValue: InputValue | AbilityDTO[]) => unknown;
    } = {}
  ) => {
    console.log(`Updating character [${selectedCharacterId}]:`, {
      [columnName]: newValue,
    });
    if (selectedCharacterId) {
      const { error } = await updateCharacter(
        selectedCharacterId,
        columnName,
        newValue
      );

      const value = syncHistoryValueGetter
        ? syncHistoryValueGetter(newValue)
        : newValue;

      setSyncHistory((prev) => [
        ...prev,
        {
          timestamp: new Date(),
          field: syncHistoryFieldName ?? columnName,
          value: value ?? "",
          error: error?.message,
        },
      ]);

      if (error) {
        setSyncStatus("error");
      } else {
        setSyncStatus("saved");
      }
    }
    // clear the 'saved' OR 'ERROR' status after 5s while
    statusTimeout.current = setTimeout(() => {
      clearSyncStatus();
    }, 5000);
  };

  const createCharacter = async () => {
    const { error, data } = await insertCharacter();

    console.log("create character output: ", { error, data });
    if (error) {
      console.error(`Error inserting a character: `, error.message);
    } else {
      setSelectedCharacterId(data.id);
      getCharacterList();
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    const { error } = await deleteCharacter(id);

    if (error) {
      console.error(`Error deleting character ${id}`, error.message);
    } else {
      // if the deleted character is the currently selected one => clear selection
      const characters = await getCharacterList();
      if (id === selectedCharacterId) {
        setSelectedCharacterId(
          characters && characters.length > 0 ? characters[0].id : null
        );
      }
    }
  };

  useEffect(() => {
    // 1. handle existing session
    getUserFromSession().then((sessionUser) => setUserId(sessionUser?.id));
    // 2. listen for future auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
        } else {
          setUserId(null);
          setCharacter(null);
        }
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    console.log("Logged in user:", userId);

    // get a list of available characters
    async function getCharacterListAndSelectDefault() {
      const { data, error } = await supabase
        .from("characters")
        .select()
        .order("created_at");
      // .order("updated_at");
      if (!error && !!data) {
        setCharacterList(data);
        setSelectedCharacterId(data[0].id);
        setCharacter(data[0]);
      }
    }
    if (userId) {
      getCharacterListAndSelectDefault();
    }
  }, [userId]);

  useEffect(() => {
    console.log("selected character:", selectedCharacterId);

    // get the selected character information
    const getCharacterDetails = async () => {
      if (selectedCharacterId) {
        const { error, data } = await supabase
          .from("characters")
          .select()
          .eq("id", selectedCharacterId)
          .single<CharacterDTO>();
        if (!error) {
          console.log("fetched selected character data: ", data);
          setCharacter(data);
        }
      } else {
        setCharacter(null);
      }
    };
    getCharacterDetails();
  }, [selectedCharacterId]);

  return (
    <div id="content-wrapper">
      <div id="left-panel">
        {userId && (
          <CharacterSelector
            characterList={characterList}
            selectedCharacterId={selectedCharacterId}
            onCharacterSelect={(characterId: string) =>
              setSelectedCharacterId(characterId)
            }
            onNewCharacterClick={createCharacter}
          />
        )}
      </div>
      <main>
        <Button onClick={signInWithGoogle}>log in with google</Button>
        <Button onClick={signOut}>log out</Button>
        {!userId ? (
          <UnauthorizedView />
        ) : character ? (
          <Flex direction={"column"} gap={"20px"}>
            <Button
              color="red"
              onClick={() => handleDeleteCharacter(character.id)}
            >
              delete character
            </Button>
            <header>
              <div className="header-left card">
                <div className="labeled-Input">
                  <Input
                    type="text"
                    value={character.name}
                    onChange={(newValue) => handleUpdateField("name", newValue)}
                  />
                  <label htmlFor="character_name">CHARACTER NAME</label>
                </div>

                <div className="character-details">
                  <div className="labeled-Input">
                    <Input
                      type="text"
                      value={character.background}
                      onChange={(newValue) =>
                        handleUpdateField("background", newValue)
                      }
                    />
                    <label htmlFor="character_background">BACKGROUND</label>
                  </div>

                  <div className="labeled-Input">
                    <Input
                      type="text"
                      value={character.class}
                      onChange={(newValue) =>
                        handleUpdateField("class", newValue)
                      }
                    />
                    <label htmlFor="character_class">CLASS</label>
                  </div>

                  <div className="labeled-Input">
                    <Input
                      type="text"
                      value={character.species}
                      onChange={(newValue) =>
                        handleUpdateField("species", newValue)
                      }
                    />
                    <label htmlFor="character_species">SPECIES</label>
                  </div>

                  <div className="labeled-Input">
                    <Input
                      type="text"
                      value={character.subclass}
                      onChange={(newValue) =>
                        handleUpdateField("subclass", newValue)
                      }
                    />
                    <label htmlFor="character_subclass">SUBCLASS</label>
                  </div>
                </div>
              </div>

              <div className="character-exp card">
                <div className="svg-border-content">
                  <div className="labeled-Input">
                    <Input
                      type="text"
                      value={character.level}
                      onChange={(newValue) =>
                        handleUpdateField("level", newValue)
                      }
                    ></Input>
                    <label htmlFor="character_level">LEVEL</label>
                  </div>
                </div>

                <div className="labeled-Input">
                  <Input
                    type="text"
                    value={character.experience_points}
                    onChange={(newValue) =>
                      handleUpdateField("experience_points", newValue)
                    }
                  ></Input>
                  <label htmlFor="experience_points">XP</label>
                </div>
              </div>

              <div className="character-armor card">
                <div className="labeled-Input">
                  <label htmlFor="character_armor_class">ARMOR CLASS</label>
                  <Input
                    type="text"
                    id="armor_class"
                    value={character.armor_class}
                    onChange={(newValue) =>
                      handleUpdateField("armor_class", newValue)
                    }
                  />
                </div>
                <div className="labeled-Input">
                  <label htmlFor="character_shield">SHIELD</label>
                  <Input
                    type="toggle"
                    value={character.shield}
                    onChange={(newValue) =>
                      handleUpdateField("shield", newValue)
                    }
                  />
                </div>
              </div>

              <div className="header-right card">
                <div className="hit-points">
                  HIT POINTS
                  <div className="hit-points-columns">
                    <div className="current-hit-points">
                      <div className="labeled-Input">
                        <Input
                          value={character.hit_points_current}
                          onChange={(newValue) =>
                            handleUpdateField("hit_points_current", newValue)
                          }
                        />
                        <label htmlFor="hit_points_current">CURRENT</label>
                      </div>
                    </div>
                    <div className="total-hit-points">
                      <div className="labeled-Input">
                        <Input
                          value={character.hit_points_temp}
                          onChange={(newValue) =>
                            handleUpdateField("hit_points_temp", newValue)
                          }
                        />
                        <label htmlFor="hit_points_temp">TEMP</label>
                      </div>
                      <div className="labeled-Input">
                        <Input
                          value={character.hit_points_max}
                          onChange={(newValue) =>
                            handleUpdateField("hit_points_max", newValue)
                          }
                        />
                        <label htmlFor="hit_points_max">MAX</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="death-saves">
                  HIT DICE
                  <div className="total-hit-points">
                    <div className="labeled-Input">
                      <Input
                        value={character.hit_dice_spent}
                        onChange={(newValue) =>
                          handleUpdateField("hit_dice_spent", newValue)
                        }
                      />
                      <label htmlFor="hit_dice_spent">SPENT</label>
                    </div>
                    <div className="labeled-Input">
                      <Input
                        type="text"
                        value={character.hit_dice_max}
                        onChange={(newValue) =>
                          handleUpdateField("hit_dice_max", newValue)
                        }
                      />
                      <label htmlFor="hit_dice_max">MAX</label>
                    </div>
                  </div>
                </div>

                <div className="death-saves">
                  DEATH SAVES
                  <div className="labeled-Input">
                    <div className="death-save-successes">
                      <Input
                        type="checkbox-group"
                        value={character.death_saves_successes}
                        onChange={(newValue) =>
                          handleUpdateField("death_saves_successes", newValue)
                        }
                      />
                    </div>
                    <label htmlFor="death-save-successes">SUCCESSES</label>
                  </div>
                  <div className="labeled-Input">
                    <div className="death-save-failures">
                      <Input
                        type="checkbox-group"
                        value={character.death_saves_failures}
                        onChange={(newValue) =>
                          handleUpdateField("death_saves_failures", newValue)
                        }
                      />
                    </div>
                    <label htmlFor="death-save-failures">FAILURES</label>
                  </div>
                </div>
              </div>
            </header>
            <Flex justify={"center"} gap={"10px"}>
              <div className="input-group card">
                <div className="labeled-Input">
                  <label htmlFor="proficiency_bonus">PROFICIENCY BONUS</label>
                  <Input
                    type="text"
                    id="proficiency_bonus"
                    value={character.proficiency_bonus}
                    onChange={(newValue) =>
                      handleUpdateField("proficiency_bonus", newValue)
                    }
                  />
                </div>
              </div>
              <div className="input-group card">
                <div className="labeled-Input">
                  <label htmlFor="initiative">INITIATIVE</label>
                  <Input
                    type="text"
                    id="initiative_bonus"
                    value={character.initiative_bonus}
                    onChange={(newValue) =>
                      handleUpdateField("initiative_bonus", newValue)
                    }
                  />
                </div>
              </div>
              <div className="input-group card">
                <div className="labeled-Input">
                  <label htmlFor="speed">SPEED</label>
                  <Input
                    type="text"
                    id="speed"
                    value={character.speed}
                    onChange={(newValue) =>
                      handleUpdateField("speed", newValue)
                    }
                  />
                </div>
              </div>
              <div className="input-group card">
                <div className="labeled-Input">
                  <label htmlFor="size">SIZE</label>
                  <Input
                    type="text"
                    id="size"
                    value={character.size}
                    onChange={(newValue) => handleUpdateField("size", newValue)}
                  />
                </div>
              </div>
              <div className="input-group card">
                <div className="labeled-Input">
                  <label htmlFor="passive_perception">PASSIVE PERCEPTION</label>
                  <Input
                    type="text"
                    id="passive_perception"
                    value={character?.passive_perception}
                    onChange={(newValue) =>
                      handleUpdateField("passive_perception", newValue)
                    }
                  />
                </div>
              </div>
            </Flex>
            {character?.abilities && (
              <AbilitySection
                abilities={character.abilities}
                onChange={(newAbilities, options) =>
                  handleUpdateField(
                    "abilities",
                    newAbilities as InputValue | AbilityDTO[],
                    options as {
                      syncHistoryFieldName?: string;
                      syncHistoryValueGetter?: (
                        newValue: AbilityDTO[] | InputValue
                      ) => unknown;
                    }
                  )
                }
              />
            )}
          </Flex>
        ) : (
          "no character was returned"
        )}
      </main>
      <WidgetMenu
        syncHistory={syncHistory}
        syncStatus={syncStatus}
        onReloadClick={getCharacterDetails}
      />
    </div>
  );
}

export default App;
