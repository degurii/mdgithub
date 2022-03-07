import { useState } from 'react';

export const useBoolean = (
  init: boolean,
): [boolean, () => void, () => void, () => void] => {
  const [state, setState] = useState(init);
  const setTrue = () => setState(true);
  const setFalse = () => setState(false);
  const toggle = () => setState((prevState) => !prevState);

  return [state, setTrue, setFalse, toggle];
};
