import { useEffect, useRef } from 'react';

type VoidFn = () => void;

const useUnmount = (fn: VoidFn) => {
  const fnRef = useRef<VoidFn>(() => {});

  fnRef.current = fn;

  useEffect(
    () => () => {
      fnRef.current();
    },
    [],
  );
};

export default useUnmount;
