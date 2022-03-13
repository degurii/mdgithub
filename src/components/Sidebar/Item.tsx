import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitBlob, GitTree } from '../../pages/Repository';
import { classNames } from '../../utils/tailwind';

type Props = {
  createTreeUrl: (path: string, isRoot?: boolean) => string;
  level: number;
  tree: GitTree;
  isRoot: boolean;
  onClick?: () => void;
};

const paddingLeft: { [level: number]: string } = {
  0: 'pl-2',
  1: 'pl-4',
  2: 'pl-6',
  3: 'pl-8',
  4: 'pl-10',
  5: 'pl-12',
  6: 'pl-14',
};

function Item({ createTreeUrl, level, tree, isRoot, onClick }: Props) {
  const [subtrees, setSubtree] = useState<GitTree[]>([]);
  const [blobs, setBlobs] = useState<GitBlob[]>([]);

  useEffect(() => {
    const subtrees = Object.keys(tree.subtrees).map(
      (name) => tree.subtrees[name],
    );
    setSubtree(subtrees);
    const blobs = Object.keys(tree.blobs).map((name) => tree.blobs[name]);
    setBlobs(blobs);
  }, [tree]);

  return (
    <>
      <Link
        to={createTreeUrl(tree.path, isRoot)}
        className={classNames(
          paddingLeft[Math.min(level, 3)],
          'group rounded-md py-2 pr-2 flex items-center text-sm font-medium',
        )}
        onClick={onClick}
      >
        {tree.name} ({blobs.length ?? 0})
      </Link>
      {subtrees.map((tree) => (
        <Item
          key={tree.path}
          createTreeUrl={createTreeUrl}
          level={isRoot ? 0 : level + 1}
          tree={tree}
          isRoot={false}
          onClick={onClick}
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
