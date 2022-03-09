import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitBlob, GitTree } from '../../pages/Repository';
import { classNames } from '../../utils/tailwind';

type Props = {
  createTreeUrl: (path: string, isRoot?: boolean) => string;
  level: number;
  tree: GitTree;
};

function Item({ createTreeUrl, level, tree }: Props) {
  const [subTrees, setSubTree] = useState<GitTree[]>([]);
  const [blobs, setBlobs] = useState<GitBlob[]>([]);

  useEffect(() => {
    const subTrees = Object.keys(tree.subtrees).map(
      (name) => tree.subtrees[name],
    );
    setSubTree(subTrees);
    const blobs = Object.keys(tree.blobs).map((name) => tree.blobs[name]);
    setBlobs(blobs);
  }, [tree]);

  const isRoot = level === 0;
  return (
    <>
      <Link
        to={createTreeUrl(tree.path, isRoot)}
        className={classNames(
          `pl-${2 + level * 2}`,
          'group rounded-md py-2 pr-2 flex items-center text-sm font-medium',
        )}
      >
        {tree.name} ({blobs.length ?? 0})
      </Link>
      {subTrees.map((tree) => (
        <Item
          key={tree.path}
          createTreeUrl={createTreeUrl}
          level={level + 1}
          tree={tree}
        />
      ))}
    </>
  );
  // return (
  //   <a
  //     key={item.name}
  //     href={item.href}
  //     className={classNames(
  //       item.current
  //         ? 'bg-gray-100 text-gray-900'
  //         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
  //       'group rounded-md py-2 px-2 flex items-center text-sm font-medium',
  //     )}
  //   >
  //     {item.name}
  //   </a>
  // );
}

export default React.memo(Item);
