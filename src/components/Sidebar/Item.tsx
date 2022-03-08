import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitBlob, GitTree, RepoParams } from '../../pages/TIL';
import { classNames } from '../../utils/tailwind';

type Props = {
  level: number;
  repoParams: RepoParams;
  tree: GitTree;
};

function Item({ level, repoParams, tree }: Props) {
  const [subTrees, setSubTree] = useState<GitTree[]>([]);
  const [blobs, setBlobs] = useState<GitBlob[]>([]);
  const { owner, repo, branch, defaultBranch } = repoParams;

  const linkUrl =
    level === 0 && branch === defaultBranch
      ? `/${owner}/${repo}`
      : `/${owner}/${repo}/tree/${branch}${tree.path}`;

  useEffect(() => {
    const subTrees = Object.keys(tree.subTrees).map(
      (name) => tree.subTrees[name],
    );
    setSubTree(subTrees);
    const blobs = Object.keys(tree.blobs).map((name) => tree.blobs[name]);
    setBlobs(blobs);
  }, [tree]);

  return (
    <>
      <Link
        to={linkUrl}
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
          level={level + 1}
          repoParams={repoParams}
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
