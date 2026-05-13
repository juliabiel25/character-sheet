import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import * as Tooltip from "@radix-ui/react-tooltip";

interface ErrorIconProps {
  onClick?: () => void;
  errorMessage?: string;
}

const ErrorIcon = ({ errorMessage }: ErrorIconProps) => {
  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Flex className="icon-container">
            <ExclamationTriangleIcon color="tomato" />
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
