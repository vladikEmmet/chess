import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import ModeSelection from "./components/ModeSelection";

const Puzzle = lazy(() => import('./components/Puzzle'));
const SinglePlayer = lazy(() => import("./components/SinglePlayer"))

  const App = () => {

    const [mode, setMode] = useState('classic');
    const [time, setTime] = useState(300);

    useEffect(() => {
      document.title = "Chess";
    }, []);

    return (
      <Routes>
        <Route index element={<ModeSelection setTimer={setTime} setMode={setMode} mode={mode} time={time} />} />
        <Route path="singleplayer" element={<SinglePlayer mode={mode} blackTime={time} whiteTime={time} />} />
        <Route path="puzzle" element={<Puzzle />} />
      </Routes>
    )
  }

  export default App;