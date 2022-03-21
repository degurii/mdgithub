import { useEffect, useState } from 'react';
import { BranchInfo, GitNode } from '../../pages/Repository';
import { decode } from 'js-base64';
import { useAsync } from '../../hooks';
import { getBlobs } from '../../apis/services/github';

import ArticleList from '../ArticleList';
import Article from '../Article';

type Props = {
  createBlobUrl: (path: string) => string;
  currentNode?: GitNode;
  branchInfo?: BranchInfo;
  navigateToNotFound: () => void;
};

export type ArticleData = {
  data: string; // should be markdown
  path: string;
  title: string | null;
  url: string;
};

const getTitleFromMarkdown = (data: string) => {
  const lines = data.split('\n');
  const titleLine = lines.find((line) => line.startsWith('# '));
  if (!titleLine) {
    return null;
  }
  const title = titleLine.replace(/^#+/, '').trim();
  return title;
};

function MainContent({
  currentNode,
  branchInfo,
  createBlobUrl,
  navigateToNotFound,
}: Props) {
  const [{ data: articles, error }] = useAsync<ArticleData[] | null>(
    async function fetchBlobsInCurrentTree() {
      if (!branchInfo || !currentNode) {
        return null;
      }
      const targetTree =
        currentNode.type === 'tree' ? currentNode : currentNode.parent;

      return Promise.all(
        Object.values(targetTree.blobs).map(async (blob) => {
          const { data } = await getBlobs(
            branchInfo.owner,
            branchInfo.repo,
            blob.sha,
          );
          const markdown = decode(data.content);
          const title = getTitleFromMarkdown(markdown) ?? blob.name;
          return {
            data: markdown,
            path: blob.path,
            title,
            url: createBlobUrl(blob.path),
          };
        }),
      );
    },
    [currentNode, branchInfo, createBlobUrl],
  );
  const [article, setArticle] = useState<ArticleData | null>(null);

  useEffect(
    function setCurrentArticle() {
      if (!currentNode || currentNode.type === 'tree' || !articles) {
        return;
      }
      const currentArticle = articles.find(
        (article) => article.path === currentNode.path,
      );
      if (!currentArticle) {
        navigateToNotFound();
        return;
      }
      setArticle(currentArticle);
    },
    [currentNode, articles, navigateToNotFound],
  );

  if (error) {
    return <div>에러</div>;
  }
  if (!currentNode || !branchInfo) {
    return (
      <div>
        콘텐트 로딩중 콘텐트 로딩중 콘텐트 로딩중 콘텐트 로딩중 콘텐트 로딩중{' '}
      </div>
    );
  }
  return (
    <main className="flex flex-1 w-full justify-center pt-6 lg:pt-14 pb-6 px-6 lg:px-8">
      {currentNode.type === 'tree' ? (
        <ArticleList articles={articles} />
      ) : (
        <Article article={article} />
      )}
    </main>
  );
}

export default MainContent;
