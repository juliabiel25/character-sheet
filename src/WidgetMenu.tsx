import { useState } from "react";
import "./styles/WidgetMenu.css";
import { Flex, IconButton } from "@radix-ui/themes";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  DotsVerticalIcon,
  CheckIcon,
  ReloadIcon,
  Cross1Icon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import ErrorIcon from "./ErrorIcon";
import ScrollArea from "./ScrollArea";
import type { SyncHistoryEntry, SyncStatus } from "./types/types";

interface WidgetMenuProps {
  syncHistory: SyncHistoryEntry[];
  syncStatus: SyncStatus;
  tooltip?: string;
  onReloadClick?: () => void;
}

const WidgetMenu = ({
  syncHistory = [],
  syncStatus = "idle",
  //   tooltip,
  onReloadClick,
}: WidgetMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenuOpened = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const iconColor =
    syncStatus === "saved" ? "green" : syncStatus === "error" ? "ruby" : "gray";

  return (
    <Tooltip.Provider delayDuration={0}>
      <Flex
        position={"fixed"}
        right={"0"}
        bottom={"0"}
        className="sync-widget-container"
        direction={"column"}
        align={"end"}
        gap={"10px"}
      >
        {isMenuOpen && (
          <ScrollArea type="vertical">
            <Flex
              className="widget-menu-container"
              direction={"column"}
              gap={"10px"}
              justify={syncHistory.length === 0 ? "center" : "start"}
              align={"stretch"}
              style={{ padding: "1em" }}
            >
              {syncHistory.length === 0 && (
                <Flex
                  height={"100%"}
                  align={"center"}
                  justify={"center"}
                  style={{
                    textAlign: "center",
                    color: "var(--mauve-10)",
                  }}
                >
                  <span style={{ width: "80%" }}>
                    No updates were made in this browser session :){" "}
                  </span>
                </Flex>
              )}
              {syncHistory.length > 0 &&
                syncHistory.map((event, index) => (
                  <Flex
                    key={`${index}-syncHistoryElem`}
                    direction={"column"}
                    gap={"6px"}
                    style={{
                      boxShadow: "var(--shadow-2)",
                      padding: "10px 10px 12px 10px",
                      borderRadius: "1em",
                    }}
                  >
                    <span
                      className="history-entry-timestamp"
                      style={{ fontSize: "0.8em" }}
                    >
                      {event.timestamp.toLocaleDateString("pl-PL")}
                      {"    "}
                      {event.timestamp.toLocaleTimeString("pl-PL")}
                    </span>
                    <Flex align={"center"} justify={"between"}>
                      {event.error ? (
                        <ExclamationTriangleIcon
                          style={{
                            backgroundColor: "var(--ruby-8)",
                            padding: "5px",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <CheckIcon
                          style={{
                            backgroundColor: "var(--green-8)",
                            padding: "5px",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                      <Flex align={"center"} gap={"1em"}>
                        <span>{event.field}</span>
                      </Flex>
                    </Flex>

                    {event.error ? (
                      <>
                        <span
                          style={{
                            color: "var(--ruby-10)",
                            textAlign: "right",
                          }}
                        >
                          {JSON.stringify(event.value)}
                        </span>
                        <div
                          style={{
                            backgroundColor: "var(--ruby-a1)",
                            color: "var(--ruby-8)",
                            padding: "5px 10px",
                            borderRadius: "10px",
                          }}
                        >
                          {event.error}
                        </div>
                      </>
                    ) : (
                      <span
                        style={{ color: "var(--green-10)", textAlign: "right" }}
                      >
                        {JSON.stringify(event.value)}
                      </span>
                    )}
                  </Flex>
                ))}
            </Flex>
          </ScrollArea>
        )}

        <Flex gap={"1em"} align={"center"}>
          {isMenuOpen && (
            <Tooltip.Root>
              <Tooltip.Content side={"left"}>
                <Flex
                  style={{
                    padding: "1em",
                    // boxShadow: "var(--shadow-1)",
                    borderRadius: "1em",
                    backgroundColor: "#000",
                    marginRight: "1em",
                  }}
                >
                  <span>Reload data from DB</span>
                </Flex>
              </Tooltip.Content>
              <Tooltip.Trigger asChild>
                <IconButton>
                  <ReloadIcon onClick={onReloadClick} />
                </IconButton>
              </Tooltip.Trigger>
            </Tooltip.Root>
          )}

          <IconButton size={"4"} color={iconColor} onClick={toggleMenuOpened}>
            {syncStatus === "saved" ? (
              <CheckIcon />
            ) : syncStatus === "error" ? (
              <ErrorIcon />
            ) : isMenuOpen ? (
              <Cross1Icon />
            ) : (
              <DotsVerticalIcon />
            )}
          </IconButton>
        </Flex>
      </Flex>
    </Tooltip.Provider>
  );
};

export default WidgetMenu;
