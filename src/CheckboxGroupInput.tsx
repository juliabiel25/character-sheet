import { type FC } from "react";

interface CheckboxGroupInputProps {
  value: boolean[];
  onChange: (newVal: boolean[]) => void;
}

export const CheckboxGroupInput: FC<CheckboxGroupInputProps> = ({
  value,
  onChange,
}) => {
  if (value.length <= 0) {
    throw new Error(
      "CheckboxGroupInput should be given at least 1 value in the values array"
    );
  }

  const handleChange = (changeIndex: number, checked: boolean) => {
    const newVal = value.map((el, index) =>
      index === changeIndex ? checked : el
    );
    console.log("new value: ", newVal);
    onChange(newVal);
  };

  return (
    <div className="checkbox-group-input">
      {value.map((value, index) => (
        <input
          key={index}
          type="checkbox"
          checked={value}
          onChange={(e) => handleChange(index, e.target?.checked)}
        />
      ))}
    </div>
  );
};
