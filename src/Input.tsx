import { Box, Flex, TextField } from "@radix-ui/themes";
// import { Spinner } from "@radix-ui/themes";
// import { CheckIcon } from "@radix-ui/react-icons";
import { useState, useEffect, useRef, useCallback } from "react";
// import { updateCharacter } from "./data/characters";
// import ErrorIcon from "./ErrorIcon";
import { CheckboxGroupInput } from "./CheckboxGroupInput";

// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
interface InputProps {
  type?: "text" | "toggle" | "checkbox-group";
  onChange?: (newValue) => void;
  value: string | number | boolean | boolean[];
  id?: string;
  className?: string;
}

const Input = ({
  value,
  id,
  type = "text",
  className,
  onChange,
}: InputProps) => {
  const normalize = useCallback(
    (v) =>
      v === null || v === undefined ? (type === "toggle" ? false : "") : v,
    [type]
  );

  const [draftValue, setDraftValue] = useState(normalize(value));
  const idleTimeout = useRef(null);
  const lastUpdatedValue = useRef(null);

  const handleChange = (newVal: unknown) => {
    setDraftValue(newVal);
  };

  // sync on debounce: 5s
  useEffect(() => {
    if (
      normalize(draftValue) != normalize(value) &&
      draftValue !== lastUpdatedValue.current
    ) {
      idleTimeout.current = setTimeout(() => {
        // call any additional parent-level onchange callbacks
        if (onChange) {
          onChange(draftValue);
          lastUpdatedValue.current = draftValue;
        }
      }, 2000);

      return () => {
        if (idleTimeout.current) clearTimeout(idleTimeout.current);
      };
    }
  }, [draftValue, normalize, onChange, value]);

  useEffect(() => {
    // if the value from parent changes -> overwrite the draft value
    // generally this app only assumes eventual sync on the db side and does not receive constant updates from the server
    // so if this value changes here - it's either because:
    // - it was only just initialized at component creation and is therefore the default value from the server
    // - a different character was selected with a different default value

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftValue(normalize(value));
  }, [value, normalize]);

  return (
    <Box>
      {type === "toggle" ? (
        <Flex>
          <input
            id={id}
            type="radio"
            className={className}
            checked={!!draftValue}
            onChange={(e) => handleChange(e.target.checked)}
          />
        </Flex>
      ) : type === "checkbox-group" ? (
        <CheckboxGroupInput value={draftValue} onChange={handleChange} />
      ) : (
        <TextField.Root
          size="2"
          id={id}
          className={className}
          value={draftValue.toString()}
          onChange={(e) => handleChange(e.target.value)}
        ></TextField.Root>
      )}
    </Box>
  );
};

export default Input;
