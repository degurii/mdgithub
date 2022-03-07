import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  getBlobs,
  getDefaultBranchName,
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
  path: string;
  size: number;
  type: 'blob';
  url: string;
  mode: string;
  sha: string;
};
type GitTreeResponse = {
  mode: string;
  path: string;
  sha: string;
  type: 'tree';
  url: string;
};

export class GitTree {
  type: 'tree';
  path: string;
  name: string;
  subTree: { [name: string]: GitTree };
  blobs: { [name: string]: GitBlob };
  constructor(path: string, name: string) {
    this.type = 'tree';
    this.path = path;
    this.name = name;
    this.subTree = {};
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

const isGitNodeType = (type: string) => type === 'blob' || type === 'tree';

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
      if (!currentNode.subTree[pathPart]) {
        currentNode.subTree[pathPart] = new GitTree(
          `${currentNode.path}/${pathPart}`,
          pathPart,
        );
      }
      currentNode = currentNode.subTree[pathPart];
    });
  });

  console.log('contents:', contents);
  return contents;
};

// TODO: 일단은 branch 이름에 슬래시('/')가 안들어가는 케이스만 구현.
// 추후 수정해야 함
const parseRestParameters = (params: string): RestParams => {
  const [type, branch, ...pathParts] = params.split('/');
  return {
    type,
    branch,
    pathParts,
  };
};

function TIL() {
  const params = useNonUndefinedParams<Params>();
  const { owner, repo } = params;
  const restParams = params['*'];

  const [contentsState] = useAsync(() => {
    const { type, branch } = parseRestParameters(restParams);

    const br = type && isGitNodeType(type) ? branch : undefined;

    return getBranchContents(br);
  }, [owner, repo, restParams]);

  const [currentNode, setCurrentNode] = useState<GitNode | null>(null);
  const [isSidebarOpen, openSidebar, closeSidebar] = useBoolean(false);
  const [article, setArticle] = useState('');

  const getBranchContents = async (branch: string | undefined) => {
    if (!branch) {
      branch = await getDefaultBranchName(owner, repo);
    }
    const treeResponse = await getTrees(owner, repo, branch, { recursive: 1 });
    return createContentsFromTreeResponse(treeResponse.data);
  };

  useEffect(() => {
    if (!contentsState.data) {
      return;
    }
    const { type, pathParts } = parseRestParameters(restParams);
    if (!type || !isGitNodeType(type) || !pathParts) {
      setCurrentNode(contentsState.data);
    } else {
      const node = pathParts?.reduce<GitNode>((parentNode, path, index) => {
        const parentTree = parentNode as GitTree;
        if (index === pathParts.length - 1 && type === 'blob') {
          return parentTree.blobs[path];
        } else {
          return parentTree.subTree[path];
        }
      }, contentsState.data);

      setCurrentNode(node);
    }
  }, [contentsState.data, restParams]);

  useEffect(() => {
    if (!currentNode) {
      return;
    }
    (async () => {
      if (currentNode.type === 'blob') {
        const blob = currentNode as GitBlob;
        const data = await getBlobs(owner, repo, blob.sha)
          .then(({ data }) => decode(data.content))
          .then(postMarkdown)
          .then(({ data }) => data);
        setArticle(data);
      }
    })();
  }, [currentNode, owner, repo]);

  if (contentsState.error) {
    return <Navigate to={'/404-not-found'} replace={true} />;
  }
  return (
    <div className="flex flex-col h-screen">
      <Header openSidebar={openSidebar} owner={owner} repo={repo} />
      <div className="flex grow">
        <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        <MainContent>
          <Article
            loading={contentsState.loading}
            article={{
              text: article,
              type: 'html',
            }}
          />
        </MainContent>
      </div>
    </div>
  );
}

export default TIL;
