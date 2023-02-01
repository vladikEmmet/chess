import {StrictMode, Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Loader from './components/loader/Loader';
import MobilePage from './components/MobilePage/MobilePage';
import  * as serviceWorker from "./serviceWorker";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const isMobile = /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(navigator.userAgent);

root.render(
  isMobile ? 
  <MobilePage /> :
  
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);

serviceWorker.unregister();
