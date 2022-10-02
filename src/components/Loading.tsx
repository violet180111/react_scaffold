import { Spin } from 'antd';
import commonStyles from '@/utils/commonStyles';
import type { FC, ReactElement } from 'react';

const Loading: FC = (): ReactElement => {
  return (
    <div
      css={{
        ...commonStyles.center_flex,
        height: '100%',
      }}
    >
      <Spin size="large" tip="页面加载中，请稍候..." />
    </div>
  );
};

export default Loading;
