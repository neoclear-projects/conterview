import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import React from 'react';

export const browserRouterRef = React.createRef();
export function App() {
  return (
    <BrowserRouter ref={browserRouterRef}>
      <Routes />
    </BrowserRouter>
  );
}
