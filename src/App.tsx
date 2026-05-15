import "./styles/App.more.css";
import { useState, useEffect, useRef } from "react";
import { supabase } from "./utils/supabase";
import { getUserFromSession, signInWithGoogle, signOut } from "./utils/auth";
import UnauthorizedView from "./UnauthorizedView";
import CharacterSelector from "./CharacterSelector";
import { Button } from "@radix-ui/themes";
import Input from "./Input";
import { Flex } from "@radix-ui/themes";
import WidgetMenu from "./WidgetMenu";
import type {
  SyncStatus,
  SyncHistoryEntry,
  UpdateTableFunction,
} from "./types/types";
import AbilitySection from "./AbilitySection";
import { useCharacters } from "./hooks/useCharacters";

function App() {
  const {
    characters,
    selectedCharacterId,
    getCharactersData,
    deleteCharacter,
    resetCharacters,
    selectedCharacter,
    selectCharacter,
    createCharacter,
  } = useCharacters();
  const [userId, setUserId] = useState<string | null | undefined>(null);
  const [syncHistory, setSyncHistory] = useState<SyncHistoryEntry[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const statusTimeout = useRef<number>(null);

  const clearSyncStatus = () => {
    setSyncStatus("idle");
  };

  const handleUpdateField: UpdateTableFunction = async (
    columnName,
    newValue,
    id = selectedCharacterId,
    tableName = "characters",
    fieldNamePrefix
  ) => {
    if (selectedCharacterId) {
      const { error, data } = await supabase
        .from(tableName)
        .update({ [columnName]: newValue })
        .eq("id", id)
        .select()
        .single();

      if (error) console.log("Error on update: ", error?.message);
      console.log("Updated row:", data);

      setSyncHistory((prev) => [
        ...prev,
        {
          timestamp: new Date(),
          field: `${fieldNamePrefix ? fieldNamePrefix + " " : ""}${columnName}`,
          value: newValue ?? "",
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
          resetCharacters();
        }
      }
    );
    return () => listener.subscription.unsubscribe();
  }, [resetCharacters]);

  useEffect(() => {
    if (userId) {
      console.log("Logged in user:", userId);
      getCharactersData();
    }
  }, [userId, getCharactersData]);

  if (!userId)
    return <Button onClick={signInWithGoogle}>log in with google</Button>;

  return (
    <div id="content-wrapper">
      <div id="left-panel">
        {characters !== null && (
          <CharacterSelector
            characters={characters}
            selectedCharacterId={selectedCharacterId}
            onCharacterSelect={selectCharacter}
            onNewCharacterClick={() => createCharacter(userId)}
          />
        )}
      </div>
      <main>
        {userId ? (
          <Button onClick={signOut}>log out</Button>
        ) : (
          <Button onClick={signInWithGoogle}>log in with google</Button>
        )}
        {!userId && <UnauthorizedView />}

        {selectedCharacter && (
          // assign the key to the selected character id to remount the entire form container on active character change
          <Flex direction={"column"} gap={"20px"} key={selectedCharacter.id}>
            <Button color="red" onClick={deleteCharacter}>
              delete character
            </Button>
            <header>
              <div className="header-left card">
                <div className="labeled-Input">
                  <Input
                    name="name"
                    type="text"
                    value={selectedCharacter?.name}
                    onChange={(newValue) => handleUpdateField("name", newValue)}
                  />
                  <label htmlFor="character_name">CHARACTER NAME</label>
                </div>

                <div className="character-details">
                  <div className="labeled-Input">
                    <Input
                      name="background"
                      type="text"
                      value={selectedCharacter?.background}
                      onChange={(newValue) =>
                        handleUpdateField("background", newValue)
                      }
                    />
                    <label htmlFor="character_background">BACKGROUND</label>
                  </div>

                  <div className="labeled-Input">
                    <Input
                      name="class"
                      type="text"
                      value={selectedCharacter?.class}
                      onChange={(newValue) =>
                        handleUpdateField("class", newValue)
                      }
                    />
                    <label htmlFor="character_class">CLASS</label>
                  </div>

                  <div className="labeled-Input">
                    <Input
                      name="species"
                      type="text"
                      value={selectedCharacter?.species}
                      onChange={(newValue) =>
                        handleUpdateField("species", newValue)
                      }
                    />
                    <label htmlFor="character_species">SPECIES</label>
                  </div>

                  <div className="labeled-Input">
                    <Input
                      name="subclass"
                      type="text"
                      value={selectedCharacter?.subclass}
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
                      name="level"
                      type="text"
                      value={selectedCharacter?.level}
                      onChange={(newValue) =>
                        handleUpdateField("level", newValue)
                      }
                    ></Input>
                    <label htmlFor="character_level">LEVEL</label>
                  </div>
                </div>

                <div className="labeled-Input">
                  <Input
                    name="experience_points"
                    type="text"
                    value={selectedCharacter?.experience_points}
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
                    name="armor_class"
                    type="text"
                    value={selectedCharacter?.armor_class}
                    onChange={(newValue) =>
                      handleUpdateField("armor_class", newValue)
                    }
                  />
                </div>
                <div className="labeled-Input">
                  <label htmlFor="character_shield">SHIELD</label>
                  <Input
                    name="shield"
                    type="toggle"
                    value={selectedCharacter?.shield}
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
                          name="hit_points_current"
                          value={selectedCharacter?.hit_points_current}
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
                          name={"hit_points_temp"}
                          value={selectedCharacter?.hit_points_temp}
                          onChange={(newValue) =>
                            handleUpdateField("hit_points_temp", newValue)
                          }
                        />
                        <label htmlFor="hit_points_temp">TEMP</label>
                      </div>
                      <div className="labeled-Input">
                        <Input
                          name={"hit_points_max"}
                          value={selectedCharacter?.hit_points_max}
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
                        name={"hit_dice_spent"}
                        value={selectedCharacter?.hit_dice_spent}
                        onChange={(newValue) =>
                          handleUpdateField("hit_dice_spent", newValue)
                        }
                      />
                      <label htmlFor="hit_dice_spent">SPENT</label>
                    </div>
                    <div className="labeled-Input">
                      <Input
                        name={"hit_dice_max"}
                        type="text"
                        value={selectedCharacter?.hit_dice_max}
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
                        name={"death_saves_successes"}
                        type="checkbox-group"
                        value={
                          selectedCharacter?.death_saves_successes ?? [
                            false,
                            false,
                            false,
                          ]
                        }
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
                        name={"death_saves_failures"}
                        type="checkbox-group"
                        value={
                          selectedCharacter?.death_saves_failures ?? [
                            false,
                            false,
                            false,
                          ]
                        }
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
                    name={"proficiency_bonus"}
                    type="text"
                    value={selectedCharacter?.proficiency_bonus}
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
                    name="initiative_bonus"
                    type="text"
                    value={selectedCharacter?.initiative_bonus}
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
                    name="speed"
                    type="text"
                    value={selectedCharacter?.speed}
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
                    name="size"
                    type="text"
                    value={selectedCharacter?.size}
                    onChange={(newValue) => handleUpdateField("size", newValue)}
                  />
                </div>
              </div>
              <div className="input-group card">
                <div className="labeled-Input">
                  <label htmlFor="passive_perception">PASSIVE PERCEPTION</label>
                  <Input
                    type="text"
                    name="passive_perception"
                    value={selectedCharacter?.passive_perception}
                    onChange={(newValue) =>
                      handleUpdateField("passive_perception", newValue)
                    }
                  />
                </div>
              </div>
            </Flex>
            {selectedCharacter?.abilities && (
              <AbilitySection
                abilities={selectedCharacter?.abilities}
                onChange={handleUpdateField}
              />
            )}
          </Flex>
        )}

        {characters !== null && characters.length === 0 && (
          <Flex
            width={"100%"}
            height={"100%"}
            align={"center"}
            justify={"center"}
          >
            <Button size={"4"} onClick={() => createCharacter(userId)}>
              Create a new character
            </Button>
          </Flex>
        )}
      </main>
      <WidgetMenu
        syncHistory={syncHistory}
        syncStatus={syncStatus}
        onReloadClick={() => getCharactersData()}
      />
    </div>
  );
}

export default App;
