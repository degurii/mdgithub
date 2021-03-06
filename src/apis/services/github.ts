import { githubClient } from '../httpClient';
import { GITHUB_API_BASE_URL } from '../../utils/constants';
import { decode } from 'js-base64';

export const getWithUrl = (url: string, params: any) => {
  const baseUrl = GITHUB_API_BASE_URL ?? '';
  const urlWithoutBaseUrl = url.replace(baseUrl, '');
  return githubClient.useConfig().params(params).get(urlWithoutBaseUrl);
};

export const getRepository = (owner: string, repo: string) =>
  githubClient.get(`/repos/${owner}/${repo}`);

export const getDefaultBranchName = (
  owner: string,
  repo: string,
): Promise<string> =>
  getRepository(owner, repo).then(({ data }) => data.default_branch);

export const getTrees = (
  owner: string,
  repo: string,
  sha: string,
  params: any,
) =>
  githubClient
    .useConfig()
    .params(params)
    .get(`/repos/${owner}/${repo}/git/trees/${sha}`);

export const getBlobs = (owner: string, repo: string, sha: string) =>
  githubClient.get(`/repos/${owner}/${repo}/git/blobs/${sha}`);

export const getRawBlobs = (owner: string, repo: string, sha: string) =>
  githubClient
    .useConfig()
    .headers({
      Accept: 'application/vnd.github.v3+json',
    })
    .get(`/repos/${owner}/${repo}/git/blobs/${sha}`);

export const getRateLimit = () => githubClient.get('/rate_limit');

export const postMarkdown = (markdown: string, mode: string = 'gfm') =>
  githubClient.post('/markdown', {
    text: markdown,
    mode,
  });

export const getMarkdownBlobAndConvertToHtml = (
  owner: string,
  repo: string,
  sha: string,
): Promise<string> =>
  getRawBlobs(owner, repo, sha)
    .then(({ data }) => decode(data.content))
    .then(postMarkdown)
    .then(({ data: articleHtml }) => articleHtml);
