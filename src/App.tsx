import { useState } from 'react';
import { Button } from 'antd';
import type { FC, ReactElement } from 'react';

const App: FC = (): ReactElement => {
  const [count, setCount] = useState<number>(0);

  return (
    <div css={{ display: 'flex' }}>
      <Button onClick={() => setCount((preCount) => preCount + 1)}>{count}</Button>
    </div>
  );
};

export default App;
