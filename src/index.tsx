import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RootRouter } from '@/routers/RootRouter';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <RootRouter />
  </BrowserRouter>,
);
