type ContentType = 'application/json' | 'application/x-www-form-urlencoded';
type RequestType = 'json' | 'form';
type ResponseType = 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text';
type Method = 'GET' | 'get' | 'POST' | 'post' | 'PUT' | 'put' | 'DELETE' | 'delete';

export enum Emethod {
  GET = 'params',
  POST = 'data',
}

export interface IHeader {
  readonly 'Content-Type'?: ContentType;
  authorization?: string;
  [key: string]: any;
}

export interface IcodeMap {
  readonly [key: number]: string;
}

export interface IRefreshToken {
  token: string;
  expireAt: number;
}

export interface IHttpRequestConfig {
  url: string;
  headers?: IHeader;
  method?: Method;
  body?: any;
  requestType?: RequestType;
  responseType?: ResponseType;
  timeout?: number; // 规定超时时间
  signal?: AbortSignal; // AbortSigna 对象实例，它可以用来 with/abort （取消）一个 DOM 请求
}

export interface IHttpReq {
  send({
    url,
    headers,
    method,
    body,
    requestType,
    responseType,
    timeout,
    signal,
  }: IHttpRequestConfig): Promise<HttpReqDataType>;
}

export type HttpReqType<D> = (...params: any[]) => Promise<HttpReqDataType<D>>;

export interface HttpReqDataType<D = any> {
  code: number;
  message: string;
  success: boolean;
  data: D;
}
