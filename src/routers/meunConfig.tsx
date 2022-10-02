import { Link } from 'react-router-dom';
import IconFont from '@/components/Iconfont';
import type { IMeun } from './type';

export const meunConfig: Array<IMeun> = [
  {
    key: '/test1',
    path: '/test1',
    icon: <IconFont type="icon-ceshi" />,
    label: <Link to="/test1">Test1</Link>,
  },
  {
    key: '/test2',
    path: '/test2',
    icon: <IconFont type="icon-ceshi" />,
    label: <Link to="/test2">Test2</Link>,
  },
  {
    key: '/test3',
    path: '/test3',
    icon: <IconFont type="icon-ceshi" />,
    label: <Link to="/test3">Test3</Link>,
  },
];
