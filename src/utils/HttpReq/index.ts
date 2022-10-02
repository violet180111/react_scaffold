import { extend, RequestMethod, ResponseError } from 'umi-request';
import { message } from 'antd';
import type { IHttpRequestConfig, IHttpReq, IcodeMap } from './type';

/**
 * @description 基于umi-request封装的请求
 * @see https://github.com/umijs/umi-request/blob/master/README_zh-CN.md
 * @param url 请求地址 可只传一个url参数 例： httpReq.send('http://127.0.0.1:8081/api/xxx') 这样的意思就是默认发get请求不带任何数据
 * @param headers 自定义请求头 可不传
 * @param method 请求方式 可不传 默认get
 * @param body  要传的数据 无论是get或是post请求都是body 会自动做转换
 * @param requestType 请求数据类型 可不传 默认json 还有一种form
 * @param responseType 响应数据类型 可不传 默认json 还有text , blob , formData...
 * @param signal 一个 AbortSignal 对象实例，它可以用来 with/abort 一个 DOM 请求（暂时用不到）
 * @return promise对象
 */
class HttpReq implements IHttpReq {
  private static readonly codeMap: IcodeMap = {
    400: '客户端请求的语法错误，服务器无法理解',
    401: '请求要求用户的身份认证',
    402: '保留，将来使用',
    403: '服务器理解请求客户端的请求，但是拒绝执行此请求',
    404: '服务器无法根据客户端的请求找到资源',
    405: '客户端请求中的方法被禁止',
    406: '服务器无法根据客户端请求的内容特性完成请求',
    407: '请求要求代理的身份认证',
    408: '服务器等待客户端发送的请求时间过长，超时',
    409: '服务器完成客户端的 PUT 请求时可能返回此代码，服务器处理请求时发生了冲突',
    410: '客户端请求的资源已经不存在',
    411: '服务器无法处理客户端发送的不带Content-Length的请求信息',
    412: '客户端请求信息的先决条件错误',
    413: '由于请求的实体过大，服务器无法处理，因此拒绝请求',
    414: '请求的URI过长（URI通常为网址），服务器无法处理',
    415: '服务器无法处理请求附带的媒体格式',
    416: '客户端请求的范围无效',
    417: '服务器无法满足Expect的请求头信息',
    500: '服务器内部错误，无法完成请求',
    501: '服务器不支持请求的功能，无法完成请求',
    502: '作为网关或者代理工作的服务器尝试执行请求时，从远程服务器接收到了一个无效的响应',
    503: '由于超载或系统维护，服务器暂时的无法处理客户端的请求',
    504: '充当网关或代理的服务器，未及时从远端服务器获取请求',
    505: '服务器不支持请求的HTTP协议的版本，无法完成处理',
  };

  private constructor() {
    // 全局请求拦截器
    HttpReq.requestInstance.interceptors.request.use((url, options) => {
      return {
        url,
        options,
      };
    });
    // 全局响应拦截器
    HttpReq.requestInstance.interceptors.response.use(async (response): Promise<any> => {
      const { status }: { status: number } = response;
      const { code, message: errorText }: { code: number; message: string } = await response.clone().json();
      if (status === 200 && code !== 200) {
        message.destroy();
        message.error(errorText);
      }
      return response;
    });
  }

  private static readonly requestInstance: RequestMethod = extend({
    // credentials 是Fetch接口的只读属性，用于表示用户代理是否应该在跨域请求的情况下从其他域发送cookies
    credentials: 'include',
    prefix: '/api/v1',
    errorHandler: HttpReq.errorHandler,
  });

  private static instance: HttpReq;
  static readonly getInstance = (): HttpReq => {
    if (!this.instance) {
      this.instance = new HttpReq();
    }
    return this.instance;
  };

  // 全局错误处理函数
  private static errorHandler(error: ResponseError) {
    const { response } = error;

    message.destroy();

    if (response && response.status) {
      const errorText = HttpReq.codeMap[response.status] || response.statusText;

      message.error(errorText);
    } else if (!response) {
      message.error('抱歉，好像出错了！');
    }

    throw new Error('Request error！');
  }

  send<P>(option: IHttpRequestConfig | string): Promise<P> {
    const { url, headers, method, body, requestType, responseType, signal } = option as IHttpRequestConfig;

    if (typeof option === 'string') {
      return HttpReq.requestInstance(option);
    }

    return HttpReq.requestInstance(url, {
      headers,
      method,
      [method?.toUpperCase() === 'POST' ? 'data' : 'params']: body,
      requestType,
      responseType,
      signal,
    });
  }
}

// 单例模式导出
export default HttpReq.getInstance();
