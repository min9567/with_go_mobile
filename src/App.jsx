import { Route, Routes, useLocation } from "react-router-dom";

import "./App.css";

import Header from "./layout/header";
import ScrollTop from "./component/ScrollTop";
import PrivateRoute from "./component/PrivateRoute"

import Delivery from "./pages/Delivery";
import DeliveryDetail from "./pages/DeliveryDetail";
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
        <Route path="/" element={<PrivateRoute><Check /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/delivery" element={<PrivateRoute><Delivery /></PrivateRoute>} />
        <Route path="/delivery/detail" element={<PrivateRoute><DeliveryDetail /></PrivateRoute>} />
        <Route path="/storage" element={<PrivateRoute><Storage /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;
