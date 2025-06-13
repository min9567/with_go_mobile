import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";

import Header from "./layout/header";
import ScrollTop from "./component/ScrollTop";

import Delivery from "./pages/Delivery";
import Storage from "./pages/Storage";
import Check from "./pages/Check";



function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollTop />
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
