import React from 'react';
import { GitTree } from '../../pages/TIL';
import Item from './Item';

type Props = {
  currentNode: GitTree;
  createBlobUrl: (path: string) => string;
};

function ArticleList({ createBlobUrl, currentNode }: Props) {
  return (
    <div className="flex flex-col">
      {Object.values(currentNode.blobs).map((blob) => (
        <Item key={blob.path} blob={blob} createBlobUrl={createBlobUrl} />
      ))}
    </div>
  );
}

export default React.memo(ArticleList);
