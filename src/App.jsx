import React from "react";
import { Route, Routes } from "react-router-dom";
import Looby from "./pages/Looby";
import Room from "./pages/Room";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Looby />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </>
  );
}

export default App;
