import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import isDev from '../../utils/devDetect';

export type Instance = AxiosInstance;
export type RequestConfig = AxiosRequestConfig;
export type RequestHeaders = AxiosRequestHeaders;
export type Response<T = any, D = any> = AxiosResponse<T, D>;

// 추후 다른 http 메서드도 쓰게 되면 추가해야 함
export class HttpClient {
  instance: Instance;

  constructor(config: RequestConfig) {
    this.instance = axios.create(config);

    this.instance.interceptors.response.use(
      (res) => {
        if (isDev()) {
          console.log(res.headers['x-ratelimit-remaining']);
        }
        return res;
      },
      (err) => {
        throw new Error(err);
      },
    );
  }

  useConfig(config: RequestConfig = {}): ConfigBuilder {
    return new ConfigBuilder(this, config);
  }

  get(url: string, config: RequestConfig = {}): Promise<Response<any, any>> {
    return this.instance.get(url, config);
  }

  post(
    url: string,
    data?: any,
    config: RequestConfig = {},
  ): Promise<Response<any, any>> {
    return this.instance.post(url, data, config);
  }
}

// 사용할 http method, config가 추가될 때마다 ConfigBuilder 메서드도 추가해줄 것
class ConfigBuilder {
  client: HttpClient;
  config: RequestConfig;

  constructor(client: HttpClient, config: RequestConfig = {}) {
    this.config = config;
    this.client = client;
  }

  params(params: any) {
    this.config.params = params;
    return this;
  }

  headers(headers: RequestHeaders) {
    this.config.headers = headers;
    return this;
  }

  get(url: string) {
    return this.client.get(url, this.config);
  }

  post(url: string, data?: any) {
    return this.client.post(url, data, this.config);
  }
}
