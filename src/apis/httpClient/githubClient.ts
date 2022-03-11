import { GITHUB_API_BASE_URL } from '../../utils/constants';
import { HttpClient, RequestConfig } from './common';

const config: RequestConfig = {
  baseURL: GITHUB_API_BASE_URL,
  headers: { Accept: 'application/vnd.github.v3+json' },
};

class GithubClient extends HttpClient {
  constructor(config: RequestConfig = {}) {
    super(config);
  }
}

export const githubClient = new GithubClient(config);
