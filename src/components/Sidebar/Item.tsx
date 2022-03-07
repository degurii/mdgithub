import React from 'react';
import { GitTree } from '../../pages/TIL';
import { classNames } from '../../utils/tailwind';

type Props = {
  item: any;
};

function Item({ item }: Props) {
  return (
    <a
      key={item.name}
      href={item.href}
      className={classNames(
        item.current
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        'group rounded-md py-2 px-2 flex items-center text-sm font-medium',
      )}
    >
      {item.name}
    </a>
  );
}

export default Item;
