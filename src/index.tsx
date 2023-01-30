import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Loader from './components/loader/Loader';
// import Puzzle from './components/Puzzle';

const Puzzle = lazy(() => import('./components/Puzzle'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="puzzle" element={<Puzzle/>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);

