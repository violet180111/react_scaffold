import { Result } from 'antd';
import type { FC, ReactElement } from 'react';

const NotAuthorization: FC = (): ReactElement => {
  return (
    <Result
      status="403"
      style={{
        height: 'calc(100vh - 96px)',
      }}
      subTitle={'你没有此页面的访问权限'}
    />
  );
};

export default NotAuthorization;
