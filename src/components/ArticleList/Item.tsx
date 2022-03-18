import React from 'react';
import { Link } from 'react-router-dom';
import { ArticleData } from '../MainContent';

type Props = {
  article: ArticleData;
  url: string;
};

function Item({ article, url }: Props) {
  return (
    <Link
      to={url}
      className="block border-b-2 py-6 last:border-none first:pt-0"
    >
      <p className="text-xl font-semibold text-gray-900 truncate">
        {article.title}
      </p>
      <p className="mt-3 text-base text-gray-500 line-clamp-3">
        {article.data}
      </p>
    </Link>
  );
}

export default React.memo(Item);
