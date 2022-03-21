import React from 'react';
import ReactMarkdown from 'react-markdown';
import reamarkGfm from 'remark-gfm';
import { ArticleData } from '../MainContent';

type Props = {
  article: ArticleData | null;
};

function Article({ article }: Props) {
  if (!article) {
    return <div>로딩중</div>;
  }

  return (
    <article className="prose break-word w-full prose-a:break-all ">
      <ReactMarkdown remarkPlugins={[reamarkGfm]}>{article.data}</ReactMarkdown>
    </article>
  );
}

export default React.memo(Article);
