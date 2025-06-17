import { Route, Routes, useLocation } from "react-router-dom";

import "./App.css";

import Header from "./layout/header";
import ScrollTop from "./component/ScrollTop";
// import PrivateRoute from "./component/PrivateRoute"

import Delivery from "./pages/Delivery";
import Storage from "./pages/Storage";
import Check from "./pages/Check";
import Login from "./pages/login";


function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      <ScrollTop />
      {!isLoginPage && <Header />}
      <Routes>
        <Route path="/" element={<Check />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/storage" element={<Storage />} />
      </Routes>
    </>
  );
}

export default App;
