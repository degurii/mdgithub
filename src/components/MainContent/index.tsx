import { GitNode, GitTree, RepoParams } from '../../pages/TIL';
import ArticleList from '../ArticleList';
import Article from '../Article';
import { useAsync } from '../../hooks';
import { getBlobs, postMarkdown } from '../../apis/services/github';
import { decode } from 'js-base64';
import { useEffect, useState } from 'react';

type Props = {
  createBlobUrl: (path: string) => string;
  currentNode?: GitNode;
  repoParams?: RepoParams;
};

export type ArticleData = {
  text: string;
  type: 'html' | 'markdown';
};

function MainContent({ currentNode, repoParams, createBlobUrl }: Props) {
  const [articleState] = useAsync(
    async function fetchArticle() {
      if (!repoParams || !currentNode) {
        return undefined;
      }
      if (currentNode.type === 'blob') {
        const blob = currentNode;
        return getBlobs(repoParams.owner, repoParams.repo, blob.sha)
          .then(({ data }) => decode(data.content))
          .then(postMarkdown)
          .then(({ data: articleHtml }) => articleHtml);
      }
    },
    [currentNode, repoParams],
  );
  const [article, setArticle] = useState<ArticleData | undefined>();

  useEffect(() => {
    if (!articleState || articleState.loading) {
      return;
    }
    setArticle({
      text: articleState.data,
      type: 'html',
    });
  }, [articleState]);

  if (!currentNode || !repoParams) {
    return null;
  }
  return (
    <main className="flex flex-1 justify-center pt-16 py-6 px-6 lg:px-8">
      {currentNode.type === 'tree' ? (
        <ArticleList
          createBlobUrl={createBlobUrl}
          currentNode={currentNode as GitTree}
        />
      ) : (
        <Article data={article?.text} type={article?.type} />
      )}
    </main>
  );
}

export default MainContent;
