import { githubClient } from '../httpClient';
import { GITHUB_API_BASE_URL } from '../../utils/constants';

export const getWithUrl = (url: string, params: any) => {
  const baseUrl = GITHUB_API_BASE_URL ?? '';
  const urlWithoutBaseUrl = url.replace(baseUrl, '');
  return githubClient.useConfig().params(params).get(urlWithoutBaseUrl);
};

export const getRepository = (owner: string, repo: string) =>
  githubClient.get(`/repos/${owner}/${repo}`);

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

export const getRateLimit = () => githubClient.get('/rate_limit');
export const postMarkdown = (markdown: string, mode: string = 'gfm') =>
  githubClient.post('/markdown', {
    text: markdown,
    mode,
  });
