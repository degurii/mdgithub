import React from 'react';
import ReactMarkdown from 'react-markdown';

type Props = {
  article: {
    text: string;
    type: 'markdown' | 'html';
  };
  loading: boolean;
};
function Article({ article, loading }: Props) {
  if (loading) {
    return (
      <div className="w-60 h-24 border-2 rounded-md mx-auto mt-20">
        <div className="flex animate-pulse flex-row items-center h-full justify-center space-x-5">
          <div className="w-12 bg-gray-300 h-12 rounded-full "></div>
          <div className="flex flex-col space-y-3">
            <div className="w-36 bg-gray-300 h-6 rounded-md "></div>
            <div className="w-24 bg-gray-300 h-6 rounded-md "></div>
          </div>
        </div>
      </div>
    );
  }
  return article.type === 'markdown' ? (
    <article className="prose break-all">
      <ReactMarkdown>{article.text}</ReactMarkdown>
    </article>
  ) : (
    <article
      className="prose break-all"
      dangerouslySetInnerHTML={{ __html: article.text }}
    />
  );
}

export default Article;
