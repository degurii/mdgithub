import React from 'react';
import { useFocus } from '../../hooks';
import { classNames } from '../../utils/tailwind';

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
  focus?: boolean;
  className?: string;
}
function InputBox({
  focus,
  onChange,
  onKeyPress,
  value,
  placeholder,
  className: cn,
}: Props) {
  const focusRef = useFocus();
  return (
    <input
      ref={focus ? focusRef : undefined}
      value={value}
      type="text"
      name="search"
      onChange={onChange}
      onKeyPress={onKeyPress}
      className={classNames(
        'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-[50rem] pr-12 border-gray-300 rounded-md',
        cn,
      )}
      placeholder={placeholder}
    />
  );
}

export default InputBox;
