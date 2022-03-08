import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  getBlobs,
  getDefaultBranchName,
  getRateLimit,
  getTrees,
  postMarkdown,
} from '../../apis/services/github';
import { useAsync, useBoolean, useNonUndefinedParams } from '../../hooks';
import { decode } from 'js-base64';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import MainContent from '../../components/MainContent';
import Article from '../../components/Article';

type Params = {
  owner: string;
  repo: string;
  '*': string;
};

type RestParams = {
  type?: string;
  branch?: string;
  pathParts?: string[];
};

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
  subTrees: { [name: string]: GitTree };
  blobs: { [name: string]: GitBlob };
  constructor(path: string, name: string) {
    this.type = 'tree';
    this.path = path;
    this.name = name;
    this.subTrees = {};
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

const createContentsFromTreeResponse = (treeResponse: any): GitTree => {
  const contents = new GitTree('', 'root');

  const blobs = treeResponse.tree.filter(
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
      if (!currentNode.subTrees[pathPart]) {
        currentNode.subTrees[pathPart] = new GitTree(
          `${currentNode.path}/${pathPart}`,
          pathPart,
        );
      }
      currentNode = currentNode.subTrees[pathPart];
    });
  });

  console.log('contents:', contents);
  return contents;
};

// TODO: 일단은 branch 이름에 슬래시('/')가 안들어가는 케이스만 구현.
// 추후 수정해야 함
const parseUrlParamsWithoutOwnerAndRepo = (params: string = '') => {
  const [type, branch, ...pathParts] = params.split('/');
  return { type, branch, pathParts };
};

export type RepoParams = {
  owner: string;
  repo: string;
  type: string;
  branch: string;
  defaultBranch: string;
};

function TIL() {
  const params = useParams();
  const navigate = useNavigate();
  const [repoParams, setRepoParams] = useState<RepoParams | undefined>();
  const [currentPathParts, setCurrentPathParts] = useState<
    string[] | undefined
  >();
  const [currentNode, setCurrentNode] = useState<GitNode | undefined>();
  const [isSidebarOpen, openSidebar, closeSidebar] = useBoolean(false);
  const [contentsState] = useAsync(
    async function fetchContentsAndCreateTree() {
      if (!repoParams) {
        return undefined;
      }
      const { owner, repo, branch } = repoParams;
      const treeResponse = await getTrees(owner, repo, branch, {
        recursive: 1,
      });
      return createContentsFromTreeResponse(treeResponse.data);
    },
    [repoParams],
  );
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
          branch: branch ?? defaultBranch,
          defaultBranch,
        });
        setCurrentPathParts(pathParts);
      })();
    },
    [navigate, params],
  );

  useEffect(
    function setCurrentNodeFromParams() {
      if (
        !repoParams ||
        !currentPathParts ||
        !contentsState.data ||
        contentsState.loading
      ) {
        return;
      }
      console.log('repoParams:', repoParams);
      const { type } = repoParams;
      if (!type || !isGitNodeType(type) || !currentPathParts) {
        setCurrentNode(contentsState.data);
      } else {
        try {
          const node = currentPathParts?.reduce<GitNode>(
            (parentNode, path, index) => {
              const parentTree = parentNode as GitTree;
              if (index === currentPathParts.length - 1 && type === 'blob') {
                return parentTree.blobs[path];
              } else {
                return parentTree.subTrees[path];
              }
            },
            contentsState.data,
          );
          if (!node) {
            throw new Error('node is not found');
          }
          setCurrentNode(node);
        } catch (e) {
          navigate('/404-not-found', { replace: true });
        }
      }
    },
    [contentsState, currentPathParts, repoParams, navigate],
  );

  if (contentsState.error || articleState.error) {
    return <Navigate to={'/404-not-found'} replace={true} />;
  }
  return (
    <div className="flex flex-col h-screen">
      <Header openSidebar={openSidebar} repoParams={repoParams} />
      <div className="flex grow">
        <Sidebar
          closeSidebar={closeSidebar}
          isSidebarOpen={isSidebarOpen}
          loading={contentsState.loading}
          repoParams={repoParams}
          rootTree={contentsState.data}
        />
        <MainContent>
          <Article
            loading={contentsState.loading || articleState.loading}
            article={{
              text: articleState.data,
              type: 'html',
            }}
          />
        </MainContent>
      </div>
    </div>
  );
}

export default TIL;
