import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { classNames } from '../../utils/tailwind';

type Props = LinkProps & {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
};
// const a =
//   'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
// const b =
//   'whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700';

// const a =
//   'text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
// const b =
//   'whitespace-nowrap justify-center text-base font-bold ';

function LinkButton({ children, to, className: cn, ...props }: Props) {
  return (
    <Link
      to={to}
      className={classNames(
        'inline-flex items-center px-4 py-2 border border-transparent font-bold rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        cn,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

export default LinkButton;
