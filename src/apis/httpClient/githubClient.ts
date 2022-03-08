import { GITHUB_API_BASE_URL } from '../../utils/constants';
import { HttpClient, RequestConfig } from './common';

const config: RequestConfig = {
  baseURL: GITHUB_API_BASE_URL,
  headers: { Accept: 'application/vnd.github.v3+json' },
};

class GithubClient extends HttpClient {
  constructor(config: RequestConfig = {}) {
    super(config);

    this.instance.interceptors.response.use(undefined, (err) => {
      console.error(err);
      return Promise.reject(err);
    });
  }
}

export const githubClient = new GithubClient(config);
