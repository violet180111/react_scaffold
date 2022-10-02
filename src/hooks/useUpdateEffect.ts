import { useEffect, useRef } from 'react';

/**
 * @description: useUpdateEffect 用法等同于 useEffect，但是会忽略首次执行，只在依赖更新时执行。
 * @param effect 回调函数
 * @param deps 更新依赖
 */
export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirst = useRef(false);

  useEffect(() => {
    return () => {
      isFirst.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isFirst.current) {
      isFirst.current = true;
    } else {
      return effect();
    }
  }, deps);
};

export default useUpdateEffect;
