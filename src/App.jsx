import { Route, Routes, useLocation } from "react-router-dom";


import "./App.css";

import Header from "./layout/header";
import ScrollTop from "./component/ScrollTop";
import PrivateRoute from "./component/PrivateRoute"
import PushInit from "./component/PushInit";

import Delivery from "./pages/Delivery";
import DeliveryDetail from "./pages/DeliveryDetail";
import DeliveryPayment from "./pages/DeliveryPayment";

import Storage from "./pages/Storage";
import StorageDetail from "./pages/StorageDetail";
import StoragePayment from "./pages/StoragePayment";

import Check from "./pages/Check";
import Login from "./pages/login";

    function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      <PushInit />
      <ScrollTop />
      {!isLoginPage && <Header />}
      <Routes>
        <Route path="/" element={<PrivateRoute><Check /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/delivery" element={<PrivateRoute><Delivery /></PrivateRoute>} />
        <Route path="/delivery/detail" element={<PrivateRoute><DeliveryDetail /></PrivateRoute>} />
        <Route path="/delivery-payment-success" element={<PrivateRoute><DeliveryPayment /></PrivateRoute>} />
        <Route path="/storage" element={<PrivateRoute><Storage /></PrivateRoute>} />
        <Route path="/storage/detail" element={<PrivateRoute><StorageDetail /></PrivateRoute>} />
        <Route path="/storage-payment-success" element={<PrivateRoute><StoragePayment /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;
