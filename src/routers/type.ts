import type { ReactElement } from 'react';

export interface IMeun {
  key: string;
  path: string;
  icon: ReactElement;
  label: ReactElement;
}

export interface IRouter {
  path: string;
  element: ReactElement;
}
