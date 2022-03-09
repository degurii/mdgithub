import { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getDefaultBranchName, getTrees } from '../../apis/services/github';
import { useAsync, useBoolean } from '../../hooks';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import MainContent from '../../components/MainContent';

type GitBlobResponse = {
  mode: string;
  path: string;
  sha: string;
  size: number;
  type: 'blob';
  url: string;
};
type GitTreeResponse = {
  url: string;
  type: 'tree';
  sha: string;
  path: string;
  mode: string;
};

export class GitTree {
  type: 'tree';
  path: string;
  name: string;
  subtrees: { [name: string]: GitTree };
  blobs: { [name: string]: GitBlob };
  constructor(path: string, name: string) {
    this.type = 'tree';
    this.path = path;
    this.name = name;
    this.subtrees = {};
    this.blobs = {};
  }
}

export class GitBlob {
  type: 'blob';
  path: string;
  name: string;
  size: number;
  sha: string;
  constructor(path: string, name: string, size: number, sha: string) {
    this.type = 'blob';
    this.path = path;
    this.name = name.split('.').slice(0, -1).join('.');
    this.size = size;
    this.sha = sha;
  }
}

export type GitNode = GitTree | GitBlob;

const isGitNodeType = (type: string = '') => type === 'blob' || type === 'tree';

// TODO: 일단은 branch 이름에 슬래시('/')가 안들어가는 케이스만 구현.
// 추후 수정해야 함
const parseUrlParamsWithoutOwnerAndRepo = (params: string) => {
  if (params === '') {
    return {};
  }
  const [type, branch, ...pathParts] = params.split('/');
  return { type, branch, pathParts };
};

export type RepoParams = {
  owner: string;
  repo: string;
  type: string;
  pathParts: string[];
  branch: string;
  defaultBranch: string;
};

function TIL() {
  const params = useParams();
  const navigate = useNavigate();
  const [repoParams, setRepoParams] = useState<RepoParams | undefined>();
  const [currentNode, setCurrentNode] = useState<GitNode | undefined>();
  const [isSidebarOpen, openSidebar, closeSidebar] = useBoolean(false);
  const [repoContentsState] = useAsync(
    async function fetchContents() {
      if (!repoParams) {
        return undefined;
      }
      const { owner, repo, branch } = repoParams;
      const res = await getTrees(owner, repo, branch, {
        recursive: 1,
      });
      return res.data;
    },
    [repoParams],
  );
  const [contentsTree, setContentsTree] = useState<GitTree | undefined>();

  const createTreeUrl = useCallback(
    (path: string, isRoot?: boolean) => {
      if (!repoParams) return '';
      const { owner, repo, branch, defaultBranch } = repoParams;
      if (isRoot && branch === defaultBranch) {
        return `/${owner}/${repo}`;
      }
      return `/${owner}/${repo}/tree/${branch}/${path}`;
    },
    [repoParams],
  );

  const createBlobUrl = useCallback(
    (path: string) => {
      if (!repoParams) return '';
      const { owner, repo, branch } = repoParams;
      return `/${owner}/${repo}/blob/${branch}/${path}`;
    },
    [repoParams],
  );

  useEffect(
    function parseParams() {
      if (!params) {
        return;
      }
      const { owner, repo } = params;
      if (!owner || !repo) {
        return;
      }
      const { type, branch, pathParts } = parseUrlParamsWithoutOwnerAndRepo(
        params['*'] as string,
      );
      if (type && !isGitNodeType(type)) {
        navigate(`/${owner}/${repo}`, { replace: true });
      }
      (async () => {
        const defaultBranch = await getDefaultBranchName(owner, repo);
        setRepoParams({
          owner,
          repo,
          type: type ?? 'tree',
          pathParts: pathParts ?? [],
          branch: branch ?? defaultBranch,
          defaultBranch,
        });
        // console.log('parser:', p, pathParts);
      })();
    },
    [navigate, params],
  );

  useEffect(
    function createContentsTree() {
      if (!repoContentsState.data) {
        return;
      }
      const contents = new GitTree('', 'root');
      const blobs = repoContentsState.data.tree.filter(
        (node: GitTreeResponse | GitBlobResponse) =>
          node.type === 'blob' && node.path.match(/\.md$/),
      ) as GitBlobResponse[];

      blobs.forEach((blob) => {
        const pathParts = blob.path.split('/');
        let currentNode = contents;
        pathParts.forEach((pathPart, index) => {
          if (index === pathParts.length - 1) {
            currentNode.blobs[pathPart] = new GitBlob(
              blob.path,
              pathPart,
              blob.size,
              blob.sha,
            );
            return;
          }
          if (!currentNode.subtrees[pathPart]) {
            const subtreePath =
              currentNode.path !== ''
                ? `${currentNode.path}/${pathPart}`
                : pathPart;
            currentNode.subtrees[pathPart] = new GitTree(subtreePath, pathPart);
          }
          currentNode = currentNode.subtrees[pathPart];
        });
      });
      setContentsTree(contents);
    },
    [repoContentsState],
  );

  useEffect(
    function setCurrentNodeWithParams() {
      if (!contentsTree || !repoParams) {
        return;
      }
      const { type, pathParts } = repoParams;
      if (!type || !isGitNodeType(type)) {
        setCurrentNode(contentsTree);
        return;
      }
      try {
        const node = pathParts.reduce<GitNode>((parentNode, path, index) => {
          const parentTree = parentNode as GitTree;
          // console.log('parentNode:', parentNode);
          if (index === pathParts.length - 1 && type === 'blob') {
            return parentTree.blobs[path];
          } else {
            return parentTree.subtrees[path];
          }
        }, contentsTree);
        if (!node) {
          throw new Error('invalid path');
        }
        setCurrentNode(node);
      } catch (err) {
        console.error(err);
        navigate('/404-not-found', { replace: true });
      }
    },
    [navigate, contentsTree, repoParams],
  );

  if (repoContentsState.error) {
    console.error(repoContentsState.error);
    return <Navigate to={'/404-not-found'} replace={true} />;
  }
  return (
    <div className="flex flex-col h-screen">
      <Header openSidebar={openSidebar} repoParams={repoParams} />
      <div className="flex grow">
        <Sidebar
          closeSidebar={closeSidebar}
          isSidebarOpen={isSidebarOpen}
          createTreeUrl={createTreeUrl}
          rootTree={contentsTree}
        />
        <MainContent
          createBlobUrl={createBlobUrl}
          currentNode={currentNode}
          repoParams={repoParams}
        />
      </div>
    </div>
  );
}

export default TIL;
