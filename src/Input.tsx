import { Box, Flex, TextField } from "@radix-ui/themes";
import { useState, useEffect, useRef, useCallback } from "react";
import { CheckboxGroupInput } from "./CheckboxGroupInput";
import type { InputValue } from "./types/types";

interface InputProps {
  type?: "text" | "toggle" | "checkbox-group";
  onChange?: (newValue: InputValue) => void;
  value: InputValue;
  name: string;
  className?: string;
}

const Input = ({
  value,
  name,
  type = "text",
  className,
  onChange,
}: InputProps) => {
  const normalize = useCallback(
    (v: InputValue) =>
      v === null || v === undefined ? (type === "toggle" ? false : "") : v,
    [type]
  );

  const [draftValue, setDraftValue] = useState<InputValue>(normalize(value));
  const idleTimeout = useRef<number | null>(null);
  const lastUpdatedValue = useRef<InputValue | null>(null);

  const handleChange = (newVal: InputValue) => {
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftValue(normalize(value));
  }, [value, normalize]);

  return (
    <Box>
      {type === "toggle" ? (
        <Flex>
          <input
            id={name}
            name={name}
            type="checkbox"
            className={className}
            checked={!!draftValue}
            onChange={(e) => handleChange(e.target.checked)}
          />
        </Flex>
      ) : type === "checkbox-group" ? (
        <CheckboxGroupInput
          value={draftValue as boolean[]}
          onChange={handleChange}
        />
      ) : (
        <TextField.Root
          size="2"
          id={name}
          name={name}
          className={className}
          value={draftValue?.toString()}
          onChange={(e) => handleChange(e.target.value)}
        ></TextField.Root>
      )}
    </Box>
  );
};

export default Input;
