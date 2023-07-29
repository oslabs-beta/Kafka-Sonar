import React, { ChangeEvent, useState } from 'react';

// custom hook to handle state changes to input boxes as a user types
export default function useInput(
  initValue: string
): [string, (e: ChangeEvent<HTMLInputElement>) => void] {
  const [value, setValue] = useState(initValue);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };
  return [value, onChange];
}
