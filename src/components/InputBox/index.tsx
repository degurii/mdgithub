import React from 'react';

function InputBox() {
  return (
    <input
      type="text"
      name="search"
      placeholder="Github Repository URL 입력"
      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-[50rem] pr-12 border-gray-300 rounded-md"
    />
  );
}

export default InputBox;
