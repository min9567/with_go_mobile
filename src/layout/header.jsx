import Header from "../css/Header.module.css";
import logo from "../images/withgo.svg";
import logout from "../images/Logout.svg"

import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function header() {
  const navigate = useNavigate();

  const Logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };


  return (
    <div className={Header.content}>
      <div className={Header.title}>
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
        <button className={Header.logout} onClick={Logout}>
          <img src={logout} alt="" />
        </button>
      </div>
      <div className={Header.menu}>
        <Link to="/delivery">배송</Link>
        <Link to="/storage">보관</Link>
        <Link to="/">조회</Link>
      </div>
    </div>
  );
}

export default header;
