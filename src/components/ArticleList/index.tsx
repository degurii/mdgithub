import React from 'react';
import { ArticleData } from '../MainContent';
import Item from './Item';

type Props = {
  articles: ArticleData[] | null;
};

function ArticleList({ articles }: Props) {
  if (!articles) {
    return <div>글 목록 로딩중</div>;
  }
  return (
    <div className="flex flex-col w-full max-w-prose">
      {articles.map((article) => (
        <Item key={article.path} article={article} url={article.url} />
      ))}
    </div>
  );
}

export default React.memo(ArticleList);
