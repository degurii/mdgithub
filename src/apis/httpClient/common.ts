import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export type Instance = AxiosInstance;
export type RequestConfig = AxiosRequestConfig;
export type Response<T = any, D = any> = AxiosResponse<T, D>;

// 추후 다른 http 메서드도 쓰게 되면 추가해야 함
export class HttpClient {
  instance: Instance;

  constructor(config: RequestConfig) {
    this.instance = axios.create(config);
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

  params(params: Object) {
    this.config.params = params;
    return this;
  }

  get(url: string) {
    return this.client.get(url, this.config);
  }

  post(url: string, data?: any) {
    return this.client.post(url, data, this.config);
  }
}
