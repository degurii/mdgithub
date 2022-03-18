import React from 'react';
import ReactMarkdown from 'react-markdown';
import reamarkGfm from 'remark-gfm';

type Props = {
  data?: string;
};

function Article({ data }: Props) {
  if (!data) {
    return <div>로딩중</div>;
  }

  return (
    <article className="prose break-word w-screen">
      <ReactMarkdown remarkPlugins={[reamarkGfm]}>{data}</ReactMarkdown>
    </article>
  );
}

export default React.memo(Article);
