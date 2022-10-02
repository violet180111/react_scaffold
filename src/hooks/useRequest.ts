import { useState, useCallback, useRef } from 'react';
import { useMount } from '.';
import { HttpReqType, HttpReqDataType } from '@/utils/HttpReq/type';

export type requestResult<D> = {
  reqRes?: HttpReqDataType<D>;
  error?: Error;
  loading: boolean;
  run: (...params: any[]) => void;
  runAsync: (...params: any[]) => ReturnType<HttpReqType<D>>;
  refresh: () => void;
  refreshAsync: () => ReturnType<HttpReqType<D>>;
};
export type requestOptions<D> = {
  manual: boolean;
  defaultParams: any[];
  onBefore: (...params: any[]) => void;
  onSuccess: (reqRes: HttpReqDataType<D>, ...params: any[]) => void;
  onError: (error: Error, ...params: any[]) => void;
  onFinally: (reqRes?: HttpReqDataType<D>, e?: Error, ...params: any[]) => void;
};

/**
 * @description: ahooks的简易版useRequest实现
 * @see: 用法请看 https://ahooks.js.org/zh-CN/hooks/use-request/basic/
 */
const useRequest = <D>(request: HttpReqType<D>, options?: Partial<requestOptions<D>>): requestResult<D> => {
  const { manual = false, defaultParams, onBefore, onSuccess, onError, onFinally } = options ?? {};
  const [reqRes, setReqRes] = useState<HttpReqDataType>();
  const [loading, setLoaing] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const paramsRef = useRef<any[] | undefined>(defaultParams);

  const completeRequest = async (defaultParams?: any[]) => {
    const params = (defaultParams ?? []) as any[];

    onBefore?.(...params);
    setLoaing(true);

    try {
      const res = await request(...params);

      onSuccess?.(res, ...params);
      onFinally?.(res, void 0, ...params);
      setReqRes(res);
      setLoaing(false);
    } catch (e) {
      const error = e as Error;

      onError?.(error, ...params);
      onFinally?.(void 0, error, ...params);
      setError(error);
      setLoaing(false);

      console.error(`请求出错: ${error}`);
    }
  };
  const run = useCallback((...params: any[]) => {
    paramsRef.current = params;
    completeRequest(paramsRef.current);
  }, []);
  const runAsync = useCallback((...params: any[]) => {
    paramsRef.current = params;
    return request(...paramsRef.current);
  }, []);
  const refresh = useCallback(() => {
    completeRequest(paramsRef.current);
  }, []);
  const refreshAsync = useCallback(() => {
    const params = (paramsRef.current ?? []) as any[];

    return request(...params);
  }, []);

  useMount(() => {
    manual === false && completeRequest(defaultParams);
  });

  return { reqRes, error, loading, run, runAsync, refresh, refreshAsync };
};

export default useRequest;
