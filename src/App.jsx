import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";

import Header from "./layout/header";

import Delivery from "./pages/Delivery";
import Storage from "./pages/Storage";
import Check from "./pages/Check";



function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Delivery />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/check" element={<Check />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
