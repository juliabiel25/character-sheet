import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Flex, IconButton } from "@radix-ui/themes";
import { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface ErrorIconProps {
  onClick?: () => void;
  errorMessage?: string;
}

const ErrorIcon = ({ onClick, errorMessage }: ErrorIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Flex
            className="icon-container"
            onMouseLeave={() => setIsHovered(false)}
            onMouseEnter={() => setIsHovered(true)}
          >
            {/* {isHovered ? (
              <IconButton onClick={onClick}>
                <ReloadIcon />
              </IconButton>
            ) : ( */}
            <ExclamationTriangleIcon color="tomato" />
            {/* )} */}
          </Flex>
        </Tooltip.Trigger>
        {errorMessage && (
          <Tooltip.Content side="bottom">
            <Tooltip.Arrow />
            <div className="tooltip">{errorMessage}</div>
          </Tooltip.Content>
        )}
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default ErrorIcon;
