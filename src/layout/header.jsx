import React from "react";
import Header from "../css/Header.module.css";

import logo from "../images/withgo.svg";

import { Link } from "react-router-dom";

function header() {
  return (
    <div className={Header.content}>
      <div className={Header.title}>
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
        <button className={Header.logout}>로그아웃</button>
      </div>
      <div className={Header.menu}>
        <Link to="/">배송</Link>
        <Link to="/storage">보관</Link>
        <Link to="/check">조회</Link>
      </div>
    </div>
  );
}

export default header;
