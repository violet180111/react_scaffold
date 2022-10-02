import { Suspense, lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import { meunConfig } from './meunConfig';
import Loading from '@/components/Loading';
import type { IRouter } from './type';

const routers: Array<IRouter> = [];
const ctx = require.context('@/pages', true, /index\.tsx/);
const keys = ctx.keys().filter((k) => k.indexOf('./') === -1);

for (let i = 0; i < meunConfig.length; i++) {
  const LazyComponent = lazy(() => import(`@/${keys[i]}`));

  const router = {
    path: meunConfig[i].path,
    element: (
      <Suspense fallback={<Loading />}>
        <LazyComponent />
      </Suspense>
    ),
  };

  routers.push(router);
}

export const RootRouter = () => useRoutes(routers);
