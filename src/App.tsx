/* @jsxImportSource @emotion/react */
import { Button } from 'antd';
import type { FC, ReactElement } from 'react';

const App: FC = (): ReactElement => {
  return (
    <div css={{ display: 'flex' }}>
      <Button>react-hotModule-replace</Button>
      <input type="text" name="" id="" />
    </div>
  );
};

export default App;
