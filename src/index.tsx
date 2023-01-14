import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Puzzle from './components/Puzzle';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<App />} />
       <Route path="puzzle" element={<Puzzle/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

