import { BranchInfo, GitNode, GitTree } from '../../pages/Repository';
import ArticleList from '../ArticleList';
import Article from '../Article';
import { useAsync } from '../../hooks';
import { getBlobs, postMarkdown } from '../../apis/services/github';
import { useEffect, useState } from 'react';
import { decode } from 'js-base64';

type Props = {
  createBlobUrl: (path: string) => string;
  currentNode?: GitNode;
  branchInfo?: BranchInfo;
};

export type ArticleData = {
  text?: string;
  type: 'html' | 'markdown';
};

function MainContent({ currentNode, branchInfo, createBlobUrl }: Props) {
  const [articleState] = useAsync<string | undefined>(
    async function fetchArticle() {
      if (!branchInfo || !currentNode) {
        return;
      }
      if (currentNode.type === 'blob') {
        return getBlobs(branchInfo.owner, branchInfo.repo, currentNode.sha)
          .then((res) => decode(res.data.content))
          .then(postMarkdown)
          .then(({ data: articleHtml }) => articleHtml);
      }
    },
    [currentNode, branchInfo],
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

  if (!currentNode || !branchInfo) {
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
